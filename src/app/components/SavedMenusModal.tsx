import React, { useEffect, useState } from 'react';
import { supabaseUrl, publicAnonKey } from '../../../utils/supabase/info';
import { supabase } from '../../lib/supabase';
import { X, Loader2, Calendar, Clock, Trash2 } from 'lucide-react';
import { Drawer } from 'vaul';
import { format } from 'date-fns';

interface SavedMenusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (menu: any) => void;
}

export function SavedMenusModal({ isOpen, onClose, onLoad }: SavedMenusModalProps) {
  const [menus, setMenus] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenus = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(`${supabaseUrl}/functions/v1/make-server-791d0b68/menus`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-User-Token': session.access_token
        }
      });

      let data: any = {};
      try {
        data = await response.json();
      } catch (e) {
        console.error('Failed to parse response JSON', e);
      }

      if (!response.ok) {
        throw new Error(data?.error || `Failed to fetch menus (${response.status})`);
      }
      
      setMenus(data?.menus || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMenu = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('このメニューを削除してもよろしいですか？')) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(`${supabaseUrl}/functions/v1/make-server-791d0b68/menus/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-User-Token': session.access_token
        }
      });

      if (!response.ok) throw new Error('Failed to delete menu');
      
      setMenus(menus.filter(m => m.id !== id));
    } catch (err: any) {
      console.error(err);
      alert('削除に失敗しました');
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMenus();
    }
  }, [isOpen]);

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 max-h-[90vh] bg-white rounded-t-[10px] z-50 flex flex-col focus:outline-none">
          <div className="p-4 bg-white rounded-t-[10px] flex-none max-w-md mx-auto w-full h-full flex flex-col">
            <div className="mx-auto w-12 h-1.5 rounded-full bg-gray-300 mb-5" />
            
            <div className="flex items-center justify-between mb-4">
              <Drawer.Title className="text-xl font-bold text-gray-900">保存済みメニュー</Drawer.Title>
              <Drawer.Description className="sr-only">
                保存されたメニューの一覧です
              </Drawer.Description>
              <button 
                onClick={onClose}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">
                {error}
                <button onClick={fetchMenus} className="block mx-auto mt-2 text-blue-600 underline">再試行</button>
              </div>
            ) : menus.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                保存されたメニューはありません
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto flex-1 pb-safe">
                {menus.map((menu) => (
                  <div
                    key={menu.id}
                    onClick={() => {
                      onLoad(menu);
                      onClose();
                    }}
                    className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-sm transition-all cursor-pointer group relative"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 text-lg line-clamp-1 pr-8">{menu.title || '無題のメニュー'}</h3>
                      <button
                        onClick={(e) => deleteMenu(menu.id, e)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {menu.baseDate ? format(new Date(menu.baseDate), 'yyyy/MM/dd') : '-'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {menu.baseStartTime || '-'}
                      </div>
                      <div className="ml-auto">
                        {menu.items?.length || 0} items
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
