import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Loader2, PieChart as PieChartIcon, Menu as MenuIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { supabase } from '../../lib/supabase';
import { supabaseUrl, publicAnonKey } from '../../../utils/supabase/info';
import { Menu, CATEGORIES as INITIAL_CATEGORIES, Category, Drill } from '../types';

// Map Tailwind colors to hex for Recharts
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
  return TAILWIND_TO_HEX[colorClass] || '#cccccc';
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

export default function Analytics() {
  const navigate = useNavigate();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);
  const [rangeValue, setRangeValue] = useState(7);
  const [user, setUser] = useState<any>(null);

  // Fetch user session first
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session) {
        Promise.all([
          fetchMenus(session),
          loadUserLibrary(session)
        ]).then(() => setIsLoading(false));
      }
      else setIsLoading(false);
    });
  }, []);

  const fetchMenus = async (session: any) => {
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
          // Sort by date descending
          const sorted = (data.menus as Menu[]).sort((a, b) => 
            new Date(b.baseDate).getTime() - new Date(a.baseDate).getTime()
          );
          setMenus(sorted);
        }
      }
    } catch (e) {
      console.error("Failed to fetch menus", e);
    }
  };

  const loadUserLibrary = async (session: any) => {
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/make-server-791d0b68/library`, {
        headers: { 
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-User-Token': session.access_token
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.library && data.library.categories) {
             setCategories(data.library.categories);
        }
      }
    } catch (e) {
      console.error("Failed to load library", e);
    }
  };

  // Filter and Aggregate Data based on Range Slider
  const chartData = useMemo(() => {
    // 1. Slice the latest N records
    const latestMenus = menus.slice(0, rangeValue);

    // 2. Aggregate duration by category
    const aggregation: Record<string, number> = {};
    
    latestMenus.forEach(menu => {
      if (!menu.items) return;
      menu.items.forEach(item => {
        const catId = item.categoryId;
        // Calculate duration in minutes (including sets and rests)
        // Formula from MenuEditor: totalDrillTime = duration * sets + rest * (sets - 1)
        const drillDuration = item.durationMin * 60 + item.durationSec;
        const totalSeconds = drillDuration * item.sets + (item.restSeconds || 0) * Math.max(0, item.sets - 1);
        const minutes = totalSeconds / 60;
        
        aggregation[catId] = (aggregation[catId] || 0) + minutes;
      });
    });

    // 3. Format for Recharts
    const data: ChartData[] = Object.entries(aggregation).map(([catId, minutes]) => {
      const category = categories.find(c => c.id === catId);
      // Fallback: If category not found, try to look it up in INITIAL_CATEGORIES just in case
      const fallbackCategory = INITIAL_CATEGORIES.find(c => c.id === catId);
      const displayCategory = category || fallbackCategory;

      return {
        name: displayCategory ? displayCategory.name : '不明なカテゴリ',
        value: Math.round(minutes * 10) / 10, // Round to 1 decimal
        color: displayCategory ? catHex(displayCategory.color) : '#cccccc'
      };
    }).filter(d => d.value > 0);
    
    // Sort by value descending
    return data.sort((a, b) => b.value - a.value);

  }, [menus, rangeValue, categories]);

  const totalMinutes = useMemo(() => chartData.reduce((acc, curr) => acc + curr.value, 0), [chartData]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center sticky top-0 z-10 shadow-sm">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="font-bold text-lg text-gray-800">分析</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 max-w-3xl mx-auto w-full">
        
        {/* Control Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-700">直近の練習</h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">
              最新 {rangeValue} 件
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={rangeValue}
            onChange={(e) => setRangeValue(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>1</span>
            <span>15</span>
            <span>30</span>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 flex flex-col items-center min-h-[400px]">
          <h2 className="font-bold text-gray-800 mb-6 w-full text-left flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-gray-500" />
            カテゴリー分析
          </h2>

          {isLoading ? (
             <div className="flex-1 flex items-center justify-center">
               <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
             </div>
          ) : chartData.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
               <MenuIcon className="w-12 h-12 mb-2 opacity-20" />
               <p>練習データがありません</p>
             </div>
          ) : (
            <div className="w-full h-[300px] relative">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={chartData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={100}
                     paddingAngle={2}
                     dataKey="value"
                   >
                     {chartData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                     ))}
                   </Pie>
                   <Tooltip 
                      formatter={(value: number) => [`${value} min`, '時間']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                   />
                 </PieChart>
               </ResponsiveContainer>
               {/* Center Label */}
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                 <span className="block text-2xl font-bold text-gray-800">{Math.round(totalMinutes)}</span>
                 <span className="block text-xs text-gray-500 uppercase">Minutes</span>
               </div>
            </div>
          )}
        </div>

        {/* Legend & Details */}
        {!isLoading && chartData.length > 0 && (
          <div className="grid grid-cols-1 gap-3">
             {chartData.map((item) => {
               const percentage = totalMinutes > 0 ? Math.round((item.value / totalMinutes) * 100) : 0;
               return (
                 <div key={item.name} className="bg-white rounded-lg p-4 border border-gray-100 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-medium text-gray-700">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-sm font-bold text-gray-900">{item.value} min</span>
                       <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded w-12 text-center">{percentage}%</span>
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
