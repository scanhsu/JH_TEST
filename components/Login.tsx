
import React, { useState } from 'react';
import { Trophy, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate API delay for Google Auth
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gaming-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gaming-primary/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gaming-secondary/20 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="glass-panel p-8 md:p-12 rounded-3xl w-full max-w-md flex flex-col items-center text-center shadow-2xl border border-slate-700/50">
        
        <div className="w-20 h-20 bg-gradient-to-br from-gaming-primary to-gaming-secondary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20 transform rotate-3">
           <Trophy className="text-white w-10 h-10" />
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">CAP<span className="text-gaming-primary">MASTER</span></h1>
        <p className="text-slate-400 mb-8">會考大師 - 你的隨身戰鬥教練</p>

        <div className="w-full space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white hover:bg-slate-100 text-slate-800 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 group shadow-lg"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
            ) : (
              <>
                <img 
                  src="https://www.svgrepo.com/show/475656/google-color.svg" 
                  alt="Google" 
                  className="w-6 h-6 group-hover:scale-110 transition-transform" 
                />
                <span>使用 Google 帳號登錄</span>
              </>
            )}
          </button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#1e293b] px-2 text-slate-500">Start Your Journey</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            登錄即代表您同意我們的服務條款。您的學習進度將會自動保存並同步。
          </p>
        </div>
      </div>
    </div>
  );
};
