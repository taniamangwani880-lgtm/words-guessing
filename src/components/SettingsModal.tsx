import { motion } from 'motion/react';
import { X, Trophy, Settings2, HelpCircle } from 'lucide-react';
import { Category, Difficulty } from '@/src/lib/gameData';

interface SettingsModalProps {
  onClose: () => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  category: Category | 'random';
  setCategory: (c: Category | 'random') => void;
  isTimerMode: boolean;
  setIsTimerMode: (v: boolean) => void;
  isMultiplayer: boolean;
  toggleMultiplayer: () => void;
}

export function SettingsModal({
  onClose,
  difficulty,
  setDifficulty,
  category,
  setCategory,
  isTimerMode,
  setIsTimerMode,
  isMultiplayer,
  toggleMultiplayer
}: SettingsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md glass-card p-6 border-neon-blue/30 relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
          <Settings2 className="text-neon-blue" />
          Settings
        </h2>

        <div className="space-y-6">
          {/* Difficulty */}
          <section>
            <label className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3 block">Difficulty</label>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-bold transition-all ${
                    difficulty === d 
                    ? 'bg-neon-blue/20 border-neon-blue text-neon-blue' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {d.toUpperCase()}
                </button>
              ))}
            </div>
          </section>

          {/* Category */}
          <section>
            <label className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-800/50 border-slate-700 border rounded-lg py-2 px-3 text-sm focus:border-neon-blue outline-none transition-all"
            >
              <option value="random">Random All</option>
              <option value="animals">Animals</option>
              <option value="countries">Countries</option>
              <option value="movies">Movies</option>
              <option value="science">Science</option>
              <option value="sports">Sports</option>
            </select>
          </section>

          {/* Modes */}
          <section className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700">
            <div>
              <p className="text-sm font-bold">Timer Mode</p>
              <p className="text-[10px] text-slate-400">90 seconds for better scores</p>
            </div>
            <button
              onClick={() => setIsTimerMode(!isTimerMode)}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                isTimerMode ? 'bg-neon-green' : 'bg-slate-700'
              }`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                isTimerMode ? 'translate-x-6' : ''
              }`} />
            </button>
          </section>

          {/* Multiplayer */}
          <section className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700">
            <div>
              <p className="text-sm font-bold">Battle Mode (Local)</p>
              <p className="text-[10px] text-slate-400">2-Players take turns</p>
            </div>
            <button
              onClick={toggleMultiplayer}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                isMultiplayer ? 'bg-neon-pink' : 'bg-slate-700'
              }`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                isMultiplayer ? 'translate-x-6' : ''
              }`} />
            </button>
          </section>

          <button
            onClick={onClose}
            className="w-full py-3 bg-neon-blue text-black font-bold rounded-xl mt-4 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-neon-blue/20"
          >
            Save & Continue
          </button>
        </div>
      </motion.div>
    </div>
  );
}
