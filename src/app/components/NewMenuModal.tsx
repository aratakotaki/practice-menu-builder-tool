import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { X, Loader2, Calendar, Clock, Copy, FilePlus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { supabaseUrl, publicAnonKey } from '/utils/supabase/info';
import { Menu } from '../types';

interface NewMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedDate: string, sourceMenu: Menu | null) => void;
  /** Pre-select a date (e.g. from calendar click) */
  preselectedDate?: string;
}

type CreationMode = 'scratch' | 'duplicate';

export function NewMenuModal({ isOpen, onClose, onConfirm, preselectedDate }: NewMenuModalProps) {
  const today = format(new Date(), 'yyyy-MM-dd');

  const [selectedDate, setSelectedDate] = useState(preselectedDate ?? today);
  const [mode, setMode] = useState<CreationMode>('scratch');
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoadingMenus, setIsLoadingMenus] = useState(false);
  const [selectedSourceMenu, setSelectedSourceMenu] = useState<Menu | null>(null);
  const [menusError, setMenusError] = useState<string | null>(null);

  const fetchMenus = useCallback(async () => {
    setIsLoadingMenus(true);
    setMenusError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMenusError('ログインが必要です');
        return;
      }
      const res = await fetch(
        `${supabaseUrl}/functions/v1/make-server-791d0b68/menus`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'X-User-Token': session.access_token,
          },
        }
      );
      if (!res.ok) throw new Error(`Failed to fetch menus (${res.status})`);
      const data = await res.json();
      const sorted: Menu[] = (data.menus ?? []).sort(
        (a: Menu, b: Menu) => new Date(b.baseDate).getTime() - new Date(a.baseDate).getTime()
      );
      setMenus(sorted);
    } catch (e: any) {
      console.error(e);
      setMenusError(e.message ?? 'エラーが発生しました');
    } finally {
      setIsLoadingMenus(false);
    }
  }, []);

  // Sync preselectedDate when it changes
  useEffect(() => {
    if (preselectedDate) setSelectedDate(preselectedDate);
  }, [preselectedDate]);

  // Fetch past menus when switching to duplicate mode
  useEffect(() => {
    if (!isOpen || mode !== 'duplicate') return;
    fetchMenus();
  }, [isOpen, mode, fetchMenus]);

  const handleConfirm = () => {
    if (!selectedDate) return;
    if (mode === 'duplicate' && !selectedSourceMenu) return;
    onConfirm(selectedDate, mode === 'duplicate' ? selectedSourceMenu : null);
    // Reset internal state for next open
    setMode('scratch');
    setSelectedSourceMenu(null);
  };

  const handleClose = () => {
    setMode('scratch');
    setSelectedSourceMenu(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900">新規メニューを作成</h2>
          <button
            onClick={handleClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1 -mt-0.5 text-blue-600" />
              練習日
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Mode Selector */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-3">作成方法</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('scratch')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  mode === 'scratch'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <FilePlus className="w-6 h-6" />
                <span className="text-xs font-bold text-center leading-tight">
                  一から<br />新規作成
                </span>
              </button>
              <button
                onClick={() => setMode('duplicate')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  mode === 'duplicate'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <Copy className="w-6 h-6" />
                <span className="text-xs font-bold text-center leading-tight">
                  過去メニューを<br />参照して複製
                </span>
              </button>
            </div>
          </div>

          {/* Past Menu List (only in duplicate mode) */}
          {mode === 'duplicate' && (
            <div>
              <p className="text-sm font-bold text-gray-700 mb-2">参照するメニューを選択</p>
              {isLoadingMenus ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : menusError ? (
                <div className="text-center py-6 text-sm text-red-500">
                  {menusError}
                  <button onClick={fetchMenus} className="block mx-auto mt-2 text-blue-600 underline text-xs">
                    再試行
                  </button>
                </div>
              ) : menus.length === 0 ? (
                <div className="text-center py-6 text-sm text-gray-400">
                  保存済みのメニューがありません
                </div>
              ) : (
                <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                  {menus.map((menu) => (
                    <button
                      key={menu.id}
                      onClick={() => setSelectedSourceMenu(menu)}
                      className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                        selectedSourceMenu?.id === menu.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <p className="font-bold text-sm text-gray-900 truncate">
                        {menu.title || '無題のメニュー'}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {menu.baseDate ? format(new Date(menu.baseDate), 'yyyy/MM/dd') : '-'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {menu.baseStartTime ?? '-'}
                        </span>
                        <span className="ml-auto">{menu.items?.length ?? 0} items</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedDate || (mode === 'duplicate' && !selectedSourceMenu)}
            className="flex-1 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            作成する
          </button>
        </div>
      </div>
    </div>
  );
}
