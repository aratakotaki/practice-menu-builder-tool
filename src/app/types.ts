export type CategoryId = 'warmup' | 'receive' | 'attack' | 'serve' | 'game' | 'other';

export interface Category {
  id: CategoryId;
  name: string;
  color: string; // Tailwind class or hex
}

export interface Drill {
  id: string;
  name: string;
  categoryId: CategoryId;
  durationSeconds: number; // Total duration including sets/reps if simple, or per set? 
  // Requirement says: "Duration (MM:SS precise input), Sets, Rest Time".
  // Let's assume duration is per set, or total?
  // "Duration and Sets" are displayed on the right.
  // "Auto-Time Calculation" implies we need total duration.
  // Let's store base duration and sets.
  // Total time = (duration * sets) + (rest * (sets - 1))? Or is duration total?
  // Let's assume Duration is TOTAL active time or per set?
  // The UI shows "02 min 00 sec" and "1 set".
  // Usually, a drill has a fixed duration like "10 mins".
  // If sets are involved, it might be "3 sets of 2 mins".
  // Let's simplify: User inputs "Total Duration" for the block, or "Duration per set"?
  // The screenshot shows: "02 - 00" for time, and "1" for set.
  // If I have 1 set of 2 mins, total is 2 mins.
  // If I have 3 sets of 2 mins, total is 6 mins + rest.
  // Let's assume the input is "Duration per set".
  durationMin: number;
  durationSec: number;
  sets: number;
  restSeconds: number;
  description: string;
  prepTimeSeconds: number; // "Prep Time (Inline)"
}

// A drill instance in the timeline might be slightly different if we allow overriding?
// For now, let's assume the timeline items are just Drills.
// But we need a unique ID for the timeline in case the same drill is added twice.
export interface TimelineItem extends Drill {
  uniqueId: string; // For drag and drop keys
}

export interface Menu {
  id: string;
  title: string;
  noteTitle?: string;
  noteBody?: string;
  baseDate: string;
  baseStartTime: string;
  items: TimelineItem[];
  updatedAt: string;
}

export const CATEGORIES: Category[] = [
  { id: 'warmup', name: 'ウォームアップ', color: 'bg-purple-500' },
  { id: 'receive', name: 'レシーブ', color: 'bg-orange-500' },
  { id: 'attack', name: '攻撃', color: 'bg-blue-800' },
  { id: 'serve', name: 'サーブ', color: 'bg-green-600' },
  { id: 'game', name: 'ゲーム練習', color: 'bg-red-600' },
  { id: 'other', name: 'その他', color: 'bg-gray-500' },
];

export const INITIAL_DRILLS: Drill[] = [
  {
    id: 'd1',
    name: 'ミーティング',
    categoryId: 'warmup',
    durationMin: 2,
    durationSec: 0,
    sets: 1,
    restSeconds: 0,
    prepTimeSeconds: 0,
    description: '',
  },
  {
    id: 'd2',
    name: 'ランニング',
    categoryId: 'warmup',
    durationMin: 3,
    durationSec: 0,
    sets: 1,
    restSeconds: 0,
    prepTimeSeconds: 60,
    description: '',
  },
  {
    id: 'd3',
    name: 'サーブ',
    categoryId: 'serve',
    durationMin: 2,
    durationSec: 0,
    sets: 3,
    restSeconds: 10,
    prepTimeSeconds: 60,
    description: '狙った箇所に強く確実に打つ',
  },
  {
    id: 'd4',
    name: '3枚キャッチ',
    categoryId: 'receive',
    durationMin: 2,
    durationSec: 0,
    sets: 4,
    restSeconds: 0,
    prepTimeSeconds: 60,
    description: 'メンバー:あら、なが、じゅん　反対側のコートでセッター練',
  },
];