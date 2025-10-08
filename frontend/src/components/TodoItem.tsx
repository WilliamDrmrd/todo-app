import { useState } from 'react';
import { Todo, UpdateTodoRequest, Priority } from '../types/todo';
import { TodoModal } from './TodoModal';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, todo: UpdateTodoRequest) => Promise<void>;
}

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

export const TodoItem = ({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openModalInEditMode, setOpenModalInEditMode] = useState(false);

  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      await onToggle(todo.id);
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;

    setIsDeleting(true);
    try {
      await onDelete(todo.id);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setOpenModalInEditMode(true);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editTitle.trim() || editTitle === todo.title) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdate(todo.id, { title: editTitle.trim() });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update todo:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleItemClick = (e: React.MouseEvent) => {
    // Don't open modal if clicking on interactive elements
    if (isEditing) return;
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'BUTTON' ||
      target.tagName === 'INPUT' ||
      target.closest('button') ||
      target.closest('input')
    ) {
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div
      className={`todo-item fade-in ${todo.completed ? 'completed' : ''} priority-${todo.priority.toLowerCase()}`}
      onClick={handleItemClick}
      style={{ cursor: isEditing ? 'default' : 'pointer' }}
    >
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          disabled={isUpdating || isDeleting}
          className="checkbox"
        />

        <div className="todo-text">
          {isEditing ? (
            <div className="edit-form">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="input"
                maxLength={255}
                autoFocus
              />
              <div className="edit-buttons">
                <button
                  onClick={handleSave}
                  disabled={!editTitle.trim() || isUpdating}
                  className="btn btn-primary btn-small"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="btn btn-secondary btn-small"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="todo-header">
                <p className="todo-title">
                  {todo.title}
                </p>
                <span className={`priority-badge priority-${todo.priority.toLowerCase()}`}>
                  <span className="priority-text">{getPriorityLabel(todo.priority)}</span>
                </span>
              </div>
              {todo.description && (
                <p className="todo-description-preview">
                  {todo.description.length > 100
                    ? `${todo.description.substring(0, 100)}...`
                    : todo.description}
                </p>
              )}
              <p className="todo-date">
                Created {formatDate(todo.createdAt)}
                {todo.updatedAt !== todo.createdAt && (
                  <span> • Updated {formatDate(todo.updatedAt)}</span>
                )}
              </p>
            </>
          )}
        </div>

        {!isEditing && (
          <div className="todo-actions">
            <button
              onClick={handleEdit}
              disabled={isUpdating || isDeleting}
              className="btn btn-secondary btn-small"
              title="Edit todo"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isUpdating || isDeleting}
              className="btn btn-danger btn-small"
              title="Delete todo"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      <TodoModal
        todo={todo}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setOpenModalInEditMode(false);
        }}
        onUpdate={onUpdate}
        initialEditing={openModalInEditMode}
      />
    </div>
  );
};
