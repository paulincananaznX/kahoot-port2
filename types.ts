export interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  question: string;
  options: AnswerOption[];
  timeLimit: number; // in seconds
  imageUrl?: string;
}

export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  FEEDBACK = 'FEEDBACK', // Shows if the answer was right/wrong
  RESULT = 'RESULT'
}
