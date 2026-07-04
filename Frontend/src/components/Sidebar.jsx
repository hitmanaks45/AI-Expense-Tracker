import { NavLink } from 'react-router-dom';
import {
HiCamera,HiFlag, HiHome, HiCash, HiChartPie, HiChartBar, HiSparkles, HiUser, HiX
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <HiHome size={18} /> },
  { to: '/expenses', label: 'Expenses', icon: <HiCash size={18} /> },
  { to: '/budget', label: 'Budget', icon: <HiChartBar size={18} /> },
  { to: '/analytics', label: 'Analytics', icon: <HiChartPie size={18} /> },
  { to: '/ai-guru', label: 'AI Finance Guru', icon: <HiSparkles size={18} /> },
  { to: '/profile', label: 'Profile', icon: <HiUser size={18} /> },
  {to: '/goal-planner',label: 'AI Goal Planner',icon: <HiFlag size={18}/>},
  {to: '/receipt-scanner',label: 'Receipt Scanner',icon: <HiCamera size={18}/>},
];

// Sidebar — main navigation panel
const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          flex flex-col z-40 transition-transform duration-200
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo + close button */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
              <HiCash size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-sm">ExpenseTracker</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 lg:hidden rounded-md"
          >
            <HiX size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-2">
            Menu
          </p>
          <ul className="flex flex-col gap-0.5">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User info at bottom */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary-600 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
              {user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
