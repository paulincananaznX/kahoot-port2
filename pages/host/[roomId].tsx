import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../lib/firebase';
import { ref, onValue, update, set } from 'firebase/database';
import { quizQuestions } from '../../data/questions';
import { Player } from '../../lib/gameLogic';
import confetti from 'canvas-confetti';

export default function HostPage() {
    const router = useRouter();
    const { roomId } = router.query;
    const [players, setPlayers] = useState<Player[]>([]);
    const [gameState, setGameState] = useState('waiting');
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);

    // Load Room Data
    useEffect(() => {
        if (!roomId) return;

        // Ensure roomId is a string
        const rId = Array.isArray(roomId) ? roomId[0] : roomId;
        console.log(`[HOST] Subscribing to room: ${rId}`);

        const roomRef = ref(db, `rooms/${rId}`);

        // Subscribe to entire room for simplicity (optimize in prod)
        const unsubscribe = onValue(roomRef, (snapshot) => {
            const data = snapshot.val();
            console.log(`[HOST] Received room data update:`, data);

            if (data) {
                setGameState(data.gameState);
                setCurrentQuestionIdx(data.currentQuestionIndex || 0);

                const playersList = data.players ? Object.values(data.players) as Player[] : [];
                console.log(`[HOST] Players list updated: ${playersList.length} players`);

                // Sort by score if game started
                playersList.sort((a, b) => b.score - a.score);
                setPlayers(playersList);
            } else {
                console.warn(`[HOST] No data found for room ${rId}`);
            }
        }, (error) => {
            console.error(`[HOST] Firebase read error:`, error);
            alert("Error connecting to game server.");
        });

        return () => {
            console.log(`[HOST] Unsubscribing from room ${rId}`);
            unsubscribe();
        };
    }, [roomId]);

    // Timer Logic
    useEffect(() => {
        if (gameState === 'question' && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (gameState === 'question' && timeLeft === 0) {
            // Time's up! Show leaderboard
            update(ref(db, `rooms/${roomId}`), {
                gameState: 'leaderboard'
            });
        }
    }, [gameState, timeLeft, roomId]);

    const startGame = () => {
        const rId = Array.isArray(roomId) ? roomId[0] : roomId;
        console.log(`[HOST] Starting game for room: ${rId}`);

        update(ref(db, `rooms/${rId}`), {
            gameState: 'question',
            currentQuestionIndex: 0,
            startTime: Date.now() + 3000 // Give 3s buffer
        }).then(() => {
            console.log("[HOST] Game started successfully");
        }).catch((err) => {
            console.error("[HOST] Failed to start game:", err);
            alert("Failed to start game. Check console.");
        });
        // Need to handle countdown on client side properly, but setting time here:
        setTimeLeft(quizQuestions[0].timeLimit);
    };

    const nextQuestion = () => {
        const nextIdx = currentQuestionIdx + 1;
        if (nextIdx < quizQuestions.length) {
            update(ref(db, `rooms/${roomId}`), {
                gameState: 'question',
                currentQuestionIndex: nextIdx,
                startTime: Date.now() + 1000
            });
            setTimeLeft(quizQuestions[nextIdx].timeLimit);
        } else {
            update(ref(db, `rooms/${roomId}`), {
                gameState: 'finished'
            });
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    };

    if (!roomId) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <header className="p-4 bg-gray-800 flex justify-between items-center shadow-md">
                <h1 className="text-xl font-bold">Host Panel</h1>
                <div className="text-2xl font-mono text-orange-400 tracking-widest bg-black/50 px-4 py-2 rounded">
                    CODE: {roomId}
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center p-6">
                {gameState === 'waiting' && (
                    <div className="text-center space-y-8">
                        <h2 className="text-4xl font-bold mb-4">Waiting for players...</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                            {players.map(p => (
                                <div key={p.id} className="bg-indigo-600 px-6 py-3 rounded-lg animate-pulse">
                                    {p.name}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={startGame}
                            className="px-8 py-4 bg-green-500 hover:bg-green-600 rounded-xl text-2xl font-bold shadow-lg transform transition hover:scale-105"
                        >
                            Start Game ({players.length} Players)
                        </button>
                    </div>
                )}

                {gameState === 'question' && (
                    <div className="w-full max-w-4xl space-y-8">
                        <div className="text-center mb-8">
                            <div className="text-6xl font-bold text-yellow-400 mb-2">{timeLeft}s</div>
                            <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-400 transition-all duration-1000 ease-linear"
                                    style={{ width: `${(timeLeft / quizQuestions[currentQuestionIdx].timeLimit) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
                            <h3 className="text-xl text-gray-400 mb-2">Question {currentQuestionIdx + 1}/{quizQuestions.length}</h3>
                            <p className="text-3xl md:text-4xl font-semibold leading-tight">
                                {quizQuestions[currentQuestionIdx].question}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {quizQuestions[currentQuestionIdx].options.map((opt) => (
                                <div
                                    key={opt.id}
                                    className={`p-6 rounded-xl text-xl font-medium border-2 
                     ${opt.isCorrect ? 'border-green-500 bg-green-500/20' : 'border-gray-600 bg-gray-800'}`}
                                >
                                    {opt.text}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {gameState === 'leaderboard' && (
                    <div className="w-full max-w-2xl text-center space-y-6">
                        <h2 className="text-4xl font-bold text-indigo-400">Leaderboard</h2>
                        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
                            {players.slice(0, 8).map((p, idx) => (
                                <div key={p.id} className="flex justify-between items-center p-4 border-b border-gray-700 last:border-0 hover:bg-white/5 transition">
                                    <div className="flex items-center gap-4">
                                        <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold 
                      ${idx === 0 ? 'bg-yellow-500 text-black' :
                                                idx === 1 ? 'bg-gray-400 text-black' :
                                                    idx === 2 ? 'bg-orange-600 text-black' : 'bg-gray-700'}`}>
                                            {idx + 1}
                                        </span>
                                        <span className="text-xl">{p.name}</span>
                                    </div>
                                    <span className="text-2xl font-mono text-green-400">{p.score}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={nextQuestion}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-xl font-bold shadow-lg"
                        >
                            Next Question
                        </button>
                    </div>
                )}

                {gameState === 'finished' && (
                    <div className="text-center space-y-8">
                        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-500 to-red-500">
                            WINNERS POEM
                        </h1>
                        <div className="flex items-end justify-center gap-4 h-64 pb-4">
                            {/* 2nd Place */}
                            {players[1] && (
                                <div className="flex flex-col items-center animate-bounce duration-1000">
                                    <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-gray-500 mb-2 overflow-hidden flex items-center justify-center text-gray-800 text-2xl font-bold">
                                        {players[1].name.charAt(0)}
                                    </div>
                                    <div className="w-24 h-32 bg-gray-500 rounded-t-lg flex items-center justify-center text-white text-2xl font-bold">2</div>
                                    <div className="mt-2 text-xl">{players[1].name}</div>
                                    <div className="text-gray-400">{players[1].score} pts</div>
                                </div>
                            )}

                            {/* 1st Place */}
                            {players[0] && (
                                <div className="flex flex-col items-center mb-12 animate-bounce">
                                    <div className="relative">
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-5xl">👑</div>
                                        <div className="w-32 h-32 rounded-full bg-yellow-300 border-4 border-yellow-500 mb-2 overflow-hidden flex items-center justify-center text-yellow-800 text-3xl font-bold">
                                            {players[0].name.charAt(0)}
                                        </div>
                                    </div>
                                    <div className="w-32 h-48 bg-yellow-500 rounded-t-lg flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-yellow-500/50">1</div>
                                    <div className="mt-2 text-2xl font-bold text-yellow-400">{players[0].name}</div>
                                    <div className="text-gray-400">{players[0].score} pts</div>
                                </div>
                            )}

                            {/* 3rd Place */}
                            {players[2] && (
                                <div className="flex flex-col items-center animate-bounce duration-1000 delay-100">
                                    <div className="w-24 h-24 rounded-full bg-orange-300 border-4 border-orange-500 mb-2 overflow-hidden flex items-center justify-center text-orange-900 text-2xl font-bold">
                                        {players[2].name.charAt(0)}
                                    </div>
                                    <div className="w-24 h-24 bg-orange-600 rounded-t-lg flex items-center justify-center text-white text-2xl font-bold">3</div>
                                    <div className="mt-2 text-xl">{players[2].name}</div>
                                    <div className="text-gray-400">{players[2].score} pts</div>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => router.push('/')}
                            className="mt-8 text-gray-500 hover:text-white underline"
                        >
                            Back to Home
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
