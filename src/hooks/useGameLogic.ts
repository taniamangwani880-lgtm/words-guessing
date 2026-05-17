import { useState, useEffect, useCallback } from 'react';
import { WORDS, DIFFICULTY_SETTINGS, WordEntry, Category, Difficulty } from '@/src/lib/gameData';
import { INITIAL_STATS, UserStats } from '@/src/types';
import confetti from 'canvas-confetti';

import { sounds } from '@/src/lib/sounds';

export function useGameLogic() {
  const [wordEntry, setWordEntry] = useState<WordEntry>(WORDS[0]);
  const [revealedLetters, setRevealedLetters] = useState<string[]>([]);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [category, setCategory] = useState<Category | 'random'>('random');
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isTimerMode, setIsTimerMode] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  // Load stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lexiguess-stats');
    if (saved) setStats(JSON.parse(saved));
  }, []);

  const saveStats = (newStats: UserStats) => {
    setStats(newStats);
    localStorage.setItem('lexiguess-stats', JSON.stringify(newStats));
  };

  const startNewGame = useCallback(() => {
    let filtered = category === 'random' ? WORDS : WORDS.filter(w => w.category === category);
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    
    setWordEntry(random);
    setRevealedLetters([]);
    setWrongLetters([]);
    setGuesses([]);
    setCurrentGuess("");
    setStatus('playing');
    setHintUsed(false);
    
    if (isTimerMode) {
      setTimeRemaining(90); // 90 seconds base
    } else {
      setTimeRemaining(null);
    }
  }, [category, isTimerMode]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Timer logic
  useEffect(() => {
    if (status !== 'playing' || !isTimerMode || timeRemaining === null) return;
    
    const id = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev !== null && prev < 7 && prev > 0) sounds.playTick();
        if (prev === null || prev <= 0) {
          setStatus('lost');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(id);
  }, [status, isTimerMode, timeRemaining]);

  const handleKeyPress = (key: string) => {
    if (status !== 'playing') return;

    if (key === 'DELETE') {
      setCurrentGuess(prev => prev.slice(0, -1));
      return;
    }

    if (key === 'ENTER') {
      if (currentGuess.length === wordEntry.word.length) {
        processGuess(currentGuess);
      }
      return;
    }

    if (currentGuess.length < wordEntry.word.length && /^[A-Z]$/.test(key)) {
      // Check if letter is in word for feedback
      if (wordEntry.word.includes(key)) {
        if (!revealedLetters.includes(key)) {
          setRevealedLetters(prev => [...prev, key]);
          sounds.playCorrect();
        }
      } else {
        if (!wrongLetters.includes(key)) {
          setWrongLetters(prev => [...prev, key]);
          sounds.playIncorrect();
          if (wrongLetters.length + 1 >= DIFFICULTY_SETTINGS[difficulty].attempts) {
            setStatus('lost');
            sounds.playLoss();
            updateStats(false);
          }
        }
      }
      
      // Also track as a guess element if we want full Wordle style
      // For now we use the Hangman hybrid approach mainly
    }
  };

  const processGuess = (guess: string) => {
    setGuesses(prev => [...prev, guess]);
    setCurrentGuess("");
    
    if (guess === wordEntry.word) {
      setStatus('won');
      sounds.playWin();
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f3ff', '#bc13fe', '#39ff14']
      });
      updateStats(true);
    }
  };

  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [playerScores, setPlayerScores] = useState<[number, number]>([0, 0]);
  const [currentPlayer, setCurrentPlayer] = useState<0 | 1>(0);

  const toggleMultiplayer = () => {
    setIsMultiplayer(!isMultiplayer);
    setPlayerScores([0, 0]);
    setCurrentPlayer(0);
    startNewGame();
  };

  const updateStats = (won: boolean) => {
    if (isMultiplayer) {
      if (won) {
        const newScores: [number, number] = [...playerScores];
        newScores[currentPlayer] += 1;
        setPlayerScores(newScores);
      }
      setCurrentPlayer(prev => prev === 0 ? 1 : 0);
      return;
    }
    
    const newStats = { ...stats };
    newStats.gamesPlayed += 1;
    newStats.totalGuesses += wrongLetters.length + revealedLetters.length;
    
    if (won) {
      newStats.wins += 1;
      newStats.streak += 1;
      newStats.maxStreak = Math.max(newStats.maxStreak, newStats.streak);
      newStats.points += DIFFICULTY_SETTINGS[difficulty].points;
    } else {
      newStats.streak = 0;
    }
    
    saveStats(newStats);
  };

  const useHint = () => {
    if (hintUsed || stats.points < 50 || status !== 'playing') return;
    
    const unrevealed = wordEntry.word.split('').filter(l => !revealedLetters.includes(l));
    if (unrevealed.length > 0) {
      const randomHint = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      setRevealedLetters(prev => [...prev, randomHint]);
      setHintUsed(true);
      saveStats({ ...stats, points: stats.points - 50 });
    }
  };

  const playDailyChallenge = () => {
    const today = new Date().toISOString().slice(0, 10);
    const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0);
    const dayIndex = seed % WORDS.length;
    
    setWordEntry(WORDS[dayIndex]);
    setRevealedLetters([]);
    setWrongLetters([]);
    setGuesses([]);
    setCurrentGuess("");
    setStatus('playing');
    setHintUsed(false);
    setTimeRemaining(null);
    setIsTimerMode(false);
  };

  return {
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
  };
}
