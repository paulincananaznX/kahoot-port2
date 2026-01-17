import React from 'react';
import { Play } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6 text-white text-center">
      <div className="bg-gray-800 p-8 rounded-2xl backdrop-blur-sm shadow-2xl max-w-2xl w-full border border-gray-700 animate-float">
        <h1 className="text-4xl md:text-6xl font-black mb-6 text-yellow-400 drop-shadow-md">
          Da hora de pôr a mesa
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-300">
          Quiz sobre José Luís Peixoto
        </h2>
        
        <div className="space-y-4 mb-10 text-lg text-gray-300">
          <p>Teste os seus conhecimentos sobre a biografia, estrutura e análise do poema.</p>
          <div className="flex justify-center gap-4 text-sm font-semibold opacity-90">
            <span className="bg-gray-700 px-3 py-1 rounded-full border border-gray-600">8 Perguntas</span>
            <span className="bg-gray-700 px-3 py-1 rounded-full border border-gray-600">Literatura</span>
          </div>
        </div>

        <button 
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-black text-white transition-all duration-200 bg-green-600 rounded-lg hover:bg-green-500 hover:scale-105 focus:outline-none ring-offset-2 focus:ring-4 ring-green-700 ring-offset-gray-900 text-xl w-full md:w-auto shadow-[0_4px_0_rgb(21,128,61)] hover:shadow-[0_2px_0_rgb(21,128,61)] hover:translate-y-[2px]"
        >
          <span className="mr-2">COMEÇAR</span>
          <Play className="w-6 h-6 fill-current" />
        </button>
      </div>
      
      <footer className="mt-12 text-gray-500 text-sm">
        Baseado no trabalho de Letícia Silva e Gustavo Damacena
      </footer>
    </div>
  );
};