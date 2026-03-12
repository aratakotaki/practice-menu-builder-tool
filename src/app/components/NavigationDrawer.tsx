import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Home as HomeIcon, BookOpen, Calendar, BarChart3, User, LogOut, LogIn, X, Volleyball } from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onLogout: () => void;
  onLogin: () => void;
}

export function NavigationDrawer({ isOpen, onClose, user, onLogout, onLogin }: NavigationDrawerProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      label: 'ホーム', 
      icon: <HomeIcon className="w-5 h-5" />,
      path: '/',
      onClick: () => {
        onClose();
        navigate('/');
      }
    },
    { 
      label: 'ライブラリ', 
      icon: <BookOpen className="w-5 h-5" />,
      path: '/library',
      onClick: () => {
        onClose();
        navigate('/library');
      }
    },
    { 
      label: 'カレンダー', 
      icon: <Calendar className="w-5 h-5" />,
      path: '/calendar',
      onClick: () => {
        onClose();
        navigate('/calendar');
      }
    },
    { 
      label: '分析', 
      icon: <BarChart3 className="w-5 h-5" />,
      path: '/analytics',
      onClick: () => {
        onClose();
        navigate('/analytics');
      }
    },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`
        fixed top-0 left-0 h-[100dvh] w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="bg-blue-600 text-white p-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <Volleyball className="w-6 h-6" />
              <h2 className="font-bold text-lg">Menu</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-blue-700 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-500">ログイン中</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className={`transition-colors ${
                    isActive 
                      ? 'text-blue-600' 
                      : 'text-gray-500 group-hover:text-blue-600'
                  }`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            {user ? (
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">ログアウト</span>
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white"
              >
                <LogIn className="w-5 h-5" />
                <span className="font-medium">ログイン / 登録</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
