import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

const StatusDisplay = ({ status }) => {
  if (!status.message) return null;

  const getStatusStyles = (type) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 text-red-700';
      case 'success':
        return 'bg-green-50 text-green-700';
      case 'info':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-blue-50 text-blue-700';
    }
  };

  const getStatusIcon = (type) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${getStatusStyles(status.type)}`}>
      {getStatusIcon(status.type)}
      <span>{status.message}</span>
    </div>
  );
};

export default StatusDisplay;
