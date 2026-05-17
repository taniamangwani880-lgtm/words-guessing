import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Settings as SettingsIcon, 
  RefreshCw, 
  Flame, 
  Clock, 
  Zap, 
  Lightbulb, 
  HelpCircle,
  BarChart3,
  Moon,
  Sun,
  ShieldQuestion
} from 'lucide-react';
import { useGameLogic } from './hooks/useGameLogic';
import { Keyboard } from './components/Keyboard';
import { WordDisplay } from './components/WordDisplay';
import { StatItem } from './components/StatItem';
import { SettingsModal } from './components/SettingsModal';
import { DIFFICULTY_SETTINGS } from './lib/gameData';
import { cn } from './lib/utils';

export default function App() {
  const {
    wordEntry,
    revealedLetters,
    wrongLetters,
    status,
    difficulty,
    setDifficulty,
    category,
    setCategory,
    stats,
    timeRemaining,
    isTimerMode,
    setIsTimerMode,
    handleKeyPress,
    startNewGame,
    useHint,
    hintUsed,
    isMultiplayer,
    toggleMultiplayer,
    playerScores,
    currentPlayer,
    playDailyChallenge
  } = useGameLogic();

  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Keyboard mapping for status
  const usedKeys: Record<string, 'correct' | 'present' | 'absent' | 'default'> = {};
  revealedLetters.forEach(l => usedKeys[l] = 'correct');
  wrongLetters.forEach(l => usedKeys[l] = 'absent');

  const maxAttempts = DIFFICULTY_SETTINGS[difficulty].attempts;
  const attemptsRemaining = maxAttempts - wrongLetters.length;

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      const key = e.key.toUpperCase();
      if (key === 'BACKSPACE') handleKeyPress('DELETE');
      else if (key === 'ENTER') handleKeyPress('ENTER');
      else if (/^[A-Z]$/.test(key)) handleKeyPress(key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-between py-6 px-4 transition-colors duration-500",
      isDarkMode ? "text-slate-100" : "bg-slate-50 text-slate-900"
    )}>
      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 glass-card border-neon-blue/40 shadow-[0_0_15px_-5px_rgba(0,243,255,0.5)]">
            <Zap className="text-neon-blue" size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight flex items-center gap-2">
              LEXI<span className="text-neon-blue neon-text-blue">GUESS</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Pro Word Quest</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={playDailyChallenge}
            className="hidden md:flex items-center gap-2 px-4 py-2 glass-card border-neon-green/30 text-neon-green text-[10px] font-black uppercase tracking-widest hover:bg-neon-green/10 transition-all mr-2"
          >
            Daily Quest
          </button>
          <button 
            onClick={() => setShowStats(true)}
            className="p-2 transition-all hover:bg-slate-800/20 rounded-full text-neon-purple shadow-[0_0_10px_rgba(188,19,254,0.3)]"
          >
            <BarChart3 size={20} />
          </button>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 transition-all hover:bg-slate-800/20 rounded-full"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 transition-all hover:bg-slate-800/20 rounded-full"
          >
            <SettingsIcon size={20} />
          </button>
        </div>
      </header>

      {/* Multiplayer Header */}
      {isMultiplayer && (
        <div className="w-full max-w-2xl flex justify-center gap-8 mb-4 p-2 glass-card border-neon-purple/20">
          <div className={cn("text-center transition-all", currentPlayer === 0 ? "scale-110 text-neon-blue" : "opacity-40")}>
            <p className="text-[10px] font-bold">PLAYER 1</p>
            <p className="text-xl font-black">{playerScores[0]}</p>
          </div>
          <div className="self-center font-black text-slate-700">VS</div>
          <div className={cn("text-center transition-all", currentPlayer === 1 ? "scale-110 text-neon-pink" : "opacity-40")}>
            <p className="text-[10px] font-bold">PLAYER 2</p>
            <p className="text-xl font-black">{playerScores[1]}</p>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="w-full max-w-2xl flex flex-wrap gap-3 mb-6">
        <StatItem 
          label="Points" 
          value={stats.points} 
          icon={Trophy} 
          color="blue" 
        />
        <StatItem 
          label="Streak" 
          value={stats.streak} 
          icon={Flame} 
          color="pink" 
        />
        <StatItem 
          label="Tries" 
          value={`${attemptsRemaining}/${maxAttempts}`} 
          icon={ShieldQuestion} 
          color="purple" 
        />
        {isTimerMode && (
          <StatItem 
            label="Time" 
            value={timeRemaining ?? '--'} 
            icon={Clock} 
            color={timeRemaining && timeRemaining < 10 ? 'pink' : 'green'} 
          />
        )}
      </div>

      {/* Main Game Area */}
      <main className="flex-1 w-full flex flex-col items-center justify-center max-w-2xl">
        <div className="text-center mb-2">
          <span className="px-3 py-1 rounded-full bg-slate-800/50 text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-slate-700">
            Category: {wordEntry.category}
          </span>
        </div>

        <WordDisplay 
          word={wordEntry.word} 
          revealedLetters={revealedLetters} 
          status={status} 
        />

        <AnimatePresence>
          {status === 'playing' ? (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="text-center italic text-slate-500 mb-8 max-w-sm px-4"
             >
               "{wordEntry.hint}"
             </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn(
                "glass-card p-8 text-center mb-12 border-2",
                status === 'won' ? "border-neon-green/30" : "border-neon-pink/30"
              )}
            >
              <h2 className={cn(
                "text-4xl font-display font-black mb-2",
                status === 'won' ? "text-neon-green" : "text-neon-pink"
              )}>
                {status === 'won' ? 'VICTORY!' : 'GAME OVER'}
              </h2>
              <p className="text-slate-400 mb-6">
                The word was <span className="text-white font-bold tracking-widest">{wordEntry.word}</span>
              </p>
              <div className="flex gap-4">
                <button
                  onClick={startNewGame}
                  className="flex-1 py-4 bg-neon-blue text-black font-black rounded-xl hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw size={20} />
                  PLAY AGAIN
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint Button */}
        {status === 'playing' && (
          <button
            onClick={useHint}
            disabled={hintUsed || stats.points < 50}
            className={cn(
              "mb-8 flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-bold",
              hintUsed || stats.points < 50 
                ? "border-slate-800 text-slate-700 cursor-not-allowed" 
                : "border-amber-400/40 text-amber-400 hover:bg-amber-400/10"
            )}
          >
            <Lightbulb size={16} />
            HINT (50 PTS)
          </button>
        )}
      </main>

      {/* Keyboard */}
      <footer className="w-full flex justify-center mt-auto">
        <Keyboard 
          onKeyPress={handleKeyPress} 
          usedKeys={usedKeys} 
          disabled={status !== 'playing'}
        />
      </footer>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal 
            onClose={() => setShowSettings(false)}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            category={category}
            setCategory={setCategory}
            isTimerMode={isTimerMode}
            setIsTimerMode={setIsTimerMode}
            isMultiplayer={isMultiplayer}
            toggleMultiplayer={toggleMultiplayer}
          />
        )}
      </AnimatePresence>

      {/* Stats Modal */}
      <AnimatePresence>
        {showStats && (
          <StatsModal 
            onClose={() => setShowStats(false)} 
            stats={stats} 
          />
        )}
      </AnimatePresence>

      {/* Simple help bubble */}
      <div className="fixed bottom-4 right-4 group">
        <div className="absolute bottom-12 right-0 w-48 p-4 glass-card text-[10px] leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mb-2 translate-y-2 group-hover:translate-y-0 duration-300">
           Guess the word letter by letter. Wrong letters lose you a try. Correct letters reveal the word. Win points for victory and build streaks!
        </div>
        <button className="p-3 bg-slate-800/80 rounded-full text-slate-400 hover:text-neon-blue transition-colors border border-slate-700">
          <HelpCircle size={20} />
        </button>
      </div>
    </div>
  );
}
