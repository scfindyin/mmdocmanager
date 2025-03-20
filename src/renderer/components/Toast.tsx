import React, { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'error' | 'success' | 'info';
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'error', 
  duration = 5000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-100 border-red-500 text-red-900';
      case 'success':
        return 'bg-green-100 border-green-500 text-green-900';
      case 'info':
        return 'bg-blue-100 border-blue-500 text-blue-900';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-900';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle className="text-red-500" size={18} />;
      case 'success':
        return <AlertCircle className="text-green-500" size={18} />;
      case 'info':
        return <AlertCircle className="text-blue-500" size={18} />;
      default:
        return <AlertCircle className="text-gray-500" size={18} />;
    }
  };

  return (
    <div 
      className={`fixed bottom-4 right-4 p-3 rounded-md border shadow-md flex items-center gap-2 
                 transition-opacity duration-300 ${getTypeStyles()} 
                 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {getIcon()}
      <p className="text-sm">{message}</p>
      <button 
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-2 text-gray-500 hover:text-gray-700"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast; 