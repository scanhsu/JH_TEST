
export enum Subject {
  Chinese = '國文',
  English = '英文',
  Math = '數學',
  Science = '自然',
  Social = '社會',
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

export interface BattleRecord {
  id: string;
  date: string;
  subject: Subject;
  score: number;
  totalQuestions: number;
  xpGained: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  battlesWon: number;
  mastery: Record<Subject, number>; // 0 to 100
  history: BattleRecord[];
}

export enum GameState {
  Dashboard,
  Preparing,
  Battle,
  Result,
}

export interface BattleResult {
  questions: QuizQuestion[];
  userAnswers: number[]; // Array of selected indices
  xpGained: number;
}
