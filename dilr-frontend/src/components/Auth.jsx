import React, { useState } from 'react';
import API from '../services/api';
import { FaGamepad, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    
    try {
      const response = await API.post(endpoint, formData);
      if (response.data.token) {
        // Token aur User data local storage me save karo
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user || response.data));
        onAuthSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gameDark flex items-center justify-center p-4">
      <div className="bg-gameCard border border-slate-800 w-full max-w-md rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Logo Vibe */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gameAccent/10 text-gameAccent p-4 rounded-full border border-gameAccent/20 mb-3 text-3xl animate-bounce">
            <FaGamepad />
          </div>
          <h1 className="text-2xl font-black tracking-wider">
            DILR<span className="text-gameNeon">ARENA</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-medium uppercase tracking-widest">Enter the ultimate logic grind</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl mb-4 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <FaUser className="absolute left-4 top-3.5 text-slate-500 text-sm" />
              <input
                type="text"
                placeholder="Choose Username"
                required
                className="w-full bg-slate-900 border border-slate-800 focus:border-gameAccent rounded-xl p-3 pl-11 text-sm focus:outline-none transition text-slate-200"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          )}

          <div className="relative">
            <FaEnvelope className="absolute left-4 top-3.5 text-slate-500 text-sm" />
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full bg-slate-900 border border-slate-800 focus:border-gameAccent rounded-xl p-3 pl-11 text-sm focus:outline-none transition text-slate-200"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-3.5 text-slate-500 text-sm" />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full bg-slate-900 border border-slate-800 focus:border-gameAccent rounded-xl p-3 pl-11 text-sm focus:outline-none transition text-slate-200"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gameAccent hover:bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-gameAccent/20 transition transform active:scale-[0.98] text-sm"
          >
            {loading ? 'Synchronizing...' : isLogin ? 'LAUNCH SESSION' : 'CREATE ACCOUNT'}
          </button>
        </form>

        {/* Tab Switcher */}
        <div className="mt-6 text-center text-xs text-slate-400">
          {isLogin ? "New to the arena? " : "Already have an operative profile? "}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-gameNeon font-bold hover:underline bg-transparent border-none outline-none cursor-pointer"
          >
            {isLogin ? 'Sign Up Here' : 'Log In Here'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Auth;
