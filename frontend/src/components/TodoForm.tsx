import { useState } from 'react';
import { CreateTodoRequest, Priority } from '../types/todo';

interface TodoFormProps {
  onSubmit: (todo: CreateTodoRequest) => Promise<void>;
}

export const TodoForm = ({ onSubmit }: TodoFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority
      });
      setTitle('');
      setDescription('');
      setPriority(Priority.MEDIUM);
    } catch (error) {
      console.error('Failed to create todo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="form-fields">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new todo..."
          className="input title-input"
          disabled={isSubmitting}
          maxLength={255}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description (optional)..."
          className="textarea description-input"
          disabled={isSubmitting}
          maxLength={1000}
          rows={2}
        />
        <div className="priority-selector">
          <label htmlFor="priority-select" className="priority-label">Priority:</label>
          <select
            id="priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="select priority-select"
            disabled={isSubmitting}
          >
            <option value={Priority.LOW}>Low</option>
            <option value={Priority.MEDIUM}>Medium</option>
            <option value={Priority.HIGH}>High</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        disabled={!title.trim() || isSubmitting}
        className="btn btn-primary form-submit-btn"
      >
        {isSubmitting ? 'Adding...' : 'Add Todo'}
      </button>
    </form>
  );
};
