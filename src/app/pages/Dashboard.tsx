import React, { useState, useEffect, useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, parseISO, isSameDay, startOfToday, isAfter } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase';
import { supabaseUrl, publicAnonKey } from '/utils/supabase/info';
import { Menu } from '../types';
import { Plus, Edit, Calendar as CalendarIcon, Loader2, Clock, Trash2, ArrowRight } from 'lucide-react';
import 'react-day-picker/dist/style.css';
import { Toaster, toast } from 'sonner';
import { Layout } from '../components/Layout';
import { NewMenuModal } from '../components/NewMenuModal';

export default function Dashboard() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isNewMenuModalOpen, setIsNewMenuModalOpen] = useState(false);
  const [newMenuPreselectedDate, setNewMenuPreselectedDate] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const openNewMenuModal = (preselectedDate?: string) => {
    setNewMenuPreselectedDate(preselectedDate);
    setIsNewMenuModalOpen(true);
  };

  const handleNewMenuConfirm = (dateStr: string, sourceMenu: Menu | null) => {
    setIsNewMenuModalOpen(false);
    navigate('/editor', { state: { newDate: dateStr, sourceMenu } });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session) {
        fetchMenus(session);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) {
        fetchMenus(session);
      } else {
        setMenus([]);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
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
           setMenus(data.menus);
        }
      } else {
        console.error("Failed to fetch menus");
      }
    } catch (e) {
      console.error(e);
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

  // Find next upcoming practice
  const nextPractice = useMemo(() => {
    if (!menus.length) return null;
    const today = startOfToday();
    
    // Sort by date ascending, filter for >= today
    const upcoming = menus
      .filter(m => {
        if (!m.baseDate) return false;
        const menuDate = parseISO(m.baseDate);
        // Include today's practices
        return isAfter(menuDate, today) || isSameDay(menuDate, today);
      })
      .sort((a, b) => new Date(a.baseDate).getTime() - new Date(b.baseDate).getTime());

    return upcoming[0] || null;
  }, [menus]);

  // Filter menus for selected date
  const selectedMenus = menus.filter(m => selectedDate && m.baseDate && isSameDay(parseISO(m.baseDate), selectedDate));

  // Modifiers for calendar (dots)
  const modifiers = {
    hasMenu: (date: Date) => menus.some(m => m.baseDate && isSameDay(parseISO(m.baseDate), date))
  };

  return (
    <>
    <Layout>
      <style>{`
        .rdp-day_hasMenu {
          font-weight: bold;
        }
        .rdp-day_hasMenu::after {
          content: '';
          display: block;
          width: 5px;
          height: 5px;
          background-color: #2563EB;
          border-radius: 50%;
          margin: 0 auto;
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
        }
        .rdp-day_selected { 
          background-color: #2563EB !important; 
          color: white !important;
        }
        .rdp-day_selected::after {
          background-color: white !important;
        }
        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
          background-color: #F3F4F6;
        }
      `}</style>
      <Toaster position="top-right" richColors />

      <div className="max-w-5xl mx-auto w-full p-4 md:p-8 flex flex-col md:flex-row gap-8">
        {/* Left: Calendar */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center h-fit">
          <div className="w-full flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
               <CalendarIcon className="w-5 h-5 text-blue-600" />
               カレンダー
             </h2>
             {user && (
                 <button 
                   onClick={() => openNewMenuModal(selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined)}
                   className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
                 >
                   <Plus className="w-4 h-4" /> 新規作成
                 </button>
             )}
          </div>
          
          <div className="bg-white rounded-xl border border-gray-100 p-2 shadow-sm">
             <DayPicker
               mode="single"
               selected={selectedDate}
               onSelect={setSelectedDate}
               locale={ja}
               modifiers={modifiers}
               modifiersClassNames={{ hasMenu: 'rdp-day_hasMenu' }}
               styles={{
                 caption: { color: '#1f2937', fontWeight: 'bold' },
                 head_cell: { color: '#6b7280', fontWeight: '500' },
                 day: { borderRadius: '8px', position: 'relative', width: '40px', height: '40px' },
               }}
             />
          </div>
          
          <div className="mt-6 text-sm text-gray-500 flex items-center gap-2">
             <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
             <span>メニューあり</span>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="flex-1 flex flex-col gap-8">
           
           {/* Next Upcoming Practice Section */}
           <div>
             <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
               <CalendarIcon className="w-5 h-5 text-green-600" />
               次回の練習予定
             </h2>
             
             {isLoading ? (
               <div className="bg-white rounded-2xl shadow-sm p-6 flex justify-center items-center h-32">
                 <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
               </div>
             ) : nextPractice ? (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-green-200 rounded-full blur-2xl opacity-20 -mr-8 -mt-8"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-green-700 font-bold mb-1">
                      <span className="bg-green-100 px-3 py-1 rounded-full text-xs uppercase tracking-wide">Next</span>
                      <span>{format(parseISO(nextPractice.baseDate), 'M月d日 (EEE)', { locale: ja })}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{nextPractice.title || '無題のメニュー'}</h3>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span>{nextPractice.baseStartTime} ~</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                         <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                         <span>{nextPractice.items?.length || 0} メニュー</span>
                      </div>
                    </div>

                    {nextPractice.noteTitle && (
                      <p className="text-gray-600 text-sm mb-5 line-clamp-2">
                        {nextPractice.noteTitle}
                      </p>
                    )}
                    
                    <button 
                      onClick={() => navigate(`/editor/${nextPractice.id}`)}
                      className="inline-flex items-center gap-2 bg-white text-green-700 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow-md hover:bg-green-50 transition-all"
                    >
                      練習メニューを見る
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
             ) : (
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                    <CalendarIcon className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">予定されている練習はありません</p>
                  <p className="text-gray-400 text-xs mt-1">カレンダーから新しいメニューを作成できます</p>
                </div>
             )}
           </div>

           {/* Selected Date Menus */}
           <div>
             <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
               {selectedDate ? format(selectedDate, 'MM/dd (E)', { locale: ja }) : '日付未選択'} のメニュー
             </h2>

             {isLoading ? (
               <div className="flex items-center justify-center py-10">
                 <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
               </div>
             ) : !user ? (
               <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-500">
                 <p>ログインしてメニューを表示</p>
               </div>
             ) : selectedMenus.length === 0 ? (
               <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-500 flex flex-col items-center justify-center min-h-[200px]">
                 <p className="mb-4">この日のメニューはありません</p>
                 <button 
                   onClick={() => openNewMenuModal(selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined)}
                   className="px-6 py-2 bg-blue-50 text-blue-600 rounded-full font-bold hover:bg-blue-100 transition-colors"
                 >
                   新しく作成する
                 </button>
               </div>
             ) : (
               <div className="space-y-4">
                 {selectedMenus.map(menu => (
                   <div key={menu.id} 
                        className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow group relative"
                   >
                      <div className="flex justify-between items-start mb-3">
                         <div>
                            <h3 className="font-bold text-lg text-gray-900 mb-1">{menu.title || '無題'}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                               <Clock className="w-4 h-4" />
                               <span>{menu.baseStartTime} ~</span>
                               <span className="text-gray-300">|</span>
                               <span>{menu.items?.length || 0} items</span>
                            </div>
                         </div>
                         <button 
                           onClick={(e) => handleDelete(menu.id, e)}
                           className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                           title="削除"
                         >
                           <Trash2 className="w-5 h-5" />
                         </button>
                      </div>
                      
                      {menu.noteTitle && (
                        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 mb-4">
                          <span className="font-bold block text-gray-700 text-xs mb-1">テーマ</span>
                          {menu.noteTitle}
                        </div>
                      )}

                      <button 
                        onClick={() => navigate(`/editor/${menu.id}`)}
                        className="w-full py-2.5 bg-gray-900 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-colors"
                      >
                        <Edit className="w-4 h-4" /> 編集する
                      </button>
                   </div>
                 ))}
               </div>
             )}
           </div>
        </div>
      </div>
    </Layout>

    <NewMenuModal
      isOpen={isNewMenuModalOpen}
      onClose={() => setIsNewMenuModalOpen(false)}
      onConfirm={handleNewMenuConfirm}
      preselectedDate={newMenuPreselectedDate}
    />
    </>
  );
}
