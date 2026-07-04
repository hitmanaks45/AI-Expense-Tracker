// ChartCard — wrapper for chart sections

const ChartCard = ({ title, children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">{title}</h3>
      {children}
    </div>
  );
};

export default ChartCard;
