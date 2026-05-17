export interface UserStats {
  gamesPlayed: number;
  wins: number;
  streak: number;
  maxStreak: number;
  totalGuesses: number;
  points: number;
  lastPlayed?: string;
}

export const INITIAL_STATS: UserStats = {
  gamesPlayed: 0,
  wins: 0,
  streak: 0,
  maxStreak: 0,
  totalGuesses: 0,
  points: 0
};
