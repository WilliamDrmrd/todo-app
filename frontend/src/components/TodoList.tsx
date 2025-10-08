import { Todo, UpdateTodoRequest } from '../types/todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  filter: 'all' | 'completed' | 'pending';
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, todo: UpdateTodoRequest) => Promise<void>;
}

export const TodoList = ({ todos, loading, filter, onToggle, onDelete, onUpdate }: TodoListProps) => {
  if (loading) {
    return (
      <div className="loading fade-in">
        Loading your todos...
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="card text-center fade-in">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          No todos found for this filter.
        </p>
      </div>
    );
  }

  // When viewing "all", separate completed and pending
  if (filter === 'all') {
    const completedTodos = todos.filter(todo => todo.completed);
    const pendingTodos = todos.filter(todo => !todo.completed);

    return (
      <div>
        {pendingTodos.length > 0 && (
          <div className="mb-8">
            <h2 className="todo-title" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
              Pending ({pendingTodos.length})
            </h2>
            <div>
              {pendingTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                />
              ))}
            </div>
          </div>
        )}

        {completedTodos.length > 0 && (
          <div>
            <h2 className="todo-title" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
              Completed ({completedTodos.length})
            </h2>
            <div>
              {completedTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // For "completed" or "pending" filters, show flat list
  return (
    <div>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};