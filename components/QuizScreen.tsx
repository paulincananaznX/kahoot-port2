import React, { useState, useEffect } from 'react';
import { Question, AnswerOption } from '../types';
import { CheckCircle2, XCircle, Timer, ArrowRight } from 'lucide-react';

interface QuizScreenProps {
  question: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ 
  question, 
  currentQuestionIndex, 
  totalQuestions, 
  onAnswer,
  onNext
}) => {
  const [timeLeft, setTimeLeft] = useState(question.timeLimit);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Colors for the buttons similar to Kahoot
  const optionColors = [
    'bg-red-500 hover:bg-red-600 shadow-[0_4px_0_rgb(185,28,28)]',
    'bg-blue-500 hover:bg-blue-600 shadow-[0_4px_0_rgb(29,78,216)]',
    'bg-yellow-500 hover:bg-yellow-600 shadow-[0_4px_0_rgb(161,98,7)]',
    'bg-green-500 hover:bg-green-600 shadow-[0_4px_0_rgb(21,128,61)]'
  ];
  
  const optionShapes = ['▲', '◆', '●', '■'];

  // Timer Logic
  useEffect(() => {
    if (isAnswered) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnswered]);

  // Watch for timeout
  useEffect(() => {
    if (timeLeft === 0 && !isAnswered) {
      handleTimeOut();
    }
  }, [timeLeft, isAnswered]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setIsCorrect(false);
    onAnswer(false);
  };

  const handleOptionClick = (option: AnswerOption) => {
    if (isAnswered) return;

    setSelectedOptionId(option.id);
    setIsAnswered(true);
    const correct = option.isCorrect;
    setIsCorrect(correct);
    onAnswer(correct);
  };

  if (isAnswered) {
    // Feedback View (Dark Mode)
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-6 text-white text-center transition-colors duration-500 ${isCorrect ? 'bg-green-700' : 'bg-red-700'}`}>
        <div className="mb-6 animate-bounce">
          {isCorrect ? (
            <CheckCircle2 className="w-24 h-24 text-white" />
          ) : (
            <XCircle className="w-24 h-24 text-white" />
          )}
        </div>
        
        <h2 className="text-5xl font-black mb-4 uppercase drop-shadow-md">
          {isCorrect ? "Correto!" : "Errado!"}
        </h2>

        {!isCorrect && (
           <div className="mb-8 bg-black/40 p-6 rounded-xl border border-white/10">
             <p className="opacity-80 text-sm uppercase font-bold mb-2">A resposta correta era:</p>
             <p className="text-2xl font-bold">{question.options.find(o => o.isCorrect)?.text}</p>
           </div>
        )}
        
        <div className="bg-black/30 px-6 py-3 rounded-full font-bold text-xl mb-8 backdrop-blur-sm border border-white/10">
            +{isCorrect ? (timeLeft * 10) + 50 : 0} Pontos
        </div>

        <button 
          onClick={onNext}
          className="flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-lg font-black text-xl hover:bg-gray-100 hover:scale-105 transition-all shadow-lg"
        >
          Próxima <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    );
  }

  // Question View (Dark Mode)
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header with Counter and Score Placeholder */}
      <div className="bg-gray-800 p-4 flex justify-between items-center shadow-md border-b border-gray-700">
        <span className="font-black text-gray-400 text-lg">
          {currentQuestionIndex + 1} <span className="text-sm font-normal text-gray-500">/ {totalQuestions}</span>
        </span>
        <div className="flex items-center gap-2 font-bold text-gray-200 bg-gray-700 px-4 py-1 rounded-full border border-gray-600">
            <Timer className="w-4 h-4" />
            Quiz Time
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center p-4 max-w-6xl mx-auto w-full">
        {/* Question Area */}
        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 mb-6 w-full text-center flex-1 flex flex-col justify-center min-h-[300px] border border-gray-700">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 leading-tight">
            {question.question}
          </h2>
          
          {/* Timer Circle */}
          <div className="mt-8 flex justify-center">
            <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-gray-700 shadow-inner">
               <svg className="absolute w-full h-full transform -rotate-90">
                 <circle
                   className="text-gray-600"
                   strokeWidth="8"
                   stroke="currentColor"
                   fill="transparent"
                   r="36"
                   cx="40"
                   cy="40"
                 />
                 <circle
                   className={`transition-all duration-1000 ease-linear ${timeLeft < 5 ? 'text-red-500' : 'text-purple-500'}`}
                   strokeWidth="8"
                   strokeDasharray={226}
                   strokeDashoffset={226 - (226 * timeLeft) / question.timeLimit}
                   strokeLinecap="round"
                   stroke="currentColor"
                   fill="transparent"
                   r="36"
                   cx="40"
                   cy="40"
                 />
               </svg>
               <span className={`text-2xl font-black ${timeLeft < 5 ? 'text-red-400' : 'text-white'}`}>{timeLeft}</span>
            </div>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {question.options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option)}
              className={`${optionColors[index % 4]} text-white p-6 md:p-10 rounded-lg text-left transition-transform active:scale-95 active:translate-y-[4px] active:shadow-none flex items-center group border-b-4 border-black/20`}
            >
              <div className="bg-black/20 w-12 h-12 flex items-center justify-center rounded-md mr-4 text-2xl font-bold flex-shrink-0 group-hover:bg-black/30 transition-colors">
                 {optionShapes[index % 4]}
              </div>
              <span className="text-xl md:text-2xl font-bold leading-snug shadow-sm">{option.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};