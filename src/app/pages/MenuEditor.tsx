import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { format, addSeconds, parse } from 'date-fns';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, Settings, FileText, Trash2, Check, ChevronRight, Menu as MenuIcon, LogOut, LogIn, Save, FolderOpen, User, Book, ArrowLeft, X, Home as HomeIcon, Calendar, BarChart3, BookOpen, Volleyball, RotateCcw, RotateCw, Cloud, CloudOff, Loader2 } from 'lucide-react';
import { Category, Drill, TimelineItem, INITIAL_DRILLS, CATEGORIES as INITIAL_CATEGORIES } from '../types';
import { Drawer } from 'vaul';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LibraryManager } from '../components/LibraryManager';
import { AuthModal } from '../components/AuthModal';
import { SavedMenusModal } from '../components/SavedMenusModal';
import { supabaseUrl, publicAnonKey } from '/utils/supabase/info';
import { supabase } from '../../lib/supabase';
import { Toaster, toast } from 'sonner';
import svgPaths from '../../imports/svg-gnadtnsjru';
import { useParams, useNavigate, useLocation } from 'react-router';

import { NavigationDrawer } from '../components/NavigationDrawer';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
function fmtDuration(min: number, sec: number) {
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}
function fmtRest(sec: number) {
  return sec === 0 ? '00 sec' : `${sec} sec`;
}

const TAILWIND_TO_HEX: Record<string, string> = {
  'bg-purple-500': '#A855F7',
  'bg-orange-500': '#F97316',
  'bg-blue-800': '#1E40AF',
  'bg-green-600': '#16A34A',
  'bg-red-600': '#DC2626',
  'bg-gray-500': '#6B7280',
  'bg-pink-500': '#EC4899',
  'bg-indigo-500': '#6366F1',
  'bg-teal-500': '#14B8A6',
  'bg-yellow-500': '#EAB308',
};
function catHex(colorClass: string): string {
  return TAILWIND_TO_HEX[colorClass] || '#1D1B20';
}

const DAYS_JA = ['日', '月', '火', '水', '木', '金', '土'];
const CARD_SHADOW = '0px 1px 2px 0px rgba(0,0,0,0.3),0px 1px 3px 1px rgba(0,0,0,0.15)';

// Figma SVG Icon components
const IconMenu = () => (
  <svg viewBox="0 0 18 12" fill="none" className="w-[18px] h-[12px]">
    <path d={svgPaths.p2304a600} fill="#1D1B20" />
  </svg>
);
const IconEdit = () => (
  <svg viewBox="0 0 12.75 12.75" fill="none" className="w-[14px] h-[14px]">
    <path d={svgPaths.p1920eb00} fill="#C5C5C5" />
  </svg>
);
const IconCalendar = () => (
  <svg viewBox="0 0 9.75 10.8333" fill="none" className="w-[13px] h-[13px]">
    <path d={svgPaths.p1287cc00} fill="#C5C5C5" />
  </svg>
);
const IconSchedule = () => (
  <svg viewBox="0 0 10.8333 10.8333" fill="none" className="w-[13px] h-[13px]">
    <path d={svgPaths.p3e666880} fill="#C5C5C5" />
  </svg>
);
const IconDownload = () => (
  <svg viewBox="0 0 10.6667 10.6667" fill="none" className="w-[16px] h-[16px]">
    <path d={svgPaths.p2e08fc00} fill="#C5C5C5" />
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 9.93333 9.93333" fill="none" className="block w-full h-full">
    <path d={svgPaths.p17332f00} stroke="#C5C5C5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
  </svg>
);
const IconRepeat = () => (
  <svg viewBox="0 0 9.1 10.7667" fill="none" className="block w-full h-full">
    <path d={svgPaths.p22605940} stroke="#C5C5C5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
  </svg>
);
const IconCoffee = () => (
  <svg viewBox="0 0 10.35 9.93333" fill="none" className="block w-full h-full">
    <path d={svgPaths.p22060810} stroke="#C5C5C5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
  </svg>
);
const VolleyballIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const DragHandle = () => (
  <div className="flex items-center gap-[3px]">
    <svg viewBox="0 0 3.66667 14.6667" fill="none" className="w-[4px] h-[15px]">
      <path d={svgPaths.p3fc9330} fill="#C5C5C5" />
    </svg>
    <svg viewBox="0 0 3.66667 14.6667" fill="none" className="w-[4px] h-[15px]">
      <path d={svgPaths.p3fc9330} fill="#C5C5C5" />
    </svg>
  </div>
);

const StatCell = ({ icon, value, className }: { icon: React.ReactNode; value: string, className?: string }) => (
  <div className={cn("flex items-center gap-1.5 flex-shrink-0", className)}>
    <div className="w-3.5 h-3.5 flex-shrink-0 overflow-hidden text-[#C5C5C5]">{icon}</div>
    <span className="text-[#999] leading-none whitespace-nowrap font-medium"
      style={{ fontSize: 12, fontFamily: 'Roboto, sans-serif', letterSpacing: '0.08px' }}>
      {value}
    </span>
  </div>
);

