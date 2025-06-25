'use client';
import { useTheme } from './ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggleButton = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-accent/20 dark:hover:bg-edge/20 transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? <Sun className="w-5 h-5 text-edge" /> : <Moon className="w-5 h-5 text-accent" />}
    </button>
  );
};

export default ThemeToggleButton;