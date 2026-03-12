import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, GripVertical, Check, X } from 'lucide-react';
import { Category, Drill, CategoryId } from '../types';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface LibraryManagerProps {
  categories: Category[];
  setCategories: (cats: Category[]) => void;
  libraryDrills: Drill[];
  setLibraryDrills: (drills: Drill[]) => void;
  onClose: () => void;
}

const COLORS = [
  'bg-purple-500', 'bg-orange-500', 'bg-blue-800', 'bg-green-600', 'bg-red-600', 
  'bg-gray-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-yellow-500'
];

export function LibraryManager({ categories, setCategories, libraryDrills, setLibraryDrills, onClose, onSave }: LibraryManagerProps & { onSave: (c: Category[], d: Drill[]) => void }) {
  const [activeTab, setActiveTab] = useState<'drills' | 'categories'>('drills');
  
  // New Category State
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState(COLORS[0]);

  // New Drill State
  const [newDrillName, setNewDrillName] = useState('');
  const [newDrillCat, setNewDrillCat] = useState<CategoryId>(categories[0]?.id || 'other');

  const addCategory = () => {
    if (!newCatName.trim()) return;
    const newId = `cat-${Date.now()}` as CategoryId;
    const newCats = [...categories, { id: newId, name: newCatName, color: newCatColor }];
    setCategories(newCats);
    setNewCatName('');
    onSave(newCats, libraryDrills);
  };

  const deleteCategory = (id: string) => {
    // Immediate delete without confirmation
    const newCats = categories.filter(c => c.id !== id);
    setCategories(newCats);
    // In a real app, reassign drills.
    onSave(newCats, libraryDrills);
  };

  const addDrill = () => {
    if (!newDrillName.trim()) return;
    const newDrill: Drill = {
      id: `master-${Date.now()}`,
      name: newDrillName,
      categoryId: newDrillCat,
      durationMin: 5,
      durationSec: 0,
      sets: 1,
      restSeconds: 0,
      prepTimeSeconds: 0,
      description: ''
    };
    const newDrills = [...libraryDrills, newDrill];
    setLibraryDrills(newDrills);
    setNewDrillName('');
    onSave(categories, newDrills);
  };

  const deleteDrill = (id: string) => {
    // Immediate delete without confirmation
    const newDrills = libraryDrills.filter(d => d.id !== id);
    setLibraryDrills(newDrills);
    onSave(categories, newDrills);
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-[60] flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-10 safe-top flex-none">
        <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">ライブラリ管理</h2>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex bg-gray-200 p-1 rounded-xl mb-6">
          <button 
            onClick={() => setActiveTab('drills')}
            className={cn(
              "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
              activeTab === 'drills' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            ドリル
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={cn(
              "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
              activeTab === 'categories' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            カテゴリ
          </button>
        </div>

        {/* Categories View */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="space-y-3">
              {categories.map(cat => (
                <div key={cat.id} className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-4 h-4 rounded-full ring-2 ring-offset-2 ring-gray-100", cat.color)} />
                    <span className="font-bold text-gray-800">{cat.name}</span>
                  </div>
                  <button onClick={() => deleteCategory(cat.id)} className="text-gray-300 hover:text-red-500 p-2">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Category */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-4">カテゴリを追加</h3>
              <div className="flex gap-2 mb-4">
                <input 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="カテゴリ名" 
                  className="flex-1 bg-gray-50 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button 
                  onClick={addCategory}
                  disabled={!newCatName.trim()}
                  className="bg-blue-600 text-white px-6 rounded-lg font-bold disabled:opacity-50 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" /> 追加
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto p-2 scrollbar-hide -mx-2 px-2">
                {COLORS.map(c => (
                  <button 
                    key={c}
                    onClick={() => setNewCatColor(c)}
                    className={cn(
                      "w-8 h-8 rounded-full flex-shrink-0 transition-transform ring-offset-2",
                      c,
                      newCatColor === c ? "ring-2 ring-blue-500 scale-110" : "opacity-70 hover:opacity-100"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Drills View */}
        {activeTab === 'drills' && (
          <div className="space-y-6">
             {/* Add Drill */}
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-4">ドリルを追加</h3>
              <div className="flex gap-2 mb-4">
                <input 
                  value={newDrillName}
                  onChange={(e) => setNewDrillName(e.target.value)}
                  placeholder="ドリル名" 
                  className="flex-1 bg-gray-50 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button 
                  onClick={addDrill}
                  disabled={!newDrillName.trim()}
                  className="bg-blue-600 text-white px-6 rounded-lg font-bold disabled:opacity-50 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" /> 追加
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(c => (
                   <button 
                     key={c.id}
                     onClick={() => setNewDrillCat(c.id)}
                     className={cn(
                       "px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all border",
                       newDrillCat === c.id 
                         ? "bg-gray-900 text-white border-gray-900" 
                         : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                     )}
                   >
                     <span className={cn("w-2 h-2 rounded-full", c.color)} />
                     {c.name}
                   </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
               {libraryDrills.map(drill => (
                 <div key={drill.id} className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-1.5 h-10 rounded-full", categories.find(c => c.id === drill.categoryId)?.color || 'bg-gray-300')} />
                      <div>
                        <h4 className="font-bold text-gray-900">{drill.name}</h4>
                        <span className="text-xs text-gray-500">{categories.find(c => c.id === drill.categoryId)?.name}</span>
                      </div>
                    </div>
                    <button onClick={() => deleteDrill(drill.id)} className="text-gray-300 hover:text-red-500 p-2">
                        <Trash2 className="w-5 h-5" />
                    </button>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
