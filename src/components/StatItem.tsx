import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface StatItemProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  color?: 'blue' | 'purple' | 'pink' | 'green';
}

export function StatItem({ label, value, icon: Icon, color = 'blue' }: StatItemProps) {
  const colors = {
    blue: 'text-neon-blue',
    purple: 'text-neon-purple',
    pink: 'text-neon-pink',
    green: 'text-neon-green'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 glass-card min-w-[100px] flex-1">
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon size={16} className={colors[color]} />}
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">{label}</span>
      </div>
      <span className={cn("text-2xl font-bold font-display", colors[color])}>{value}</span>
    </div>
  );
}
