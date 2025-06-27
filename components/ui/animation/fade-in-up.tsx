import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface FadeInUpProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeInUp({
  children,
  className = '',
  delay = 0.5,
}: FadeInUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
