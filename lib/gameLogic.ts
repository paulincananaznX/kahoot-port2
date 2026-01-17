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
    // Formula: P = B * (1 - (t / T) * 0.5)
    // Ensures minimum score is 50% of base if answered at the very last second
    const score = baseScore * (1 - (timeElapsed / totalTime) * 0.5);
    return Math.round(Math.max(0, score));
};

export type Player = {
    id: string;
    name: string;
    score: number;
    answers: Record<number, number>; // questionIndex -> answerIndex
};

export type GameState = "waiting" | "playing" | "leaderboard" | "finished";

export type Room = {
    id: string;
    gameState: GameState;
    currentQuestionIndex: number;
    players: Record<string, Player>;
    startTime?: number; // timestamp when current question started
};
