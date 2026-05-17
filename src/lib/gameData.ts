export type Category = 'animals' | 'countries' | 'movies' | 'science' | 'sports';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface WordEntry {
  word: string;
  category: Category;
  hint: string;
}

export const WORDS: WordEntry[] = [
  // Animals
  { word: 'GIRAFFE', category: 'animals', hint: 'Long necked African mammal' },
  { word: 'DOLPHIN', category: 'animals', hint: 'Highly intelligent marine mammal' },
  { word: 'PENGUIN', category: 'animals', hint: 'Flightless bird of the Antarctic' },
  { word: 'KANGAROO', category: 'animals', hint: 'Marsupial from Australia' },
  { word: 'PLATYPUS', category: 'animals', hint: 'Egg-laying mammal with a bill' },
  
  // Countries
  { word: 'BRAZIL', category: 'countries', hint: 'Largest country in South America' },
  { word: 'ICELAND', category: 'countries', hint: 'Nordic island nation with volcanoes' },
  { word: 'VIETNAM', category: 'countries', hint: 'South Asian country known for its beaches' },
  { word: 'MOROCCO', category: 'countries', hint: 'North African country bordering the Atlantic' },
  { word: 'FINLAND', category: 'countries', hint: 'Happiest country in the world' },
  
  // Movies
  { word: 'INCEPTION', category: 'movies', hint: 'Dreams within dreams' },
  { word: 'AVATAR', category: 'movies', hint: 'Blue people on Pandora' },
  { word: 'GLADIATOR', category: 'movies', hint: 'Roman general turned fighter' },
  { word: 'PARASITE', category: 'movies', hint: 'South Korean thriller about class' },
  { word: 'MATRIX', category: 'movies', hint: 'Simulated reality and red pills' },
  
  // Science
  { word: 'QUANTUM', category: 'science', hint: 'Physics of the very small' },
  { word: 'GENOME', category: 'science', hint: 'Complete set of genetic material' },
  { word: 'NEBULA', category: 'science', hint: 'Interstellar cloud of gas' },
  { word: 'ISOTOPE', category: 'science', hint: 'Variant of a chemical element' },
  { word: 'PHOTON', category: 'science', hint: 'Particle of light' },
  
  // Sports
  { word: 'ARCHERY', category: 'sports', hint: 'Using a bow and arrow' },
  { word: 'CRICKET', category: 'sports', hint: 'Popular bat and ball game in India' },
  { word: 'FENCING', category: 'sports', hint: 'Combat with swords' },
  { word: 'CURLING', category: 'sports', hint: 'Stone sliding on ice' },
  { word: 'SQUASH', category: 'sports', hint: 'Racket sport in a closed box' }
];

export const DIFFICULTY_SETTINGS = {
  easy: { attempts: 8, timeBonus: 30, points: 100 },
  medium: { attempts: 6, timeBonus: 20, points: 200 },
  hard: { attempts: 4, timeBonus: 10, points: 400 }
};
