export const generateRoomCode = (): string => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

export const calculateScore = (
    timeElapsed: number,
    totalTime: number,
    baseScore: number = 1000
): number => {
    // Formula: Max 1000, decays 25 pts per second.
    // Minimum 500 (if answered within time limit).
    // If incorrect, score is handled by caller (0).
    const decay = 25;
    const score = baseScore - (timeElapsed * decay);
    return Math.round(Math.max(500, score));
};

export type Player = {
    id: string;
    name: string;
    score: number;
    answers: Record<number, number>; // questionIndex -> answerIndex
};

export type GameState = "waiting" | "get_ready" | "question" | "leaderboard" | "finished";

export type Room = {
    id: string;
    gameState: GameState;
    currentQuestionIndex: number;
    players: Record<string, Player>;
    startTime?: number; // timestamp when current question started
};
