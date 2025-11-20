
import React from 'react';
import { Trophy, Zap, LogOut } from 'lucide-react';
import { UserStats, UserProfile } from '../types';

interface NavbarProps {
  stats: UserStats;
  user: UserProfile | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ stats, user, onLogout }) => {
  return (
    <nav className="h-16 border-b border-slate-700 bg-gaming-bg/90 backdrop-blur flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-gaming-primary to-gaming-secondary rounded-lg flex items-center justify-center">
           <Trophy className="text-white w-5 h-5" />
        </div>
        <span className="font-display font-bold text-lg tracking-wide text-white hidden md:block">CAP<span className="text-gaming-primary">MASTER</span></span>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
          <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-medium text-slate-200">Lv.{stats.level}</span>
          <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" 
              style={{ width: `${Math.min(100, (stats.xp / stats.xpToNextLevel) * 100)}%` }}
            />
          </div>
        </div>
        
        {user && (
          <div className="flex items-center gap-3 pl-2 border-l border-slate-700">
            <div className="hidden md:block text-right">
              <p className="text-sm font-bold text-slate-200">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate max-w-[100px]">{user.email}</p>
            </div>
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-9 h-9 rounded-full border-2 border-slate-700 hover:border-gaming-primary transition-colors"
            />
            <button 
              onClick={onLogout}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
              title="登出"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
