import React, { useState } from 'react';
import AdminModal from './AdminModal';

const AdminTable = ({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  renderViewContent,
  renderEditContent,
  viewTitle = 'View Details',
  editTitle = 'Edit Item',
  deleteTitle = 'Confirm Delete',
  emptyMessage = 'No items found',
  isWorking = false,
  getRowId = (row) => row.id,
  showActions = true,
}) => {
  const [viewModal, setViewModal] = useState({ isOpen: false, item: null });
  const [editModal, setEditModal] = useState({ isOpen: false, item: null, draft: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });

  const handleViewClick = (item) => {
    setViewModal({ isOpen: true, item });
    if (onView) onView(item);
  };

  const closeViewModal = () => {
    setViewModal({ isOpen: false, item: null });
  };

  const handleEditClick = (item) => {
    setEditModal({ isOpen: true, item, draft: { ...item } });
  };

  const handleDeleteClick = (item) => {
    setDeleteModal({ isOpen: true, item });
  };

  const handleDeleteFromView = () => {
    if (!viewModal.item) {
      return;
    }

    setDeleteModal({ isOpen: true, item: viewModal.item });
    closeViewModal();
  };

  const handleEditSave = async () => {
    if (onEdit && editModal.draft) {
      await onEdit(editModal.draft);
      setEditModal({ isOpen: false, item: null, draft: null });
    }
  };

  const handleDeleteConfirm = async () => {
    if (onDelete && deleteModal.item) {
      await onDelete(deleteModal.item);
      setDeleteModal({ isOpen: false, item: null });
    }
  };

  const updateDraft = (field, value) => {
    setEditModal((prev) => ({
      ...prev,
      draft: { ...prev.draft, [field]: value },
    }));
  };

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider ${col.className || ''}`}
                >
                  {col.label}
                </th>
              ))}
              {showActions && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={getRowId(row) || index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  onClick={() => handleViewClick(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-sm text-gray-700 dark:text-gray-300 ${col.cellClassName || ''}`}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {showActions && (
                    <td className="px-4 py-3 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleViewClick(row)}
                        className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-lg text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        title="View"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                      {onEdit && (
                        <button
                          onClick={() => handleEditClick(row)}
                          className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-lg text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => handleDeleteClick(row)}
                          className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-lg text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      <AdminModal
        isOpen={viewModal.isOpen}
        onClose={closeViewModal}
        title={viewTitle}
        size="lg"
        footer={
          <div className={`flex items-center ${onDelete ? 'justify-between' : 'justify-end'} gap-3`}>
            <div>
              {onDelete && (
                <button
                  onClick={handleDeleteFromView}
                  disabled={isWorking}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              {onEdit && (
                <button
                  onClick={() => {
                    closeViewModal();
                    handleEditClick(viewModal.item);
                  }}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors"
                >
                  Edit
                </button>
              )}
              <button
                onClick={closeViewModal}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        }
      >
        {viewModal.item && renderViewContent && renderViewContent(viewModal.item)}
      </AdminModal>

      {/* Edit Modal */}
      <AdminModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, item: null, draft: null })}
        title={editTitle}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setEditModal({ isOpen: false, item: null, draft: null })}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 transition-colors"
              disabled={isWorking}
            >
              Cancel
            </button>
            <button
              onClick={handleEditSave}
              disabled={isWorking}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isWorking ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        }
      >
        {editModal.draft && renderEditContent && renderEditContent(editModal.draft, updateDraft)}
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        title={deleteTitle}
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModal({ isOpen: false, item: null })}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 transition-colors"
              disabled={isWorking}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={isWorking}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isWorking ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        }
      >
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete this item? This action cannot be undone.
          </p>
        </div>
      </AdminModal>
    </>
  );
};

export default AdminTable;
