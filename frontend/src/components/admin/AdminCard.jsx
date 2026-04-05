import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const AdminCard = ({
  children,
  title,
  subtitle,
  icon,
  actions,
  className = '',
  bodyClassName = '',
  noPadding = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div 
      className={`rounded-2xl shadow-sm overflow-hidden ${className}`}
      style={{
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
      }}
    >
      {(title || actions) && (
        <div 
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}
        >
          <div className="flex items-center gap-3">
            {icon && (
              <div 
                className="flex items-center justify-center w-10 h-10 rounded-xl"
                style={{
                  backgroundColor: isDark ? 'rgba(37, 99, 235, 0.2)' : '#dbeafe',
                  color: isDark ? '#60a5fa' : '#2563eb'
                }}
              >
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 
                  className="text-lg font-semibold"
                  style={{ color: isDark ? '#ffffff' : '#111827' }}
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p 
                  className="text-sm"
                  style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={noPadding ? '' : `p-6 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default AdminCard;
