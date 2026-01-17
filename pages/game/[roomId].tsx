import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../lib/firebase';
import { ref, onValue, set, get, update } from 'firebase/database';
import { generateRoomCode, calculateScore } from '../../lib/gameLogic';
import { quizQuestions } from '../../data/questions';

export default function GamePage() {
    const router = useRouter();
    const { roomId } = router.query;
    const [playerInfo, setPlayerInfo] = useState<{ name: string, id: string } | null>(null);
    const [gameState, setGameState] = useState('waiting');
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [score, setScore] = useState(0);

    // Join Room Logic
    useEffect(() => {
        if (!roomId) return;

        // Ensure roomId is a string
        const rId = Array.isArray(roomId) ? roomId[0] : roomId;
        console.log(`[PLAYER] Connecting to room: ${rId}`);

        const name = localStorage.getItem('playerName') || 'Anonymous';
        const id = localStorage.getItem('playerId') || Math.random().toString(36).substr(2, 9);
        localStorage.setItem('playerId', id);
        setPlayerInfo({ name, id });

        const roomRef = ref(db, `rooms/${rId}`);

        // Check if room exists first
        get(roomRef).then((snapshot) => {
            if (!snapshot.exists()) {
                console.error(`[PLAYER] Room ${rId} not found`);
                alert("Room not found!");
                router.push('/');
                return;
            }

            console.log(`[PLAYER] Room found, registering player: ${name} (${id})`);

            // Register player
            update(ref(db, `rooms/${rId}/players/${id}`), {
                name: name,
                id: id,
                score: 0 // Initialize score if new
            }).then(() => {
                console.log("[PLAYER] Registered successfully");
            }).catch(err => {
                console.error("[PLAYER] Registration failed:", err);
            });
        }).catch(err => {
            console.error("[PLAYER] Error checking room:", err);
        });

        // Listen to game state
        const unsubscribe = onValue(roomRef, (snapshot) => {
            const data = snapshot.val();
            console.log(`[PLAYER] Game state update:`, data);

            if (data) {
                setGameState(data.gameState);
                // Reset answer state when question changes
                if (data.currentQuestionIndex !== currentQuestionIdx) {
                    setCurrentQuestionIdx(data.currentQuestionIndex);
                    setHasAnswered(false);
                    setFeedback(null);
                }
                // Update my score
                if (data.players && data.players[id]) {
                    setScore(data.players[id].score || 0);
                }
            }
        }, (error) => {
            console.error("[PLAYER] Firebase subscription error:", error);
        });

        return () => unsubscribe();
    }, [roomId]);

    const submitAnswer = (optionId: string) => {
        if (hasAnswered || gameState !== 'question') return;

        setHasAnswered(true);
        const question = quizQuestions[currentQuestionIdx];
        const isCorrect = optionId === question.options.find(o => o.isCorrect)?.id;

        setFeedback(isCorrect ? 'correct' : 'incorrect');

        if (isCorrect) {
            // Calculate score based on time
            // Note: In a real secure app, timestamp should be checked on server/host
            // Here we estimate.
            const startTime = Date.now(); // Ideally get this from firebase 'startTime'
            // Fetch room start time to be accurate
            // Fetch room start time to be accurate
            const rId = Array.isArray(roomId) ? roomId[0] : roomId;
            get(ref(db, `rooms/${rId}/startTime`)).then((snap) => {
                const qStartTime = snap.val() || Date.now();
                const elapsed = (Date.now() - qStartTime) / 1000;
                const points = calculateScore(elapsed, question.timeLimit);

                // Update score atomically
                get(ref(db, `rooms/${rId}/players/${playerInfo?.id}/score`)).then((sSnap) => {
                    const currentScore = sSnap.val() || 0;
                    update(ref(db, `rooms/${rId}/players/${playerInfo?.id}`), {
                        score: currentScore + points
                    });
                });
            });
        }
    };

    if (!roomId || !playerInfo) return <div className="p-8 text-white">Connecting...</div>;

    return (
        <div className="min-h-screen bg-indigo-900 text-white flex flex-col p-4">
            <div className="flex justify-between items-center mb-6">
                <div className="font-bold">{playerInfo.name}</div>
                <div className="bg-black/40 px-3 py-1 rounded text-orange-400 font-mono">{score} pts</div>
            </div>

            <main className="flex-grow flex flex-col justify-center">
                {gameState === 'waiting' && (
                    <div className="text-center animate-pulse">
                        <h2 className="text-2xl font-bold mb-2">You're in!</h2>
                        <p className="text-indigo-200">See your name on the host screen?</p>
                    </div>
                )}

                {gameState === 'get_ready' && (
                    <div className="text-center animate-bounce">
                        <h2 className="text-4xl font-bold mb-2 text-yellow-400">Get Ready!</h2>
                        <p className="text-indigo-200 text-xl">Look at the host screen...</p>
                    </div>
                )}

                {gameState === 'question' && !hasAnswered && (
                    <div className="grid grid-cols-1 gap-4">
                        <div className="mb-4 p-4 bg-white/5 rounded-lg text-center">
                            Look at the host screen for the question!
                        </div>
                        {quizQuestions[currentQuestionIdx].options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => submitAnswer(opt.id)}
                                className="p-6 bg-white text-indigo-900 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
                            >
                                {opt.text}
                            </button>
                        ))}
                    </div>
                )}

                {hasAnswered && (
                    <div className="text-center">
                        {feedback === 'correct' ? (
                            <div className="text-green-400 text-5xl font-bold mb-4 animate-bounce">Correct!</div>
                        ) : (
                            <div className="text-red-400 text-5xl font-bold mb-4">Wrong...</div>
                        )}
                        <p className="text-gray-400">Wait for next question...</p>
                    </div>
                )}

                {(gameState === 'leaderboard' || gameState === 'finished') && (
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4">Round Over</h2>
                        <p className="text-xl">Your Score: {score}</p>
                        <p className="text-gray-400 mt-8">Look at the host screen for rankings!</p>
                    </div>
                )}
            </main>
        </div>
    );
}
