import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const AdminTextarea = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  helpText,
  required = false,
  disabled = false,
  readOnly = false,
  rows = 4,
  className = '',
  textareaClassName = '',
  id,
  name,
  ...props
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

  const textareaStyles = {
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
      <textarea
        id={inputId}
        name={name || inputId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        rows={rows}
        className={`w-full px-4 py-2.5 rounded-lg transition-all duration-200 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${textareaClassName}`}
        style={textareaStyles}
        {...props}
      />
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

export default AdminTextarea;
