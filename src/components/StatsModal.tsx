import { motion } from 'motion/react';
import { X, BarChart3, Trophy, Target, Hash } from 'lucide-react';
import { UserStats } from '@/src/types';

interface StatsModalProps {
  onClose: () => void;
  stats: UserStats;
}

export function StatsModal({ onClose, stats }: StatsModalProps) {
  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm glass-card p-6 border-neon-purple/30 relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
          <BarChart3 className="text-neon-purple" />
          Statistics
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <p className="text-[10px] uppercase text-slate-400 mb-1">Played</p>
            <p className="text-2xl font-black font-display text-white">{stats.gamesPlayed}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <p className="text-[10px] uppercase text-slate-400 mb-1">Win Rate</p>
            <p className="text-2xl font-black font-display text-neon-green">{winRate}%</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <p className="text-[10px] uppercase text-slate-400 mb-1">Best Streak</p>
            <p className="text-2xl font-black font-display text-neon-pink">{stats.maxStreak}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <p className="text-[10px] uppercase text-slate-400 mb-1">Points</p>
            <p className="text-2xl font-black font-display text-neon-blue">{stats.points}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-neon-purple text-white font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-neon-purple/20"
        >
          Awesome!
        </button>
      </motion.div>
    </div>
  );
}