function TopAppBar({ 
  onLibraryOpen, 
  user, 
  onLogin, 
  onLogout, 
  onBack,
  baseDate,
  setBaseDate,
  onMenuOpen
}: { 
  onLibraryOpen: () => void;
  user: any;
  onLogin: () => void;
  onLogout: () => void;
  onBack: () => void;
  baseDate: Date;
  setBaseDate: (d: Date) => void;
  onMenuOpen: () => void;
}) {
  const dateStr = format(baseDate, 'yyyy-MM-dd');
  const displayDate = `${baseDate.getMonth() + 1}/${baseDate.getDate()}(${DAYS_JA[baseDate.getDay()]})`;

  return (
    <header className="bg-white border-b border-gray-200 px-3 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm print:hidden">
        <div className="flex items-center gap-1.5 sm:gap-4">
            <button onClick={onMenuOpen} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MenuIcon className="w-5 h-5 text-gray-600" />
            </button>
            
            <button onClick={onBack} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex items-center gap-2">
                <style>{`
                  .picker-input::-webkit-calendar-picker-indicator {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    padding: 0;
                    cursor: pointer;
                    opacity: 0;
                  }
                `}</style>
                <div className="relative flex items-center gap-1.5 sm:gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 px-2 sm:px-3 py-1.5 rounded-lg border border-gray-200 transition-colors">
                  <IconCalendar />
                  <span className="text-gray-900 font-bold text-xs sm:text-sm whitespace-nowrap">
                    {displayDate}
                  </span>
                  <input
                    type="date"
                    value={dateStr}
                    onChange={(e) => {
                      if (e.target.value) {
                        setBaseDate(new Date(e.target.value));
                      }
                    }}
                    className="picker-input absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                  />
                </div>
            </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button 
                onClick={onLibraryOpen} 
                className="flex items-center gap-1.5 px-2 sm:px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
                title="ライブラリ設定"
            >
                <Settings className="w-4 h-4" /> 
                <span className="hidden md:inline">ライブラリ</span>
            </button>
            
            <div className="h-6 w-px bg-gray-200 mx-0.5 hidden sm:block"></div>

            {user ? (
                <div className="relative group ml-0.5 sm:ml-1">
                    <button className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-100 hover:bg-blue-100 transition-colors flex-shrink-0">
                        {user.email ? user.email[0].toUpperCase() : <User className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 hidden group-hover:block animate-in fade-in slide-in-from-top-1 z-50">
                        <div className="px-4 py-3 border-b border-gray-50 mb-1">
                            <p className="text-xs text-gray-500 mb-0.5">ログイン中</p>
                            <p className="text-sm font-medium text-gray-900 truncate" title={user.email}>{user.email}</p>
                        </div>
                        <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
                            <LogOut className="w-4 h-4" /> ログアウト
                        </button>
                    </div>
                </div>
            ) : (
                <button 
                    onClick={onLogin} 
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-bold text-white bg-gray-900 rounded-lg hover:bg-black transition-all shadow-md active:scale-[0.98] whitespace-nowrap"
                >
                    <LogIn className="w-4 h-4" />
                    <span>ログイン</span>
                </button>
            )}
        </div>
    </header>
  );
}

function LibraryPanel({
  categories,
  libraryDrills,
  onAdd,
  onManage,
}: {
  categories: Category[];
  libraryDrills: Drill[];
  onAdd: (drill: Drill) => void;
  onManage: () => void;
}) {
  const [filterCat, setFilterCat] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!filterCat) return libraryDrills;
    return libraryDrills.filter(d => d.categoryId === filterCat);
  }, [libraryDrills, filterCat]);

  return (
    <aside className="hidden md:flex flex-col w-[320px] xl:w-[360px] flex-shrink-0 bg-white border-l border-gray-200 overflow-hidden print:hidden pb-16">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
        <h2 className="font-bold text-gray-900" style={{ fontSize: 15 }}>ドリルライブラリ</h2>
        <button
          onClick={onManage}
          className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full font-medium transition-colors"
        >
          <Settings className="w-3 h-3" /> 管理
        </button>
      </div>

      <div className="px-4 py-3 border-b border-gray-100 flex gap-2 overflow-x-auto flex-shrink-0 scrollbar-hide">
        <button
          onClick={() => setFilterCat(null)}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
            !filterCat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >すべて</button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilterCat(filterCat === cat.id ? null : cat.id)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all',
              filterCat === cat.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: catHex(cat.color) }} />
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-10">ドリルがありません</p>
        )}
        {filtered.map(drill => {
          const cat = categories.find(c => c.id === drill.categoryId);
          const barColor = catHex(cat?.color || 'bg-gray-500');
          return (
            <div
              key={drill.id}
              onClick={() => onAdd(drill)}
              className="flex items-center min-h-[52px] bg-white rounded-[7px] overflow-hidden cursor-pointer
                         hover:shadow-md active:scale-[0.98] transition-all group py-1"
              style={{ boxShadow: CARD_SHADOW }}
            >
              <div className="w-[4px] self-stretch flex-shrink-0" style={{ backgroundColor: barColor }} />
              <div className="flex-1 pl-3 min-w-0 flex flex-col justify-center">
                <div className="text-black leading-tight"
                  style={{ fontSize: 14, fontFamily: 'Roboto, Noto Sans JP, sans-serif', fontWeight: 500 }}>
                  {drill.name}
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-blue-600 text-gray-400 group-hover:text-white
                              flex items-center justify-center flex-shrink-0 mr-3 transition-all">
                <Plus className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3 border-t border-gray-100 flex-shrink-0">
        <p className="text-xs text-gray-400 text-center">クリックでタイムラインに追加</p>
      </div>
    </aside>
  );
}

// History Types
type MenuState = {
  title: string;
  noteTitle: string;
  noteBody: string;
  baseDate: Date;
  baseStartTime: string;
  items: TimelineItem[];
};

export default function MenuEditor() {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Read creation context passed from NewMenuModal (only relevant when no menuId in URL)
  const locationState = location.state as { newDate?: string; sourceMenu?: import('../types').Menu } | null;
  const sourceMenu = !menuId ? (locationState?.sourceMenu ?? null) : null;
  const initialDate = !menuId && locationState?.newDate
    ? new Date(locationState.newDate + 'T00:00:00')
    : new Date();

  // State
  const [items, setItems] = useState<TimelineItem[]>(() => {
    if (sourceMenu?.items?.length) {
      // Deep-copy items from the source menu with fresh uniqueIds
      return sourceMenu.items.map((item, i) => ({
        ...item,
        uniqueId: `${item.id}-${Date.now()}-${i}`,
      }));
    }
    return INITIAL_DRILLS.map((d, i) => ({ ...d, uniqueId: `${d.id}-${Date.now()}-${i}` }));
  });
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [libraryDrills, setLibraryDrills] = useState<Drill[]>(INITIAL_DRILLS);
  const [baseDate, setBaseDate] = useState(initialDate);
  const [baseStartTime, setBaseStartTime] = useState(sourceMenu?.baseStartTime ?? '12:00');
  const [title, setTitle] = useState(sourceMenu?.title ?? '午後練');
  const [noteTitle, setNoteTitle] = useState(sourceMenu?.noteTitle ?? 'レシーブの日');
  const [noteBody, setNoteBody] = useState(sourceMenu?.noteBody ?? '跳び箱3つ，得点板お願いします');

  // UI State
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [drawerCategory, setDrawerCategory] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);

  // Auto Save & History
  const [isAutoSave, setIsAutoSave] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [past, setPast] = useState<MenuState[]>([]);
  const [future, setFuture] = useState<MenuState[]>([]);
  const [isHistoryAction, setIsHistoryAction] = useState(false); // Flag to prevent auto-save triggering on undo/redo immediately
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedStateRef = useRef<string>('');
  
  // Helper to get current full state
  const getCurrentState = (): MenuState => ({
    title, noteTitle, noteBody, baseDate, baseStartTime, items
  });

  // Load menu if editing
  useEffect(() => {
      const loadMenu = async () => {
          if (!menuId || !user) return;
          try {
             const { data: { session } } = await supabase.auth.getSession();
             if (!session) return;

             const res = await fetch(`${supabaseUrl}/functions/v1/make-server-791d0b68/menus/${menuId}`, {
                 headers: {
                    'Authorization': `Bearer ${publicAnonKey}`,
                    'X-User-Token': session.access_token
                 }
             });
             
             if (res.ok) {
                 const { menu } = await res.json();
                 if (menu) {
                    const loadedState = {
                      title: menu.title || '無題',
                      noteTitle: menu.noteTitle || '',
                      noteBody: menu.noteBody || '',
                      baseDate: menu.baseDate ? new Date(menu.baseDate) : new Date(),
                      baseStartTime: menu.baseStartTime || '12:00',
                      items: menu.items || []
                    };
                    
                    applyState(loadedState);
                    lastSavedStateRef.current = JSON.stringify(loadedState);
                 }
             } else {
                 console.error("Failed to fetch menu");
                 toast.error("メニューの読み込みに失敗しました");
             }
          } catch (e) {
              console.error(e);
          }
      };
      
      loadMenu();
  }, [menuId, user]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session) {
        loadUserLibrary(session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) {
         loadUserLibrary(session);
      } else {
          setCategories(INITIAL_CATEGORIES);
          setLibraryDrills(INITIAL_DRILLS);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // History Functions
  const saveSnapshot = useCallback(() => {
    setPast(prev => {
      const current = getCurrentState();
      // Avoid duplicate snapshots if nothing changed
      if (prev.length > 0) {
        const last = prev[prev.length - 1];
        if (JSON.stringify(last) === JSON.stringify(current)) return prev;
      }
      return [...prev, current];
    });
    setFuture([]);
  }, [title, noteTitle, noteBody, baseDate, baseStartTime, items]);

  const applyState = (state: MenuState) => {
    setIsHistoryAction(true);
    setTitle(state.title);
    setNoteTitle(state.noteTitle);
    setNoteBody(state.noteBody);
    setBaseDate(state.baseDate);
    setBaseStartTime(state.baseStartTime);
    setItems(state.items);
    // Reset flag after a delay to allow effects to settle
    setTimeout(() => setIsHistoryAction(false), 500);
  };

  const undo = () => {
    if (past.length === 0) return;
    const current = getCurrentState();
    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);
    
    setPast(newPast);
    setFuture(prev => [current, ...prev]);
    applyState(previous);
  };

  const redo = () => {
    if (future.length === 0) return;
    const current = getCurrentState();
    const next = future[0];
    const newFuture = future.slice(1);

    setPast(prev => [...prev, current]);
    setFuture(newFuture);
    applyState(next);
  };

  // Keyboard Shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [past, future, title, noteTitle, noteBody, baseDate, baseStartTime, items]);

  // Auto Save Logic
  useEffect(() => {
    if (!isAutoSave || isHistoryAction || !user) return;

    // Check if state actually changed from last saved
    const currentStateStr = JSON.stringify(getCurrentState());
    if (currentStateStr === lastSavedStateRef.current) return;

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

    autoSaveTimerRef.current = setTimeout(() => {
      handleSave(false, true); // silent save
    }, 2000); // 2 second debounce

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [title, noteTitle, noteBody, baseDate, baseStartTime, items, isAutoSave, user, isHistoryAction]);


  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  const handleSave = async (isNew: boolean, isSilent: boolean = false) => {
    if (!user) {
      if (!isSilent) setIsAuthModalOpen(true);
      return;
    }

    if (isSilent) setIsSaving(true);

    // Use the date string as the menu ID (YYYY-MM-DD) so each date has at most one menu
    const dateStr = format(baseDate, 'yyyy-MM-dd');
    const idToUse = isNew ? dateStr : (menuId || dateStr);
    
    let menuName = title;
    if (isNew && !isSilent) {
        const input = window.prompt('新しいメニュー名を入力してください', title);
        if (input === null) {
          if (isSilent) setIsSaving(false);
          return;
        }
        menuName = input || title;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (!isSilent) {
          toast.error('認証情報が見つかりません。再ログインしてください。');
          setUser(null);
          setIsAuthModalOpen(true);
        }
        return;
      }

      const menuData = {
        id: idToUse,
        title: menuName,
        noteTitle,
        noteBody,
        baseDate: baseDate.toISOString(),
        baseStartTime,
        items,
        updatedAt: new Date().toISOString()
      };

      // allowOverwrite: false only when creating a brand-new menu (no existing menuId in URL,
      // i.e. the user has not yet saved this menu once). When editing an existing menu (menuId
      // is in the URL) we always allow overwriting the same-date entry.
      const shouldAllowOverwrite = !isNew || !!menuId;

      const response = await fetch(`${supabaseUrl}/functions/v1/make-server-791d0b68/menus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-User-Token': session.access_token
        },
        body: JSON.stringify({ menu: menuData, allowOverwrite: shouldAllowOverwrite })
      });

      if (response.status === 409) {
        const data = await response.json();
        const existingId = data.existingMenuId ?? dateStr;
        if (!isSilent) {
          const goToExisting = window.confirm(
            'この日にはすでにメニューが存在します。既存のメニューを開きますか？\n（「キャンセル」を押すと上書きして保存します）'
          );
          if (goToExisting) {
            navigate(`/editor/${existingId}`);
            return;
          }
          // User chose to overwrite – retry with allowOverwrite: true
          const overwriteRes = await fetch(`${supabaseUrl}/functions/v1/make-server-791d0b68/menus`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`,
              'X-User-Token': session.access_token
            },
            body: JSON.stringify({ menu: menuData, allowOverwrite: true })
          });
          if (!overwriteRes.ok) throw new Error(`Server error ${overwriteRes.status}`);
        } else {
          // Silent save: skip quietly to avoid disrupting the user
          setIsSaving(false);
          return;
        }
      } else if (!response.ok) {
        throw new Error(`Server error ${response.status}`);
      }

      // Update refs and state
      lastSavedStateRef.current = JSON.stringify(getCurrentState());
      
      if (!isSilent) {
        toast.success(isNew ? '新しいメニューとして保存しました' : '上書き保存しました');
      }
      
      if (!isSilent && isNew) {
          navigate(`/editor/${idToUse}`, { replace: true });
      }
      
      setTitle(menuName);
      
    } catch (err: any) {
      console.error("Save Error:", err);
      if (!isSilent) toast.error(err.message);
    } finally {
      if (isSilent) setTimeout(() => setIsSaving(false), 500);
    }
  };

  const timeline = useMemo(() => {
    let currentTime = parse(baseStartTime, 'HH:mm', baseDate);
    return items.map((item, index) => {
      const prep = item.prepTimeSeconds || 0;
      const start = index === 0 ? currentTime : addSeconds(currentTime, prep);
      const drillDuration = item.durationMin * 60 + item.durationSec;
      const totalDrillTime = drillDuration * item.sets + item.restSeconds * Math.max(0, item.sets - 1);
      const end = addSeconds(start, totalDrillTime);
      currentTime = end;
      return { ...item, startTime: start, endTime: end, totalDrillTime };
    });
  }, [items, baseDate, baseStartTime]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    saveSnapshot(); // Save before change
    const newItems = Array.from(items);
    const [moved] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, moved);
    setItems(newItems);
  };
  const updateItem = (updated: TimelineItem) => {
    saveSnapshot(); // Save before change
    setItems(items.map(i => (i.uniqueId === updated.uniqueId ? updated : i)));
  };
  const deleteItem = (uniqueId: string) => {
    saveSnapshot(); // Save before change
    setItems(items.filter(i => i.uniqueId !== uniqueId));
    setIsEditDrawerOpen(false);
  };
  const addDrill = (drill: Drill) => {
    saveSnapshot(); // Save before change
    const newItem: TimelineItem = { ...drill, uniqueId: `${drill.id}-${Date.now()}` };
    setItems(prev => [...prev, newItem]);
    setIsAddDrawerOpen(false);
  };

  const loadUserLibrary = async (session: any) => {
    if (!session || !supabaseUrl) return;
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/make-server-791d0b68/library`, {
        headers: { 
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-User-Token': session.access_token
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.library) {
             setCategories(data.library.categories || []);
             setLibraryDrills(data.library.drills || []);
        }
      }
    } catch (e) {
      console.error("Failed to load library", e);
    }
  };

  const saveUserLibrary = async (newCats: Category[], newDrills: Drill[]) => {
    setCategories(newCats);
    setLibraryDrills(newDrills);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !supabaseUrl) return;
    
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/make-server-791d0b68/library`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-User-Token': session.access_token
        },
        body: JSON.stringify({ categories: newCats, drills: newDrills })
      });
      
      if (!res.ok) {
         throw new Error(`Failed to save library: ${res.status}`);
      }
      toast.success('ライブラリを保存しました');
    } catch (e) {
      console.error("Failed to save library", e);
      toast.error('ライブラリの保存に失敗しました');
    }
  };

  // Toggle Switch Component
  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button 
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        checked ? "bg-blue-600" : "bg-gray-200"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );

  const handleDateChange = async (newDate: Date) => {
    // If not editing an existing menu, or AutoSave is OFF, simple state update
    if (!menuId || !isAutoSave) {
        saveSnapshot();
        setBaseDate(newDate);
        return;
    }

    // Plan B: Fork
    // We are editing an existing menu AND AutoSave is ON.
    // User expects the original date's menu to remain as is.
    // We create a new menu for the new date.

    if (!user) {
        toast.error("ログインが必要です");
        return;
    }
    
    setIsSaving(true);
    // Use the new date string as the new menu ID
    const newDateStr = format(newDate, 'yyyy-MM-dd');
    
    // Construct the new menu object using CURRENT state, but with NEW date
    const menuData = {
        id: newDateStr,
        title,
        noteTitle,
        noteBody,
        baseDate: newDate.toISOString(),
        baseStartTime,
        items,
        updatedAt: new Date().toISOString()
    };

    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("No session");

        const res = await fetch(`${supabaseUrl}/functions/v1/make-server-791d0b68/menus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${publicAnonKey}`,
                'X-User-Token': session.access_token
            },
            body: JSON.stringify({ menu: menuData, allowOverwrite: false })
        });

        if (res.status === 409) {
            const data = await res.json();
            const existingId = data.existingMenuId ?? newDateStr;
            const goToExisting = window.confirm(
              'この日にはすでにメニューが存在します。既存のメニューを開きますか？\n（「キャンセル」を押すと上書きして保存します）'
            );
            if (goToExisting) {
                navigate(`/editor/${existingId}`);
            } else {
                // Overwrite
                const overwriteRes = await fetch(`${supabaseUrl}/functions/v1/make-server-791d0b68/menus`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${publicAnonKey}`,
                        'X-User-Token': session.access_token
                    },
                    body: JSON.stringify({ menu: menuData, allowOverwrite: true })
                });
                if (!overwriteRes.ok) throw new Error("Failed to create new menu");
                setBaseDate(newDate);
                toast.success("新しい日付でメニューを作成しました（元のメニューは保持されます）");
                navigate(`/editor/${newDateStr}`, { replace: true });
            }
            return;
        }

        if (!res.ok) throw new Error("Failed to create new menu");

        // Update local state to match (to avoid jitter)
        setBaseDate(newDate);
        
        toast.success("新しい日付でメニューを作成しました（元のメニューは保持されます）");
        navigate(`/editor/${newDateStr}`, { replace: true });

    } catch (e) {
        console.error(e);
        toast.error("メニューの作成に失敗しました");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-[#f5f5f5] overflow-hidden print:h-auto print:bg-white">
      <Toaster position="top-right" richColors />
      
      <TopAppBar 
        onLibraryOpen={() => setIsLibraryOpen(true)}
        user={user}
        onLogin={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onBack={() => navigate('/')}
        baseDate={baseDate}
        setBaseDate={handleDateChange}
        onMenuOpen={() => setIsNavDrawerOpen(true)}
      />

      <NavigationDrawer
        isOpen={isNavDrawerOpen}
        onClose={() => setIsNavDrawerOpen(false)}
        user={user}
        onLogout={handleLogout}
        onLogin={() => setIsAuthModalOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        <div className="flex-1 overflow-y-auto print:overflow-visible pb-20"> {/* pb-20 for footer */}
          <div className="max-w-[640px] mx-auto px-4 md:px-8 py-4 md:py-8 print:max-w-none print:px-8">
            <div className="mb-4 md:mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-[6px]">
                  {isEditingTitle ? (
                    <input autoFocus value={title}
                      onChange={e => setTitle(e.target.value)}
                      onBlur={() => { setIsEditingTitle(false); saveSnapshot(); }}
                      className="bg-transparent outline-none"
                      style={{ fontSize: 24, fontFamily: 'MS Gothic, sans-serif' }}
                    />
                  ) : (
                    <h1 onClick={() => setIsEditingTitle(true)}
                      className="cursor-pointer flex items-center gap-[6px]"
                      style={{ fontSize: 24, fontFamily: 'MS Gothic, sans-serif' }}>
                      {title}
                      <span className="print:hidden"><IconEdit /></span>
                    </h1>
                  )}
                </div>
                <button onClick={() => window.print()}
                  className="flex items-center gap-[6px] bg-[#f4f5f6] border border-[#c5c5c5] rounded-[5px] px-[8px] h-[33px] print:hidden hover:bg-gray-100 transition-colors">
                  <IconDownload />
                  <span className="text-[#c5c5c5]"
                    style={{ fontSize: 14, fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}>PDF</span>
                </button>
              </div>

              <div className="flex items-center gap-3 mt-2 flex-wrap relative z-0">
                <style>{`
                  .picker-input::-webkit-calendar-picker-indicator {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    padding: 0;
                    cursor: pointer;
                    opacity: 0;
                  }
                `}</style>

                <div 
                  className="relative flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-transparent hover:border-gray-200 transition-colors shadow-sm"
                >
                  <IconSchedule />
                  <div className="flex items-center gap-1">
                    <span className="text-black font-medium"
                      style={{ fontSize: 13, fontFamily: 'Roboto, Noto Sans JP, sans-serif' }}>
                      {baseStartTime}
                    </span>
                    <span className="text-gray-400 mx-1">～</span>
                    <span className="text-black font-medium"
                      style={{ fontSize: 13, fontFamily: 'Roboto, Noto Sans JP, sans-serif' }}>
                      {timeline.length > 0 ? format(timeline[timeline.length - 1].endTime, 'HH:mm') : ''}
                    </span>
                  </div>
                  <input
                    type="time"
                    value={baseStartTime}
                    onChange={e => { saveSnapshot(); setBaseStartTime(e.target.value); }}
                    onBlur={() => saveSnapshot()}
                    className="picker-input absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[7px] mb-4 md:mb-5 cursor-pointer print:mb-4"
              style={{ boxShadow: CARD_SHADOW }}
              onClick={() => !isEditingNote && setIsEditingNote(true)}>
              {isEditingNote ? (
                <div className="px-[14px] py-3 min-h-[56px]"
                  onBlur={e => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        setIsEditingNote(false);
                        saveSnapshot();
                    }
                  }}>
                  <input autoFocus value={noteTitle} onChange={e => setNoteTitle(e.target.value)}
                    className="w-full outline-none bg-transparent block mb-1 text-black"
                    style={{ fontSize: 12, fontFamily: 'Roboto, Noto Sans JP, sans-serif', fontWeight: 500 }}
                    placeholder="テーマ" />
                  <textarea value={noteBody} onChange={e => setNoteBody(e.target.value)}
                    className="w-full outline-none bg-transparent resize-none text-black"
                    style={{ fontSize: 12, fontFamily: 'Roboto, Noto Sans JP, sans-serif', fontWeight: 500 }}
                    placeholder="メモを入力..." rows={2} />
                </div>
              ) : (
                <div className="px-[14px] py-[12px] min-h-[52px] flex flex-col justify-center">
                  {noteTitle && (
                    <p className="text-black"
                      style={{ fontSize: 12, fontFamily: 'Roboto, Noto Sans JP, sans-serif', fontWeight: 500, lineHeight: '20px' }}>
                      {noteTitle}
                    </p>
                  )}
                  {noteBody && (
                    <p className="text-black"
                      style={{ fontSize: 12, fontFamily: 'Roboto, Noto Sans JP, sans-serif', fontWeight: 500, lineHeight: '20px' }}>
                      {noteBody}
                    </p>
                  )}
                  {!noteTitle && !noteBody && (
                    <p style={{ fontSize: 12, color: '#C5C5C5' }}>練習テーマ・メモを入力...</p>
                  )}
                </div>
              )}
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="timeline">
                {provided => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-[6px] print:space-y-0">
                    {timeline.map((item, index) => {
                      const cat = categories.find(c => c.id === item.categoryId);
                      const barColor = catHex(cat?.color || 'bg-gray-500');

                      return (
                        <Draggable key={item.uniqueId} draggableId={item.uniqueId} index={index}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.draggableProps}
                              style={{ ...provided.draggableProps.style }}>
                              <div
                                className={cn(
                                  'flex items-center min-h-[52px] bg-white rounded-[7px] overflow-hidden print:hidden py-1',
                                  snapshot.isDragging ? 'opacity-90' : ''
                                )}
                                style={{ boxShadow: snapshot.isDragging ? '0 8px 24px rgba(0,0,0,0.18)' : CARD_SHADOW }}
                              >
                                <div className="pl-[5px] md:pl-[10px] w-auto min-w-[95px] flex-shrink-0 flex items-center justify-center">
                                  <span className="text-black leading-none whitespace-nowrap"
                                    style={{ fontSize: 13, fontFamily: 'Roboto, sans-serif', fontWeight: 500, letterSpacing: '0.11px' }}>
                                    {format(item.startTime, 'HH:mm')}
                                  </span>
                                  <span className="text-[#999] leading-none whitespace-nowrap mx-1"
                                    style={{ fontSize: 13, fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}>
                                    - {format(item.endTime, 'HH:mm')}
                                  </span>
                                </div>

                                <div className="w-[4px] self-stretch flex-shrink-0"
                                  style={{ backgroundColor: barColor }} />

                                <div className="flex-1 pl-[10px] pr-2 min-w-0 cursor-pointer py-1"
                                  onClick={() => {
                                    if (!snapshot.isDragging) {
                                      setSelectedItem(item);
                                      setIsEditDrawerOpen(true);
                                    }
                                  }}>
                                  <span className="text-black leading-tight block"
                                    style={{ fontSize: 14, fontFamily: 'Roboto, Noto Sans JP, sans-serif', fontWeight: 500, letterSpacing: '0.11px' }}>
                                    {item.name}
                                  </span>
                                  <div className="md:hidden mt-1.5 flex items-center gap-3">
                                    <StatCell icon={<IconClock />} value={fmtDuration(item.durationMin, item.durationSec)} />
                                    <StatCell icon={<IconRepeat />} value={`${item.sets} set`} />
                                    <StatCell icon={<IconCoffee />} value={fmtRest(item.restSeconds)} />
                                  </div>
                                  {item.description && (
                                    <span className="block text-[#888] truncate mt-1.5"
                                      style={{ fontSize: 11, fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}>
                                      {item.description}
                                    </span>
                                  )}
                                </div>

                                <div className="hidden md:flex items-center gap-4 flex-shrink-0 pr-2">
                                  <StatCell icon={<IconClock />} value={fmtDuration(item.durationMin, item.durationSec)} />
                                  <StatCell icon={<IconRepeat />} value={`${item.sets} set`} />
                                  <StatCell icon={<IconCoffee />} value={fmtRest(item.restSeconds)} />
                                </div>

                                <div className="w-[1px] self-stretch bg-[#C5C5C5] flex-shrink-0 mx-1" />

                                <div {...provided.dragHandleProps}
                                  className="w-[32px] flex items-center justify-center self-stretch flex-shrink-0 cursor-grab active:cursor-grabbing touch-none">
                                  <DragHandle />
                                </div>
                              </div>

                              <div className="hidden print:flex items-center gap-3 py-2 border-b border-gray-200 print:break-inside-avoid">
                                <div className="w-[100px] text-right pr-3 border-r border-gray-200 flex flex-col justify-center flex-shrink-0">
                                  <div className="text-sm font-mono font-bold text-gray-700">{format(item.startTime, 'HH:mm')}</div>
                                  <div className="text-xs font-mono text-gray-400">～{format(item.endTime, 'HH:mm')}</div>
                                </div>
                                
                                <div className="w-1.5 self-stretch rounded-full flex-shrink-0 my-1" style={{ backgroundColor: barColor }} />
                                
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-base text-gray-900 truncate">{item.name}</h3>
                                  {item.description && <p className="text-xs text-gray-500 mt-0.5 truncate">{item.description}</p>}
                                </div>

                                <div className="flex gap-4 text-sm text-gray-600 flex-shrink-0 mr-2">
                                  <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Time</span>
                                    <span className="font-medium">{fmtDuration(item.durationMin, item.durationSec)}</span>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Sets</span>
                                    <span className="font-medium">{item.sets}</span>
                                  </div>
                                  {item.restSeconds > 0 && (
                                    <div className="flex flex-col items-end">
                                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">Rest</span>
                                      <span className="font-medium">{fmtRest(item.restSeconds)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}

                    {items.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <svg viewBox="0 0 53.1667 53.1667" fill="none" className="w-12 h-12 mb-3 opacity-30">
                          <path d={svgPaths.p2abad40} stroke="#C5C5C5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="text-sm">ドリルを追加してください</p>
                        <p className="text-xs mt-1 hidden md:block">右のライブラリからクリックして追加</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <div className="flex justify-center mt-8 md:hidden print:hidden">
              <button onClick={() => setIsAddDrawerOpen(true)}
                className="active:scale-95 transition-transform" aria-label="メニューを追加">
                <svg viewBox="0 0 53.1667 53.1667" fill="none" className="w-[53px] h-[53px]">
                  <path d={svgPaths.p2abad40} stroke="#C5C5C5" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <LibraryPanel
          categories={categories}
          libraryDrills={libraryDrills}
          onAdd={addDrill}
          onManage={() => setIsLibraryOpen(true)}
        />
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 py-3 md:px-8 z-30 flex items-center justify-between gap-2 print:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        
        {/* Left: History & AutoSave Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2">
            <button 
                onClick={undo}
                disabled={past.length === 0}
                className="p-1.5 sm:p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                title="元に戻す (Ctrl+Z)"
            >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button 
                onClick={redo}
                disabled={future.length === 0}
                className="p-1.5 sm:p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                title="やり直す (Ctrl+Shift+Z)"
            >
                <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            <div className="h-6 w-px bg-gray-200 mx-1 sm:mx-2"></div>
            
            <div className="flex items-center gap-1.5 sm:gap-2 mr-1">
                <ToggleSwitch checked={isAutoSave} onChange={setIsAutoSave} />
                <span className="text-[10px] sm:text-xs font-bold text-gray-500 whitespace-nowrap">自動保存</span>
            </div>
            
            {isAutoSave && (
               <div className="flex items-center gap-1 text-xs font-medium text-gray-400">
                 {isSaving ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                 ) : (
                    <Cloud className="w-3 h-3" />
                 )}
                 <span className="hidden sm:inline">{isSaving ? '保存中...' : '保存済み'}</span>
               </div>
            )}
        </div>

        {/* Right: Manual Save Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {menuId ? (
                <>
                    {!isAutoSave && (
                        <button 
                            onClick={() => handleSave(false)}
                            className="px-3 py-2 sm:px-5 sm:py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-sm text-xs sm:text-sm whitespace-nowrap"
                        >
                            <span className="hidden sm:inline">上書き保存</span>
                            <span className="sm:hidden">上書き</span>
                        </button>
                    )}
                    <button 
                        onClick={() => handleSave(true)}
                        className="px-3 py-2 sm:px-6 sm:py-2.5 text-white bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
                    >
                        <Save className="w-4 h-4" />
                        <span className="hidden sm:inline">別名で保存</span>
                        <span className="sm:hidden">別名</span>
                    </button>
                </>
            ) : (
                <button 
                    onClick={() => handleSave(true)}
                    className="px-4 py-2 sm:px-8 sm:py-2.5 text-white bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2 text-xs sm:text-sm"
                >
                    <Save className="w-4 h-4" />
                    保存
                </button>
            )}
        </div>
      </div>

      <Drawer.Root open={isEditDrawerOpen} onOpenChange={setIsEditDrawerOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Drawer.Content
            className="bg-white flex flex-col rounded-t-[10px] fixed bottom-0 left-0 right-0 max-h-[96vh] z-50 focus:outline-none"
            aria-describedby={undefined}>
            <Drawer.Title className="sr-only">ドリルを編集</Drawer.Title>
            {selectedItem && (
              <EditDrillForm item={selectedItem} categories={categories}
                onSave={updated => { updateItem(updated); setIsEditDrawerOpen(false); }}
                onDelete={() => deleteItem(selectedItem.uniqueId)} />
            )}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <Drawer.Root open={isAddDrawerOpen} onOpenChange={setIsAddDrawerOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Drawer.Content
            className="bg-[#f5f5f5] flex flex-col rounded-t-[10px] fixed bottom-0 left-0 right-0 h-[85vh] z-50 focus:outline-none"
            aria-describedby={undefined}>
            <Drawer.Title className="sr-only">メニューを追加</Drawer.Title>
            <div className="p-4 bg-white rounded-t-[10px] flex-none">
              <div className="mx-auto w-12 h-1.5 rounded-full bg-gray-300 mb-5" />
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">メニューを追加</h2>
                <button onClick={() => { setIsAddDrawerOpen(false); setIsLibraryOpen(true); }}
                  className="text-sm text-blue-600 font-medium flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full">
                  <Settings className="w-4 h-4" /> 管理
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button onClick={() => setDrawerCategory(null)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-all",
                    !drawerCategory ? "bg-gray-900 text-white" : "bg-white border border-gray-100 text-gray-600"
                  )}>すべて</button>
                {categories.map(c => (
                  <button key={c.id} onClick={() => setDrawerCategory(drawerCategory === c.id ? null : c.id)}
                    className={cn(
                      "px-4 py-2 border rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-all",
                      drawerCategory === c.id 
                        ? "bg-gray-900 text-white border-gray-900" 
                        : "bg-white border-gray-100 text-gray-600"
                    )}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: catHex(c.color) }} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {libraryDrills.filter(d => !drawerCategory || d.categoryId === drawerCategory).map(drill => {
                const cat = categories.find(c => c.id === drill.categoryId);
                const barColor = catHex(cat?.color || 'bg-gray-500');
                return (
                  <div key={drill.id} onClick={() => addDrill(drill)}
                    className="flex items-center min-h-[52px] bg-white rounded-[7px] overflow-hidden cursor-pointer active:scale-[0.98] transition-all py-1"
                    style={{ boxShadow: CARD_SHADOW }}>
                    <div className="w-[4px] self-stretch flex-shrink-0" style={{ backgroundColor: barColor }} />
                    <div className="flex-1 pl-3 min-w-0 flex flex-col justify-center">
                      <div className="text-black leading-tight"
                        style={{ fontSize: 14, fontFamily: 'Roboto, Noto Sans JP, sans-serif', fontWeight: 500 }}>
                        {drill.name}
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mr-3">
                      <Plus className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {isLibraryOpen && (
        <LibraryManager 
          categories={categories} 
          setCategories={setCategories}
          libraryDrills={libraryDrills} 
          setLibraryDrills={setLibraryDrills}
          onClose={() => setIsLibraryOpen(false)} 
          onSave={saveUserLibrary}
        />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(u) => {
          setUser(u);
          setIsAuthModalOpen(false);
        }}
      />
    </div>
  );
}

function EditDrillForm({ item, categories, onSave, onDelete }: {
  item: TimelineItem; categories: Category[];
  onSave: (i: TimelineItem) => void; onDelete: () => void;
}) {
  const [localItem, setLocalItem] = useState(item);
  const update = (field: keyof TimelineItem, value: any) =>
    setLocalItem(prev => ({ ...prev, [field]: value }));
  const cat = categories.find(c => c.id === localItem.categoryId);
  const barColor = catHex(cat?.color || 'bg-gray-500');

  // Counter Component Helper
  const Counter = ({ value, onChange, step = 1, label }: { value: number, onChange: (v: number) => void, step?: number, label?: string }) => (
    <div className="flex items-center gap-3">
        <button 
            className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-xl font-bold active:scale-95 text-gray-500 hover:bg-gray-50 transition-colors"
            onClick={() => onChange(value - step)}
        >
            -
        </button>
        <div className="flex items-baseline gap-1 min-w-[3rem] justify-center">
            <span className="text-2xl font-bold text-gray-800">{value}</span>
            {label && <span className="text-xs text-gray-500 font-bold">{label}</span>}
        </div>
        <button 
            className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-xl font-bold active:scale-95 text-gray-500 hover:bg-gray-50 transition-colors"
            onClick={() => onChange(value + step)}
        >
            +
        </button>
    </div>
  );

  return (
    <div className="p-4 max-w-md mx-auto w-full h-full flex flex-col">
      <div className="mx-auto w-12 h-1.5 rounded-full bg-gray-300 mb-5" />
      <div className="flex items-center gap-3 mb-5 px-1">
        <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: barColor }} />
        <div>
          <h2 className="font-bold text-gray-900">{localItem.name}</h2>
          <p className="text-xs text-gray-400">{cat?.name}</p>
        </div>
      </div>
      <div className="space-y-4 overflow-y-auto flex-1 pb-4 no-scrollbar">
        <div className="bg-gray-50 p-4 rounded-xl">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block text-center mb-3">Time (Min : Sec)</label>
          <div className="flex items-center justify-center gap-4">
            <Counter value={localItem.durationMin} onChange={v => update('durationMin', Math.max(0, v))} label="分" />
            <span className="text-2xl font-bold text-gray-300">:</span>
            <Counter value={localItem.durationSec} onChange={v => update('durationSec', Math.max(0, v))} label="秒" step={10} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-4 rounded-xl">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block text-center mb-3">Sets</label>
            <Counter value={localItem.sets} onChange={v => update('sets', Math.max(1, v))} />
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block text-center mb-3">Rest (Sec)</label>
            <Counter value={localItem.restSeconds} onChange={v => update('restSeconds', Math.max(0, v))} step={10} />
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between">
          <label className="text-sm font-bold text-gray-600">この前の準備時間</label>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-lg font-bold active:scale-95 text-gray-500"
              onClick={() => update('prepTimeSeconds', Math.max(0, localItem.prepTimeSeconds - 60))}>-</button>
            <span className="w-12 text-center font-bold text-gray-800">{Math.floor(localItem.prepTimeSeconds / 60)}m</span>
            <button className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-lg font-bold active:scale-95 text-gray-500"
              onClick={() => update('prepTimeSeconds', localItem.prepTimeSeconds + 60)}>+</button>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-600 mb-2">
            <FileText className="w-4 h-4" /> メモ / 説明
          </label>
          <textarea
            className="w-full bg-white rounded-lg p-3 text-sm text-gray-700 min-h-[90px] outline-none border border-transparent focus:border-blue-500"
            value={localItem.description}
            onChange={e => update('description', e.target.value)}
            placeholder="ドリルの詳細やメモを入力..."
          />
        </div>
      </div>
      <div className="mt-3 flex gap-3 pt-2 border-t border-gray-100 flex-none bg-white">
        <button onClick={onDelete}
          className="flex-none px-5 py-4 bg-red-50 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
          <Trash2 className="w-5 h-5" /> 削除
        </button>
        <button onClick={() => onSave(localItem)}
          className="flex-1 px-6 py-4 bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 shadow-md active:scale-[0.98] transition-all">
          <Check className="w-5 h-5" /> 保存
        </button>
      </div>
    </div>
  );
}