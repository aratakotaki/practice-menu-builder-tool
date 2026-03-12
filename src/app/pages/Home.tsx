import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, User, LogIn, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { supabaseUrl, publicAnonKey } from '/utils/supabase/info';
import { Menu } from '../types';
import { format, parseISO, isSameDay, startOfToday, isAfter } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Toaster } from 'sonner';
import { Layout } from '../components/Layout';
import { NewMenuModal } from '../components/NewMenuModal';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewMenuModalOpen, setIsNewMenuModalOpen] = useState(false);
  const navigate = useNavigate();

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
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const nextPractice = useMemo(() => {
    if (!menus.length) return null;
    const today = startOfToday();
    
    // Sort by date ascending, filter for >= today
    const upcoming = menus
      .filter(m => {
        if (!m.baseDate) return false;
        const menuDate = parseISO(m.baseDate);
        return isAfter(menuDate, today) || isSameDay(menuDate, today);
      })
      .sort((a, b) => new Date(a.baseDate).getTime() - new Date(b.baseDate).getTime());

    return upcoming[0] || null;
  }, [menus]);

  return (
    <>
    <Layout showFab={true}>
      <Toaster position="top-right" richColors />

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {user ? `ようこそ、${user.email?.split('@')[0]}さん！` : 'ようこそ！'}
            </h2>
            <p className="text-gray-600">
              {user ? 'バレーボールの練習メニューを管理しましょう' : '練習メニューにアクセスするにはログインしてください'}
            </p>
          </div>

          {/* Next Upcoming Practice Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                次回の練習
              </h3>
            </div>
            
            {isLoading ? (
               <div className="flex justify-center items-center h-32">
                 <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
               </div>
            ) : user ? (
              nextPractice ? (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-green-700 font-bold mb-2">
                      <span className="bg-green-100 px-3 py-1 rounded-full text-xs uppercase tracking-wide">Next</span>
                      <span>{format(parseISO(nextPractice.baseDate), 'M月d日 (EEE)', { locale: ja })}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{nextPractice.title || '無題のメニュー'}</h3>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-5">
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
                      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-sm text-gray-700 mb-5 border border-green-100/50">
                        <span className="font-bold text-xs text-green-700 block mb-1">テーマ</span>
                        {nextPractice.noteTitle}
                      </div>
                    )}
                    
                    <button 
                      onClick={() => navigate(`/editor/${nextPractice.id}`)}
                      className="inline-flex items-center gap-2 bg-white text-green-700 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow-md hover:bg-green-50 transition-all border border-green-100"
                    >
                      詳細を見る
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 border border-dashed border-gray-200 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1 font-bold">予定されている練習はありません</p>
                  <p className="text-xs text-gray-500 mb-4">新しい練習メニューを作成して始めましょう</p>
                  <button
                    onClick={() => setIsNewMenuModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm inline-flex items-center gap-2"
                  >
                    メニューを作成する
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="mb-4">練習スケジュールを見るにはログインしてください</p>
                <button
                  onClick={() => navigate('/editor')}
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    ログイン / 登録
                  </div>
                </button>
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
    />
    </>
  );
}
