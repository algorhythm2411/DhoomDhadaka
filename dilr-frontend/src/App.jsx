import React, { useState } from 'react';
import { FaFire, FaTrophy, FaGamepad, FaUser, FaPlay } from 'react-icons/fa';
import PuzzlePlayer from './components/PuzzlePlayer'; // Import matching the newly created component

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [userStats, setUserStats] = useState({
    username: "LogicWarrior",
    eloRating: 1450,
    rankTier: "Silver",
    currentStreak: 5
  });

  const leaderboardData = [
    { rank: 1, username: "DILR_Deity", elo: 2800, tier: "Grandmaster" },
    { rank: 2, username: "MatrixMaster", elo: 2450, tier: "Diamond" },
    { rank: 3, username: "QuantPro", elo: 2100, tier: "Gold" },
    { rank: 4, username: "LogicWarrior", elo: 1450, tier: "Silver" }
  ];

  // Route Handler Condition
  if (isPlaying) {
    return <PuzzlePlayer onBack={() => setIsPlaying(false)} />;
  }

  return (
    <div className="min-h-screen bg-gameDark text-slate-100 flex flex-col">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-gameCard px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-2 text-xl font-bold tracking-wider text-gameAccent">
          <FaGamepad className="text-2xl" />
          <span>DILR<span className="text-gameNeon">ARENA</span></span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1 text-orange-500 font-bold bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
            <FaFire />
            <span>{userStats.currentStreak} Days</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-700/50 px-4 py-1.5 rounded-lg border border-slate-600">
            <FaUser className="text-slate-400" />
            <span className="font-medium text-sm">{userStats.username} ({userStats.eloRating} Elo)</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left & Middle Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-gameAccent to-indigo-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-extrabold mb-2">Welcome Back, {userStats.username}!</h1>
              <p className="text-indigo-200 mb-4 max-w-md">Your current rank is <span className="text-white font-bold underline decoration-gameNeon">{userStats.rankTier}</span>. Ready to claim today's Rating Points?</p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 text-9xl font-black select-none pointer-events-none p-4">DILR</div>
          </div>

          {/* Daily Set Blitz Card */}
          <div className="bg-gameCard border border-slate-800 rounded-2xl p-6 shadow-md hover:border-slate-700 transition flex justify-between items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider bg-gameNeon/10 text-gameNeon px-2.5 py-1 rounded-md">Daily Quest</span>
              <h2 className="text-2xl font-bold mt-2 mb-1">The Daily Set Blitz</h2>
              <p className="text-slate-400 text-sm">Everyone plays the same 15-minute set. Protect your streak!</p>
            </div>
            <button 
              onClick={() => setIsPlaying(true)} // Toggles state to launch Puzzle Arena
              className="bg-gameNeon hover:bg-emerald-600 text-gameDark font-extrabold px-6 py-3 rounded-xl flex items-center space-x-2 transform active:scale-95 transition shadow-lg shadow-gameNeon/20"
            >
              <FaPlay />
              <span>PLAY</span>
            </button>
          </div>

          {/* Time Attack Card Placeholder */}
          <div className="bg-gameCard border border-slate-800 rounded-2xl p-6 shadow-md opacity-70">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded-md">PvP Mode</span>
                <h2 className="text-xl font-bold mt-2 mb-1">Time-Attack Duel</h2>
                <p className="text-slate-400 text-sm">Match head-to-head on a 10-minute set. Faster accurate solver wins.</p>
              </div>
              <span className="text-xs font-bold bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700">LOCK</span>
            </div>
          </div>
        </div>

        {/* Right Column: Leaderboard */}
        <div className="bg-gameCard border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col">
          <div className="flex items-center space-x-2 text-lg font-bold border-b border-slate-800 pb-3 mb-4">
            <FaTrophy className="text-yellow-500" />
            <span>Global Leaderboard</span>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto pr-1">
            {leaderboardData.map((player) => (
              <div 
                key={player.rank} 
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  player.username === userStats.username 
                    ? 'bg-gameAccent/20 border-gameAccent' 
                    : 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-6 text-center font-bold text-sm ${
                    player.rank === 1 ? 'text-yellow-500' : player.rank === 2 ? 'text-slate-400' : player.rank === 3 ? 'text-amber-600' : 'text-slate-500'
                  }`}>
                    #{player.rank}
                  </span>
                  <div>
                    <div className="font-semibold text-sm">{player.username}</div>
                    <div className="text-xs text-slate-500">{player.tier}</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-gameNeon">{player.elo} QP</div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
