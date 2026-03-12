import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Loader2, BookOpen, Calendar, Clock, ChevronRight, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { supabaseUrl, publicAnonKey } from '../../../utils/supabase/info';
import { Menu } from '../types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Toaster, toast } from 'sonner';

export default function Library() {
  const navigate = useNavigate();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session) fetchMenus(session);
      else setIsLoading(false);
    });
  }, []);

  const fetchMenus = async (session: any) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/make-server-791d0b68/menus`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-User-Token': session.access_token
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.menus) {
          const sorted = (data.menus as Menu[]).sort((a, b) => 
            new Date(b.baseDate).getTime() - new Date(a.baseDate).getTime()
          );
          setMenus(sorted);
        }
      }
    } catch (e) {
      console.error("Failed to fetch menus", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (menuId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('このメニューを削除しますか？')) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(`${supabaseUrl}/functions/v1/make-server-791d0b68/menus/${menuId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-User-Token': session.access_token
        }
      });

      if (res.ok) {
        setMenus(prev => prev.filter(m => m.id !== menuId));
        toast.success('メニューを削除しました');
      } else {
        toast.error('削除に失敗しました');
      }
    } catch (e) {
      console.error(e);
      toast.error('エラーが発生しました');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center sticky top-0 z-10 shadow-sm">
        <button 
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="font-bold text-lg text-gray-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          メニューライブラリ
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 max-w-3xl mx-auto w-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : menus.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <BookOpen className="w-12 h-12 mb-2 opacity-20" />
            <p>保存されたメニューはありません</p>
          </div>
        ) : (
          <div className="space-y-3">
            {menus.map((menu) => {
              const drillCount = menu.items ? menu.items.length : 0;
              const totalDuration = menu.items 
                ? menu.items.reduce((acc, item) => {
                    const drillTime = item.durationMin * 60 + item.durationSec;
                    const totalTime = drillTime * item.sets + (item.restSeconds || 0) * Math.max(0, item.sets - 1);
                    return acc + totalTime;
                  }, 0) / 60
                : 0;

              return (
                <div 
                  key={menu.id}
                  onClick={() => navigate(`/editor/${menu.id}`)}
                  className="w-full bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group text-left cursor-pointer relative"
                >
                  <div className="flex-1 min-w-0 pr-10">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(menu.baseDate), 'yyyy年M月d日 (EEE)', { locale: ja })}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg truncate mb-1">
                      {menu.title || '無題のメニュー'}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        メニュー数: {drillCount}
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>約 {Math.round(totalDuration)} 分</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                       onClick={(e) => handleDelete(menu.id, e)}
                       className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
                       title="削除"
                    >
                       <Trash2 className="w-5 h-5" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
