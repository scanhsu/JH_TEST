
import React, { useEffect } from 'react';
import { BattleResult } from '../types';
import { Trophy, Star, RefreshCw, Home, ArrowUpCircle } from 'lucide-react';
import { audioService } from '../services/audioService';

interface ResultModalProps {
  result: BattleResult;
  levelUp: boolean;
  onHome: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ result, levelUp, onHome }) => {
  const correctCount = result.userAnswers.filter((ans, i) => ans === result.questions[i].correctIndex).length;
  const total = result.questions.length;
  const percentage = (correctCount / total) * 100;

  useEffect(() => {
    // Play completion sound based on performance
    audioService.playBattleComplete(percentage);

    // Play Level Up sound if applicable, slightly delayed
    if (levelUp) {
      setTimeout(() => {
        audioService.playLevelUp();
      }, 800);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden shadow-2xl animate-fadeIn">
        
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gaming-secondary/20 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10">
          
          {levelUp && (
            <div className="absolute -top-4 -right-4 bg-yellow-500 text-slate-900 font-bold px-3 py-1 rounded-full text-sm animate-pulse shadow-lg shadow-yellow-500/50 flex items-center gap-1">
              <ArrowUpCircle className="w-4 h-4" /> LEVEL UP!
            </div>
          )}

          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30 animate-bounce">
            <Trophy className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl font-display font-bold text-white mb-2">
            {percentage >= 80 ? "VICTORY!" : percentage >= 60 ? "COMPLETED" : "TRAINING NEEDED"}
          </h2>
          <p className="text-slate-400 mb-8">戰役結算</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <p className="text-slate-500 text-xs uppercase font-bold mb-1">正確率</p>
              <p className={`text-2xl font-bold ${percentage >= 60 ? 'text-gaming-success' : 'text-gaming-error'}`}>
                {correctCount} / {total}
              </p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <p className="text-slate-500 text-xs uppercase font-bold mb-1">XP 獲得</p>
              <p className="text-2xl font-bold text-yellow-400 flex items-center justify-center gap-1">
                +{result.xpGained} <Star className="w-4 h-4 fill-yellow-400" />
              </p>
            </div>
          </div>

          <div className="space-y-3">
             <button 
               onClick={onHome}
               className="w-full py-3 bg-gaming-primary hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
             >
               <Home className="w-5 h-5" />
               回首頁
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
