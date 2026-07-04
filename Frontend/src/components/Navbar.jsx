import { HiMenu, HiSun, HiMoon, HiBell } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Navbar — top bar with toggle, user info
const Navbar = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sticky top-0 z-30">
      {/* Left: menu button + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 rounded-md lg:hidden"
        >
          <HiMenu size={20} />
        </button>
        <span className="text-base font-semibold text-gray-900 dark:text-white lg:hidden">
          ExpenseTracker
        </span>
      </div>

      {/* Right: theme toggle + user avatar */}
      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={toggleTheme}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 rounded-md"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <HiSun size={18} /> : <HiMoon size={18} />}
        </button>

        <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 rounded-md relative">
          <HiBell size={18} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2 ml-1 pl-2 border-l border-gray-200 dark:border-gray-600">
          <div className="w-7 h-7 rounded-full bg-primary-600 text-white text-xs font-semibold flex items-center justify-center">
            {user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
            {user?.name?.split(' ')[0]}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
