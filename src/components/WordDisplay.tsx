import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface WordDisplayProps {
  word: string;
  revealedLetters: string[];
  status: 'playing' | 'won' | 'lost';
}

export function WordDisplay({ word, revealedLetters, status }: WordDisplayProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3 my-8">
      {word.split('').map((letter, i) => {
        const isRevealed = revealedLetters.includes(letter);
        const color = status === 'won' ? 'text-neon-green' : status === 'lost' && !isRevealed ? 'text-neon-pink' : 'text-neon-blue';
        
        return (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "w-10 h-14 md:w-12 md:h-16 flex items-center justify-center glass-card border-2 font-display text-2xl md:text-3xl font-bold uppercase",
              isRevealed || status !== 'playing' ? "border-opacity-100" : "border-slate-800",
              status === 'won' && "border-neon-green/50",
              status === 'lost' && !isRevealed && "border-neon-pink/50",
              status === 'playing' && isRevealed && "border-neon-blue/50"
            )}
          >
            <AnimatePresence mode="wait">
              {(isRevealed || status !== 'playing') && (
                <motion.span
                  key={letter}
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  className={color}
                >
                  {letter}
                </motion.span>
              )}
            </AnimatePresence>
            {!isRevealed && status === 'playing' && (
              <div className="w-1/2 h-1 bg-slate-800 rounded-full mt-8" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
