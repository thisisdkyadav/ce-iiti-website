import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const AdminButton = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  fullWidth = false,
  ...props
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: '#2563eb', color: '#ffffff' };
      case 'secondary':
        return { 
          backgroundColor: isDark ? '#4b5563' : '#e5e7eb', 
          color: isDark ? '#e5e7eb' : '#374151' 
        };
      case 'success':
        return { backgroundColor: '#16a34a', color: '#ffffff' };
      case 'danger':
        return { backgroundColor: '#dc2626', color: '#ffffff' };
      case 'warning':
        return { backgroundColor: '#f59e0b', color: '#ffffff' };
      case 'ghost':
        return { 
          backgroundColor: 'transparent', 
          color: isDark ? '#d1d5db' : '#374151' 
        };
      case 'outline':
        return { 
          backgroundColor: 'transparent', 
          border: `2px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
          color: isDark ? '#d1d5db' : '#374151' 
        };
      default:
        return { backgroundColor: '#2563eb', color: '#ffffff' };
    }
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    xl: 'px-6 py-3 text-lg',
  };

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';

  const LoadingSpinner = () => (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={getVariantStyles()}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {loading ? <span className="ml-2">Loading...</span> : children}
      {!loading && icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </button>
  );
};

export default AdminButton;
