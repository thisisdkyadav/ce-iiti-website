import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const AdminInput = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helpText,
  required = false,
  disabled = false,
  readOnly = false,
  className = '',
  inputClassName = '',
  icon,
  id,
  name,
  ...props
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

  const inputStyles = {
    backgroundColor: readOnly 
      ? (isDark ? 'rgba(31, 41, 55, 0.5)' : '#f9fafb')
      : (isDark ? 'rgba(55, 65, 81, 0.5)' : '#ffffff'),
    color: isDark ? '#ffffff' : '#111827',
    border: `1px solid ${error ? '#ef4444' : (isDark ? '#4b5563' : '#d1d5db')}`,
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium"
          style={{ color: isDark ? '#d1d5db' : '#374151' }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div 
            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            style={{ color: '#9ca3af' }}
          >
            {icon}
          </div>
        )}
        <input
          id={inputId}
          name={name || inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={`w-full px-4 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${icon ? 'pl-10' : ''} ${inputClassName}`}
          style={inputStyles}
          {...props}
        />
      </div>
      {error && (
        <p 
          className="text-sm"
          style={{ color: isDark ? '#f87171' : '#ef4444' }}
        >
          {error}
        </p>
      )}
      {helpText && !error && (
        <p 
          className="text-sm"
          style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
        >
          {helpText}
        </p>
      )}
    </div>
  );
};

export default AdminInput;
