import { motion, AnimatePresence } from 'framer-motion';
import Logo from './ui-components/Logo';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-[#00A693] via-[#00A693] to-[#94C5FF]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        onAnimationComplete={() => {
          setTimeout(onFinish, 2000);
        }}
      >
        {/* Animated circles background */}
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full bg-white/10"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 1.2] }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-white/5"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 1.2] }}
          transition={{ duration: 1.8, ease: 'easeOut', delay: 0.2 }}
        />

        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
          className="relative z-10"
        >
          <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center">
            <Logo size="lg" />
          </div>
        </motion.div>

        {/* App name */}
        <motion.h1
          className="text-white text-4xl font-bold mt-6 tracking-tight relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Wasslink
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-white/80 text-sm mt-2 relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          Your ride, your way
        </motion.p>

        {/* Loading indicator */}
        <motion.div
          className="absolute bottom-16 flex gap-1.5 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
