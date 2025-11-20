
import React, { useState } from 'react';
import { QuizQuestion, BattleResult } from '../types';
import { CheckCircle, XCircle, HelpCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { audioService } from '../services/audioService';

interface QuizBattleProps {
  questions: QuizQuestion[];
  onComplete: (result: BattleResult) => void;
}

export const QuizBattle: React.FC<QuizBattleProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (index: number) => {
    if (isAnswerRevealed) return;
    setSelectedOption(index);
  };

  const handleConfirm = () => {
    if (selectedOption === null) return;
    
    setIsAnswerRevealed(true);
    const newAnswers = [...userAnswers, selectedOption];
    setUserAnswers(newAnswers);
    
    // Sound Effect & Explanation Logic
    if (selectedOption === currentQuestion.correctIndex) {
      audioService.playCorrect();
    } else {
      audioService.playIncorrect();
      setShowExplanation(true); // Auto show explanation if wrong
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      setShowExplanation(false);
    } else {
      // Calculate XP
      let correctCount = 0;
      userAnswers.forEach((ans, idx) => {
        if (ans === questions[idx].correctIndex) correctCount++;
      });
      
      // 100 XP per correct answer, bonus 50 for completion
      const xpGained = (correctCount * 100) + 50;
      
      onComplete({
        questions,
        userAnswers: [...userAnswers], // Ensure last answer is included (it is pushed before handleNext called)
        xpGained
      });
    }
  };

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-4 h-full flex flex-col justify-center min-h-[80vh]">
      
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-slate-400 text-sm mb-2 font-display">
          <span>QUESTION {currentIndex + 1} / {questions.length}</span>
          <span className="text-gaming-primary">{currentQuestion.topic}</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gaming-primary transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-panel p-6 md:p-8 rounded-2xl mb-6 relative">
        <h3 className="text-xl md:text-2xl font-bold text-white leading-relaxed mb-8">
          {currentQuestion.text}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            let stateClass = "border-slate-600 bg-slate-800/50 hover:bg-slate-700";
            let icon = null;

            if (isAnswerRevealed) {
              if (index === currentQuestion.correctIndex) {
                stateClass = "border-gaming-success bg-gaming-success/20 text-gaming-success";
                icon = <CheckCircle className="w-5 h-5" />;
              } else if (index === selectedOption) {
                stateClass = "border-gaming-error bg-gaming-error/20 text-gaming-error";
                icon = <XCircle className="w-5 h-5" />;
              } else {
                 stateClass = "border-slate-700 opacity-50";
              }
            } else if (selectedOption === index) {
              stateClass = "border-gaming-primary bg-gaming-primary/20 text-gaming-primary ring-1 ring-gaming-primary";
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={isAnswerRevealed}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${stateClass}`}
              >
                <span className="font-medium text-lg">{option}</span>
                {icon}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback / Explanation Area */}
      {isAnswerRevealed && (
        <div className={`mb-6 rounded-xl p-4 border transition-all duration-500 ${showExplanation ? 'bg-slate-800/80 border-slate-600' : 'bg-transparent border-transparent'}`}>
           <button 
             onClick={() => setShowExplanation(!showExplanation)}
             className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-2"
           >
             <HelpCircle className="w-4 h-4" />
             {showExplanation ? "隱藏解析" : "查看解析"}
           </button>
           
           {showExplanation && (
             <div className="text-slate-300 leading-relaxed animate-fadeIn">
               <p className="font-bold text-gaming-primary mb-1">解析：</p>
               {currentQuestion.explanation}
             </div>
           )}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex justify-end">
        {!isAnswerRevealed ? (
          <button
            onClick={handleConfirm}
            disabled={selectedOption === null}
            className="px-8 py-3 bg-gaming-primary hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            確認答案
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-gaming-secondary hover:bg-violet-400 text-white font-bold rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-violet-500/20"
          >
            {currentIndex === questions.length - 1 ? "完成戰役" : "下一題"}
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
