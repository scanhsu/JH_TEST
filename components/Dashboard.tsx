
import React, { useState, useEffect } from 'react';
import { Subject, UserStats } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { Sword, BookOpen, Target, Zap, Map, Check, Lock, Timer, History, Calendar } from 'lucide-react';

interface DashboardProps {
  stats: UserStats;
  onStartBattle: (subject: Subject) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, onStartBattle }) => {
  
  const chartData = Object.values(Subject).map(subject => ({
    subject,
    A: stats.mastery[subject],
    fullMark: 100,
  }));

  // Calculate route map range (show 5 levels centered/starting around current)
  const currentLevel = stats.level;
  const startLevel = Math.max(1, currentLevel - 1);
  const mapLevels = Array.from({ length: 5 }, (_, i) => startLevel + i);

  // Countdown Logic
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      // "Next year, May 13th"
      const target = new Date(now.getFullYear() + 1, 4, 13); // Month is 0-indexed (4 = May)
      const diff = target.getTime() - now.getTime();
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        setTimeLeft({ days, hours, minutes });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* Header Section with Countdown */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white font-display">早安，考生戰士</h1>
          <p className="text-slate-400">距離會考越來越近了，今天想強化哪個屬性？</p>
        </div>

        {/* Countdown Timer */}
        <div className="glass-panel px-6 py-3 rounded-2xl flex items-center gap-5 border-gaming-accent/20 bg-gradient-to-r from-gaming-card to-gaming-accent/5 shadow-lg shadow-gaming-accent/5 min-w-[240px]">
             <div className="flex flex-col items-start">
                <span className="text-[10px] text-gaming-accent font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Timer className="w-3 h-3" /> 任務倒數
                </span>
                <span className="text-slate-500 text-[10px] font-mono">TARGET: {new Date().getFullYear() + 1}.05.13</span>
             </div>
             <div className="h-8 w-[1px] bg-slate-700"></div>
             <div className="flex items-baseline gap-2">
                <div className="text-center">
                    <span className="text-2xl font-display font-bold text-white block leading-none">{timeLeft.days}</span>
                    <span className="text-[10px] text-slate-500 font-bold">DAYS</span>
                </div>
                <span className="text-slate-600 text-xl">:</span>
                <div className="text-center">
                    <span className="text-xl font-display font-bold text-slate-300 block leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-[10px] text-slate-500 font-bold">HR</span>
                </div>
             </div>
        </div>
      </div>

      {/* Route Map / Journey Section */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
         {/* Decorative background glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-full bg-gaming-primary/5 blur-3xl -z-10"></div>

         <div className="flex items-center gap-2 mb-8 relative z-10">
            <Map className="w-5 h-5 text-gaming-accent" />
            <h2 className="text-lg font-semibold text-slate-200">會考征途 (Roadmap)</h2>
         </div>
         
         <div className="relative px-2 md:px-12 py-4">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-4 md:left-14 right-4 md:right-14 h-1 bg-slate-700 -translate-y-1/2 rounded-full" />
            
            {/* Nodes */}
            <div className="flex justify-between relative">
                {mapLevels.map((lvl) => {
                    const status = lvl < currentLevel ? 'completed' : lvl === currentLevel ? 'current' : 'locked';
                    return (
                        <div key={lvl} className="flex flex-col items-center gap-3 relative z-10 group select-none">
                            {/* Node Circle */}
                            <div className={`
                                w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border-4 font-display font-bold md:text-xl transition-all duration-300
                                ${status === 'completed' ? 'bg-gaming-card border-gaming-success text-gaming-success shadow-[0_0_10px_rgba(16,185,129,0.3)]' : ''}
                                ${status === 'current' ? 'bg-gaming-bg border-gaming-primary text-gaming-primary scale-125 shadow-[0_0_20px_rgba(6,182,212,0.6)]' : ''}
                                ${status === 'locked' ? 'bg-gaming-card border-slate-700 text-slate-600' : ''}
                            `}>
                                {status === 'completed' ? <Check className="w-5 h-5 md:w-7 md:h-7" /> : 
                                 status === 'locked' ? <Lock className="w-4 h-4 md:w-6 md:h-6" /> : 
                                 lvl}
                            </div>
                            
                            {/* Label */}
                            <div className={`
                                text-[10px] md:text-xs font-bold uppercase tracking-wider absolute -bottom-8 whitespace-nowrap
                                ${status === 'current' ? 'text-gaming-primary animate-pulse' : 'text-slate-500'}
                            `}>
                                {status === 'current' ? 'Current' : `Lv.${lvl}`}
                            </div>
                        </div>
                    );
                })}
            </div>
         </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Radar Chart */}
        <div className="glass-panel rounded-2xl p-6 h-80 relative overflow-hidden">
           <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
             <Target className="w-5 h-5 text-gaming-primary" />
             能力雷達
           </h2>
           <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center pt-8">
             <ResponsiveContainer width="100%" height="85%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Mastery"
                    dataKey="A"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fill="#06b6d4"
                    fillOpacity={0.3}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                    itemStyle={{ color: '#06b6d4' }}
                  />
                </RadarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between hover:border-gaming-primary/50 transition-all">
            <div className="flex justify-between items-start">
              <Zap className="text-yellow-400 w-8 h-8" />
              <span className="text-xs text-slate-500 uppercase font-bold">Streak</span>
            </div>
            <div>
              <span className="text-4xl font-bold text-white">{stats.streak}</span>
              <span className="text-sm text-slate-400 ml-1">天連續登入</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between hover:border-gaming-secondary/50 transition-all">
            <div className="flex justify-between items-start">
              <Sword className="text-red-400 w-8 h-8" />
              <span className="text-xs text-slate-500 uppercase font-bold">Battles</span>
            </div>
            <div>
              <span className="text-4xl font-bold text-white">{stats.battlesWon}</span>
              <span className="text-sm text-slate-400 ml-1">場戰役勝利</span>
            </div>
          </div>
          
           <div className="glass-panel rounded-2xl p-5 col-span-2 bg-gradient-to-r from-gaming-card to-slate-800">
              <div className="flex justify-between mb-2">
                <span className="text-slate-200 font-bold">下個等級: Lv.{stats.level + 1}</span>
                <span className="text-gaming-primary">{stats.xp} / {stats.xpToNextLevel} XP</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-gaming-primary to-gaming-secondary h-3 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(100, (stats.xp / stats.xpToNextLevel) * 100)}%` }}
                ></div>
              </div>
           </div>
        </div>
      </div>

      {/* Subject Selection Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Sword className="w-5 h-5 text-gaming-secondary" />
          選擇戰場 (科目)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.values(Subject).map((subject) => (
            <button
              key={subject}
              onClick={() => onStartBattle(subject)}
              className="group relative overflow-hidden rounded-xl bg-slate-800 border border-slate-700 p-4 hover:border-gaming-primary transition-all duration-300 text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gaming-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <BookOpen className="w-8 h-8 text-slate-400 group-hover:text-gaming-primary mb-3 transition-colors" />
              <h3 className="text-lg font-bold text-white">{subject}</h3>
              <p className="text-xs text-slate-400 mt-1">Mastery: {stats.mastery[subject]}%</p>
              <div className="mt-2 w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                 <div className="h-full bg-gaming-primary" style={{ width: `${stats.mastery[subject]}%` }}></div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Battle History / Records */}
      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
           <History className="w-5 h-5 text-slate-400" />
           戰績紀錄 (Test Data)
        </h2>
        <div className="overflow-x-auto">
           <table className="w-full text-left">
             <thead>
               <tr className="border-b border-slate-700 text-slate-500 text-xs uppercase">
                 <th className="pb-3 pl-2 font-bold">Date</th>
                 <th className="pb-3 font-bold">Subject</th>
                 <th className="pb-3 font-bold">Score</th>
                 <th className="pb-3 pr-2 text-right font-bold">XP Gained</th>
               </tr>
             </thead>
             <tbody className="text-sm">
               {[...stats.history].reverse().slice(0, 5).map((record) => (
                 <tr key={record.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                   <td className="py-3 pl-2 text-slate-400 font-mono">
                     <div className="flex items-center gap-2">
                       <Calendar className="w-3 h-3" />
                       {new Date(record.date).toLocaleDateString()}
                     </div>
                   </td>
                   <td className="py-3 text-white font-medium">{record.subject}</td>
                   <td className="py-3">
                     <span className={`px-2 py-1 rounded text-xs font-bold ${
                       (record.score / record.totalQuestions) >= 0.6 ? 'bg-gaming-success/20 text-gaming-success' : 'bg-gaming-error/20 text-gaming-error'
                     }`}>
                       {record.score} / {record.totalQuestions}
                     </span>
                   </td>
                   <td className="py-3 pr-2 text-right text-yellow-400 font-bold">+{record.xpGained}</td>
                 </tr>
               ))}
               {stats.history.length === 0 && (
                 <tr>
                   <td colSpan={4} className="py-8 text-center text-slate-500">
                     尚無戰鬥紀錄，快去挑戰吧！
                   </td>
                 </tr>
               )}
             </tbody>
           </table>
        </div>
      </div>

    </div>
  );
};
