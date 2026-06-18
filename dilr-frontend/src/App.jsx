import React, { useState, useEffect } from 'react';
import { FaFire, FaTrophy, FaGamepad, FaUser, FaPlay, FaSignOutAlt } from 'react-icons/fa';
import PuzzlePlayer from './components/PuzzlePlayer';
import Auth from './components/Auth';
import API from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [isPlaying, setIsPlaying] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userStats, setUserStats] = useState({
    username: "Player",
    eloRating: 1000,
    rankTier: "Bronze",
    currentStreak: 0
  });

  // Fetch data directly from live backend
  const fetchDashboardData = async () => {
    if (!isAuthenticated) return;
    try {
      // 1. Live Leaderboard fetch karo
      const lbResponse = await API.get('/game/leaderboard');
      if (lbResponse.data?.leaderboard) {
        setLeaderboard(lbResponse.data.leaderboard);
      }
      
      // 2. Logged in user ke fresh stats localstorage ya state me local saved data se sync karo
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        // Tip: Real-time update ke liye future me yahan /auth/me profile endpoint bna kar hit kar skte hain
        setUserStats({
          username: parsed.username || "Agent",
          eloRating: parsed.eloRating || 1000,
          rankTier: parsed.rankTier || "Bronze",
          currentStreak: parsed.currentStreak || 0
        });
      }
    } catch (error) {
      console.error("Dashboard synchronization failed:", error.message);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setIsPlaying(false);
  };

  // Auth Gate
  if (!isAuthenticated) {
    return <Auth onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  // Puzzle Player Gate
  if (isPlaying) {
    // Apne Google Drive ki real FileId yahan testing ke samay pass kar sakte ho
    return <PuzzlePlayer onBack={() => { setIsPlaying(false); fetchDashboardData(); }} />;
  }

  return (
    <div className="min-h-screen bg-gameDark text-slate-100 flex flex-col">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-gameCard px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-2 text-xl font-bold tracking-wider text-gameAccent">
          <FaGamepad className="text-2xl" />
          <span>DILR<span className="text-gameNeon">ARENA</span></span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-orange-500 font-bold bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 text-sm">
            <FaFire />
            <span>{userStats.currentStreak} Days</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-800/80 px-4 py-1.5 rounded-lg border border-slate-700 text-sm">
            <FaUser className="text-slate-400" />
            <span className="font-semibold text-slate-200">{userStats.username} ({userStats.eloRating} Elo)</span>
          </div>
          <button 
            onClick={handleLogout}
            className="text-slate-500 hover:text-red-400 p-2 rounded-lg transition"
            title="Log Out"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left & Middle Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-gradient-to-r from-gameAccent to-indigo-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-extrabold mb-2">Welcome Back, {userStats.username}!</h1>
              <p className="text-indigo-200 mb-4 max-w-md">Your current tier is <span className="text-white font-bold underline decoration-gameNeon">{userStats.rankTier}</span>. Ready to claim today's Rating Points?</p>
            </div>
          </div>

          {/* Daily Set Blitz Card */}
          <div className="bg-gameCard border border-slate-800 rounded-2xl p-6 shadow-md hover:border-slate-700 transition flex justify-between items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider bg-gameNeon/10 text-gameNeon px-2.5 py-1 rounded-md">Daily Quest</span>
              <h2 className="text-2xl font-bold mt-2 mb-1">The Daily Set Blitz</h2>
              <p className="text-slate-400 text-sm">Everyone plays the same 15-minute set. Protect your streak!</p>
            </div>
            <button 
              onClick={() => setIsPlaying(true)}
              className="bg-gameNeon hover:bg-emerald-600 text-gameDark font-extrabold px-6 py-3 rounded-xl flex items-center space-x-2 transform active:scale-95 transition shadow-lg shadow-gameNeon/20"
            >
              <FaPlay />
              <span>PLAY</span>
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Leaderboard */}
        <div className="bg-gameCard border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col">
          <div className="flex items-center space-x-2 text-lg font-bold border-b border-slate-800 pb-3 mb-4">
            <FaTrophy className="text-yellow-500" />
            <span>Global Leaderboard</span>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto pr-1">
            {leaderboard.length === 0 ? (
              <p className="text-slate-500 text-xs text-center pt-8">No legends recorded yet. Be the first!</p>
            ) : (
              leaderboard.map((player, idx) => (
                <div 
                  key={player._id || idx} 
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    player.username === userStats.username 
                      ? 'bg-gameAccent/20 border-gameAccent' 
                      : 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 text-center font-black text-sm text-slate-500">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-sm">{player.username}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">{player.rankTier}</div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gameNeon">{player.eloRating} QP</div>
                </div>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
