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

  const saveStats = useCallback((newStats: UserStats) => {
    setStats(newStats);
    localStorage.setItem('lexiguess-stats', JSON.stringify(newStats));
  }, []);

  const getInitialReveals = useCallback((word: string, diff: Difficulty) => {
    const revealsCount = DIFFICULTY_SETTINGS[diff].initialReveals;
    const uniqueLetters = Array.from(new Set(word.split('')));
    const revealed: string[] = [];
    const countToReveal = Math.min(revealsCount, Math.floor(uniqueLetters.length / 2));
    
    for (let i = 0; i < countToReveal; i++) {
        const randomIndex = Math.floor(Math.random() * uniqueLetters.length);
        revealed.push(uniqueLetters.splice(randomIndex, 1)[0]);
    }
    return revealed;
  }, []);

  const startNewGame = useCallback(() => {
    let filtered = category === 'random' ? WORDS : WORDS.filter(w => w.category === category);
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    
    setWordEntry(random);
    setRevealedLetters(getInitialReveals(random.word, difficulty));
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
  }, [category, isTimerMode, difficulty, getInitialReveals]);

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

  useEffect(() => {
    if (status !== 'playing') return;
    
    const uniqueLettersInWord = Array.from(new Set(wordEntry.word.split('')));
    const allRevealed = uniqueLettersInWord.every(l => revealedLetters.includes(l));
    
    if (allRevealed && uniqueLettersInWord.length > 0) {
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
  }, [revealedLetters, wordEntry.word, status, updateStats]);

  const handleKeyPress = useCallback((key: string) => {
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
    }
  }, [status, currentGuess, wordEntry.word, revealedLetters, wrongLetters, difficulty, updateStats]);

  const processGuess = useCallback((guess: string) => {
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
  }, [wordEntry.word, updateStats]);

  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [playerScores, setPlayerScores] = useState<[number, number]>([0, 0]);
  const [currentPlayer, setCurrentPlayer] = useState<0 | 1>(0);

  const toggleMultiplayer = () => {
    setIsMultiplayer(!isMultiplayer);
    setPlayerScores([0, 0]);
    setCurrentPlayer(0);
    startNewGame();
  };

  const updateStats = useCallback((won: boolean) => {
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
  }, [isMultiplayer, playerScores, currentPlayer, stats, wrongLetters.length, revealedLetters.length, difficulty, saveStats]);

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
    const dayWord = WORDS[dayIndex];
    
    setWordEntry(dayWord);
    setRevealedLetters(getInitialReveals(dayWord.word, difficulty));
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
