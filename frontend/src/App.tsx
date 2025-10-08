import { useState } from 'react';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { ThemeToggle } from './components/ThemeToggle';
import { useTodos } from './hooks/useTodos';

function App() {
  const { todos, stats, loading, error, filter, createTodo, updateTodo, deleteTodo, toggleTodo, changeFilter } = useTodos();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        linear-gradient(
          135deg,
          var(--gradient-start) 0%,
          var(--gradient-mid) 20%,
          var(--gradient-mid) 60%,
          var(--gradient-start) 80%,
          var(--gradient-end) 100%
        )
      `
    }}>
      <ThemeToggle />
      <div className="container">
      <div className="header-container mb-8">
        <h1>Todo App</h1>
        <div className="filter-buttons">
          <button
            onClick={() => changeFilter('all')}
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            All
          </button>
          <button
            onClick={() => changeFilter('pending')}
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          >
            Pending
          </button>
          <button
            onClick={() => changeFilter('completed')}
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          >
            Completed
          </button>
        </div>
      </div>

      {error && (
        <div className="error mb-4">
          {error}
        </div>
      )}

      <div className="card mb-8">
        <TodoForm onSubmit={createTodo} />
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="🔍 Search todos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input"
        />
      </div>

      <TodoList
        todos={filteredTodos}
        loading={loading}
        filter={filter}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onUpdate={updateTodo}
      />

      {stats.total > 0 && (
        <div className="stats">
          {stats.pending} of {stats.total} tasks remaining
        </div>
      )}
      </div>
    </div>
  );
}

export default App;
