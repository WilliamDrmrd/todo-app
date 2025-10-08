import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Todo, UpdateTodoRequest, Priority } from '../types/todo';

interface TodoModalProps {
  todo: Todo;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: number, update: UpdateTodoRequest) => Promise<void>;
  initialEditing?: boolean;
}

export const TodoModal = ({ todo, isOpen, onClose, onUpdate, initialEditing = false }: TodoModalProps) => {
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsEditing(initialEditing);
    }
  }, [isOpen, initialEditing]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEditing) {
          handleCancel();
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, isEditing, onClose]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!editTitle.trim()) return;

    setIsUpdating(true);
    try {
      await onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        priority: editPriority,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update todo:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority);
    setIsEditing(false);
  };

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case Priority.LOW:
        return 'Low';
      case Priority.MEDIUM:
        return 'Medium';
      case Priority.HIGH:
        return 'High';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Todo Details</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {isEditing ? (
            <div className="edit-form">
              <div className="input-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="input"
                  maxLength={255}
                />
              </div>

              <div className="input-group">
                <label>Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="textarea"
                  rows={4}
                  maxLength={1000}
                  placeholder="Add a description..."
                />
              </div>

              <div className="input-group">
                <label>Priority</label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as Priority)}
                  className="select priority-select"
                  disabled={isUpdating}
                >
                  <option value={Priority.LOW}>Low</option>
                  <option value={Priority.MEDIUM}>Medium</option>
                  <option value={Priority.HIGH}>High</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  onClick={handleSave}
                  disabled={!editTitle.trim() || isUpdating}
                  className="btn btn-primary"
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  className="btn btn-secondary"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="todo-details">
              <div className="detail-group">
                <label>Title</label>
                <p className={`todo-title ${todo.completed ? 'completed' : ''}`}>
                  {todo.title}
                </p>
              </div>

              {todo.description && (
                <div className="detail-group">
                  <label>Description</label>
                  <p className="todo-description">{todo.description}</p>
                </div>
              )}

              <div className="detail-group">
                <label>Priority</label>
                <p className={`priority-badge priority-${todo.priority.toLowerCase()}`}>
                  <span className="priority-text">{getPriorityLabel(todo.priority)}</span>
                </p>
              </div>

              <div className="detail-group">
                <label>Status</label>
                <p className={`todo-status ${todo.completed ? 'completed' : 'pending'}`}>
                  {todo.completed ? 'Completed' : 'Pending'}
                </p>
              </div>

              <div className="detail-group">
                <label>Created</label>
                <p className="todo-date">{formatDate(todo.createdAt)}</p>
              </div>

              {todo.updatedAt !== todo.createdAt && (
                <div className="detail-group">
                  <label>Last Updated</label>
                  <p className="todo-date">{formatDate(todo.updatedAt)}</p>
                </div>
              )}

              <div className="modal-actions">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-secondary"
                >
                  Edit
                </button>
                <button onClick={onClose} className="btn btn-primary">
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
