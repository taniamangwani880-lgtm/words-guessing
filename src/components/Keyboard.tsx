import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  usedKeys: Record<string, 'correct' | 'present' | 'absent' | 'default'>;
  disabled?: boolean;
}

const KEYS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE']
];

export function Keyboard({ onKeyPress, usedKeys, disabled }: KeyboardProps) {
  return (
    <div className={cn("flex flex-col gap-2 w-full max-w-2xl px-2", disabled && "opacity-50 pointer-events-none")}>
      {KEYS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5 md:gap-2">
          {row.map((key) => {
            const status = usedKeys[key] || 'default';
            const isSmall = key.length === 1;
            
            return (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onKeyPress(key)}
                className={cn(
                  "h-12 md:h-14 rounded-lg font-bold flex items-center justify-center transition-all duration-200 border",
                  isSmall ? "w-8 md:w-12 text-sm md:text-base" : "px-3 md:px-5 text-[10px] md:text-xs",
                  status === 'default' && "bg-slate-800/50 border-slate-700 text-slate-200 hover:border-slate-500",
                  status === 'correct' && "bg-neon-green/20 border-neon-green text-neon-green neon-border-green",
                  status === 'present' && "bg-amber-400/20 border-amber-400 text-amber-400",
                  status === 'absent' && "bg-slate-900 border-slate-800 text-slate-600"
                )}
              >
                {key === 'DELETE' ? '⌫' : key}
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
