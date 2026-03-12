import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Menu, Plus, Volleyball } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { NavigationDrawer } from './NavigationDrawer';

interface LayoutProps {
  children: React.ReactNode;
  showFab?: boolean;
}

export function Layout({ children, showFab = false }: LayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsDrawerOpen(false);
  };

  const handleLogin = () => {
    setIsDrawerOpen(false);
    navigate('/editor'); // Or show login modal
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center shadow-sm sticky top-0 z-10 flex-shrink-0">
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-3"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        
        <div className="flex items-center gap-2 flex-1 justify-center mr-12">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg flex items-center justify-center">
            <Volleyball className="w-5 h-5" />
          </div>
          <h1 className="font-bold text-lg text-gray-800">バレー練習メニュー</h1>
        </div>
      </header>

      {/* Main Content - scrollable */}
      <main className="flex-1 overflow-y-auto w-full">
        {children}
      </main>

      {/* Navigation Drawer */}
      <NavigationDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        user={user}
        onLogout={handleLogout}
        onLogin={handleLogin}
      />

      {/* FAB (Floating Action Button) - conditionally shown */}
      {showFab && (
        <button
          onClick={() => navigate('/editor')}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-30"
          aria-label="Create new menu"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
