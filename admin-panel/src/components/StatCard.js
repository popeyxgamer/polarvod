import React from 'react';

const StatCard = ({ title, count, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg shadow-md p-6 text-white`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-4xl font-bold">{count}</p>
    </div>
  );
};

export default StatCard;
