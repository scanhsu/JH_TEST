
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { QuizBattle } from './components/QuizBattle';
import { ResultModal } from './components/ResultModal';
import { Login } from './components/Login';
import { GameState, Subject, UserStats, QuizQuestion, BattleResult, UserProfile, BattleRecord } from './types';
import { generateQuiz } from './services/geminiService';
import { Loader2 } from 'lucide-react';

const STORAGE_KEY = 'cap_level_up_user_stats';
const USER_STORAGE_KEY = 'cap_level_up_user_profile';

// Initial Stats including Test Data records
const INITIAL_STATS: UserStats = {
  level: 3,
  xp: 450,
  xpToNextLevel: 1000,
  streak: 5,
  battlesWon: 12,
  mastery: {
    [Subject.Chinese]: 45,
    [Subject.English]: 60,
    [Subject.Math]: 30,
    [Subject.Science]: 55,
    [Subject.Social]: 70,
  },
  history: [
    { 
      id: 'test-1', 
      date: new Date(Date.now() - 86400000 * 2).toISOString(), 
      subject: Subject.Math, 
      score: 2, 
      totalQuestions: 3, 
      xpGained: 250 
    },
    { 
      id: 'test-2', 
      date: new Date(Date.now() - 86400000).toISOString(), 
      subject: Subject.English, 
      score: 3, 
      totalQuestions: 3, 
      xpGained: 350 
    },
  ]
};

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [gameState, setGameState] = useState<GameState>(GameState.Dashboard);
  
  // Stats State
  const [userStats, setUserStats] = useState<UserStats>(() => {
    try {
      const savedStats = localStorage.getItem(STORAGE_KEY);
      if (savedStats) {
        return JSON.parse(savedStats);
      }
    } catch (error) {
      console.error('Failed to load stats from storage:', error);
    }
    return INITIAL_STATS;
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [lastResult, setLastResult] = useState<BattleResult | null>(null);
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [hasLevelledUp, setHasLevelledUp] = useState(false);

  const handleLogin = () => {
    // Mock user profile from Google
    const mockUser: UserProfile = {
      name: 'Exam Warrior',
      email: 'warrior@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
    };
    setUser(mockUser);
  };

  const handleLogout = () => {
    setUser(null);
    setGameState(GameState.Dashboard);
  };

  const handleStartBattle = async (subject: Subject) => {
    setGameState(GameState.Preparing);
    setActiveSubject(subject);
    setHasLevelledUp(false);
    
    // Simulate minimum loading time for UX + Fetch
    const [questions] = await Promise.all([
      generateQuiz(subject, userStats.level),
      new Promise(resolve => setTimeout(resolve, 1500)) // Min 1.5s load to show cool animation
    ]);
    
    setCurrentQuestions(questions);
    setGameState(GameState.Battle);
  };

  const handleBattleComplete = (result: BattleResult) => {
    setLastResult(result);
    
    // Update stats
    setUserStats(prev => {
      const newXp = prev.xp + result.xpGained;
      let newLevel = prev.level;
      let newXpToNext = prev.xpToNextLevel;
      let currentXp = newXp;

      // Simple level up logic
      let didLevelUp = false;
      if (currentXp >= prev.xpToNextLevel) {
        newLevel += 1;
        currentXp = currentXp - prev.xpToNextLevel;
        newXpToNext = Math.floor(prev.xpToNextLevel * 1.2);
        didLevelUp = true;
      }
      setHasLevelledUp(didLevelUp);

      // Update mastery & Calculate Score
      let newMastery = { ...prev.mastery };
      const correctCount = result.userAnswers.filter((ans, i) => ans === result.questions[i].correctIndex).length;
      
      if (activeSubject) {
        const percentage = correctCount / result.questions.length;
        // Increase mastery if performance was good
        if (percentage >= 0.5) {
           // Gain between 2-5 points based on accuracy
           const gain = Math.floor(percentage * 5) + 1;
           newMastery[activeSubject] = Math.min(100, newMastery[activeSubject] + gain);
        }
      }

      // Create Record
      const newRecord: BattleRecord = {
        id: `battle-${Date.now()}`,
        date: new Date().toISOString(),
        subject: activeSubject || Subject.Chinese, // Fallback
        score: correctCount,
        totalQuestions: result.questions.length,
        xpGained: result.xpGained
      };
      
      return {
        ...prev,
        level: newLevel,
        xp: currentXp,
        xpToNextLevel: newXpToNext,
        battlesWon: prev.battlesWon + 1,
        mastery: newMastery,
        history: [...prev.history, newRecord]
      };
    });

    setGameState(GameState.Result);
  };

  const handleReturnHome = () => {
    setGameState(GameState.Dashboard);
    setLastResult(null);
    setCurrentQuestions([]);
    setActiveSubject(null);
    setHasLevelledUp(false);
  };

  // If not logged in, show Login screen
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gaming-bg text-slate-200 font-sans">
      <Navbar stats={userStats} user={user} onLogout={handleLogout} />
      
      <main className="relative">
        {gameState === GameState.Dashboard && (
          <Dashboard stats={userStats} onStartBattle={handleStartBattle} />
        )}

        {gameState === GameState.Preparing && (
          <div className="h-[80vh] flex flex-col items-center justify-center text-center">
            <div className="relative w-24 h-24 mb-8">
               <div className="absolute inset-0 border-4 border-gaming-primary/30 rounded-full animate-ping"></div>
               <div className="absolute inset-0 border-4 border-t-gaming-primary border-r-gaming-secondary border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold font-display text-white mb-2">GENERATING BATTLE...</h2>
            <p className="text-slate-400">Searching the archives for {activeSubject} challenges</p>
          </div>
        )}

        {gameState === GameState.Battle && (
          <QuizBattle questions={currentQuestions} onComplete={handleBattleComplete} />
        )}

        {gameState === GameState.Result && lastResult && (
          <ResultModal result={lastResult} levelUp={hasLevelledUp} onHome={handleReturnHome} />
        )}
      </main>
    </div>
  );
};

export default App;
