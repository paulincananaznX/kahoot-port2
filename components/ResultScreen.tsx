import React from 'react';
import { Trophy, RefreshCw, Star } from 'lucide-react';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ score, totalQuestions, onRestart }) => {
  const percentage = (score / totalQuestions) * 100;
  
  let message = "Tente novamente!";
  let color = "text-red-400";
  
  if (percentage >= 100) {
    message = "Lendário!";
    color = "text-yellow-400";
  } else if (percentage >= 70) {
    message = "Excelente!";
    color = "text-green-400";
  } else if (percentage >= 50) {
    message = "Bom Trabalho!";
    color = "text-blue-400";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 p-6 text-white">
      <div className="bg-gray-900 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border-4 border-gray-800 relative overflow-hidden">
        
        {/* Background confetti decoration (static) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-400 rounded-full"></div>
          <div className="absolute top-20 right-20 w-6 h-6 bg-red-400 transform rotate-45"></div>
          <div className="absolute bottom-10 left-1/2 w-5 h-5 bg-blue-400 rounded-sm"></div>
        </div>

        <div className="mb-6 inline-block p-4 bg-gray-800 rounded-full shadow-lg border border-gray-700">
          <Trophy className={`w-16 h-16 ${percentage === 100 ? 'text-yellow-400 animate-bounce' : 'text-gray-500'}`} />
        </div>

        <h2 className={`text-4xl font-black mb-2 ${color} uppercase tracking-wider`}>
          {message}
        </h2>
        
        <div className="bg-gray-950 rounded-xl p-6 mb-8 mt-4 border border-gray-800">
          <p className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-2">Pontuação Final</p>
          <div className="text-5xl font-black text-white">
            {score} <span className="text-2xl text-gray-600">/ {totalQuestions}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-8 text-center">
            <div className="bg-green-900/20 p-2 rounded-lg border border-green-500/20">
                <Star className="w-5 h-5 text-green-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-green-200">Corretas</span>
                <p className="font-bold text-lg">{score}</p>
            </div>
            <div className="bg-red-900/20 p-2 rounded-lg border border-red-500/20">
                <div className="w-5 h-5 text-red-400 mx-auto mb-1 font-bold">✕</div>
                <span className="text-xs font-bold text-red-200">Erradas</span>
                <p className="font-bold text-lg">{totalQuestions - score}</p>
            </div>
            <div className="bg-blue-900/20 p-2 rounded-lg border border-blue-500/20">
                <div className="w-5 h-5 text-blue-400 mx-auto mb-1 font-bold">%</div>
                <span className="text-xs font-bold text-blue-200">Precisão</span>
                <p className="font-bold text-lg">{Math.round(percentage)}%</p>
            </div>
        </div>

        <button 
          onClick={onRestart}
          className="w-full py-4 bg-white text-gray-900 font-black rounded-lg hover:bg-gray-200 transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          JOGAR NOVAMENTE
        </button>
      </div>
    </div>
  );
};