import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export function FloatingAddButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Create new task"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 20, delay: 0.2 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-glow transition-colors hover:bg-accent-hover sm:bottom-8 sm:right-8 sm:h-16 sm:w-16"
    >
      <Plus className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.5} />
    </motion.button>
  );
}
