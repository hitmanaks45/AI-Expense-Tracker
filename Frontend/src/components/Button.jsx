// Reusable Button component

const Button = ({ children, variant = 'primary', size = 'md', onClick, type = 'button', className = '', disabled = false, icon }) => {
  const base = 'inline-flex items-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-600',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-400 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-300 dark:text-gray-300 dark:hover:bg-gray-700',
    success: 'bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-600',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
