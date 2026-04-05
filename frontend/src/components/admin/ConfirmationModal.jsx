import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import AdminModal from './AdminModal';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // danger, warning, info
  isLoading = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getIconStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          backgroundColor: isDark ? 'rgba(127, 29, 29, 0.3)' : '#fee2e2',
          color: isDark ? '#f87171' : '#dc2626'
        };
      case 'warning':
        return {
          backgroundColor: isDark ? 'rgba(120, 53, 15, 0.3)' : '#fef3c7',
          color: isDark ? '#fbbf24' : '#d97706'
        };
      case 'info':
        return {
          backgroundColor: isDark ? 'rgba(30, 58, 138, 0.3)' : '#dbeafe',
          color: isDark ? '#60a5fa' : '#2563eb'
        };
      default:
        return {
          backgroundColor: isDark ? 'rgba(127, 29, 29, 0.3)' : '#fee2e2',
          color: isDark ? '#f87171' : '#dc2626'
        };
    }
  };

  const getButtonStyles = () => {
    switch (variant) {
      case 'danger':
        return { backgroundColor: '#dc2626', color: '#ffffff' };
      case 'warning':
        return { backgroundColor: '#d97706', color: '#ffffff' };
      case 'info':
        return { backgroundColor: '#2563eb', color: '#ffffff' };
      default:
        return { backgroundColor: '#dc2626', color: '#ffffff' };
    }
  };

  const icons = {
    danger: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    warning: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            style={{
              backgroundColor: isDark ? '#4b5563' : '#e5e7eb',
              color: isDark ? '#e5e7eb' : '#374151'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            style={getButtonStyles()}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      }
    >
      <div className="text-center py-4">
        <div 
          className="mx-auto flex items-center justify-center w-12 h-12 rounded-full mb-4"
          style={getIconStyles()}
        >
          {icons[variant]}
        </div>
        <p style={{ color: isDark ? '#d1d5db' : '#374151' }}>{message}</p>
      </div>
    </AdminModal>
  );
};

export default ConfirmationModal;
