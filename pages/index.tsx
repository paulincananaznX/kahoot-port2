import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { generateRoomCode } from '../lib/gameLogic';
import { db } from '../lib/firebase';
import { ref, set } from 'firebase/database';

export default function Home() {
    const router = useRouter();
    const [joinCode, setJoinCode] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const createRoom = async () => {
        setIsCreating(true);
        const roomCode = generateRoomCode();
        try {
            await set(ref(db, `rooms/${roomCode}`), {
                gameState: 'waiting',
                currentQuestionIndex: 0,
                players: {},
                createdAt: Date.now()
            });
            router.push(`/host/${roomCode}`);
        } catch (error) {
            console.error("Error creating room:", error);
            alert("Failed to create room. Check your connection.");
        } finally {
            setIsCreating(false);
        }
    };

    const joinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (joinCode.length === 6 && playerName.trim()) {
            // Store player name locally for simplicity when redirecting
            localStorage.setItem('playerName', playerName);
            router.push(`/game/${joinCode.toUpperCase()}`);
        } else {
            alert("Please enter a valid 6-character code and your name.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-800 text-white p-4">
            <main className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20">
                <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                    Quiz: Éramos Cinco
                </h1>

                <div className="space-y-6">
                    <div className="text-center">
                        <button
                            onClick={createRoom}
                            disabled={isCreating}
                            className="w-full py-4 bg-orange-500 hover:bg-orange-600 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
                        >
                            {isCreating ? 'Creating...' : 'Create New Room (Host)'}
                        </button>
                        <p className="mt-2 text-sm text-gray-300">Generate a code to invite players</p>
                    </div>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-600"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400">OR</span>
                        <div className="flex-grow border-t border-gray-600"></div>
                    </div>

                    <form onSubmit={joinRoom} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Enter Room Code</label>
                            <input
                                type="text"
                                maxLength={6}
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                className="w-full p-3 bg-black/30 border border-gray-600 rounded-lg text-center tracking-widest text-2xl font-mono focus:border-orange-500 outline-none transition-colors"
                                placeholder="ABC123"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Your Nickname</label>
                            <input
                                type="text"
                                maxLength={15}
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                className="w-full p-3 bg-black/30 border border-gray-600 rounded-lg focus:border-orange-500 outline-none transition-colors"
                                placeholder="Enter your name"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-lg transition-all shadow-lg"
                        >
                            Join Game
                        </button>
                    </form>
                </div>
            </main>

            <footer className="mt-12 text-gray-400 text-sm">
                Based on the poem "Da hora de pôr a mesa, éramos cinco" by José Luís Peixoto
            </footer>
        </div>
    );
}
