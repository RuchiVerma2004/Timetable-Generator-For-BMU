import React from 'react';

const StatCard = ({ title, value, icon: IconComponent, color }) => {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-md border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        {IconComponent && <IconComponent className={`text-${color}-500`} size={32} />}
      </div>
    </div>
  );
};

export default StatCard;