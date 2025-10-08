import { useState, useEffect } from 'react';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types/todo';
import { todoApi, TodoStats } from '../utils/api';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [stats, setStats] = useState<TodoStats>({ total: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const fetchStats = async () => {
    try {
      const fetchedStats = await todoApi.getTodoStats();
      setStats(fetchedStats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchTodos = async (currentFilter?: 'all' | 'completed' | 'pending') => {
    try {
      setLoading(true);
      setError(null);
      const filterToUse = currentFilter !== undefined ? currentFilter : filter;
      const fetchedTodos = await todoApi.getAllTodos(filterToUse);
      setTodos(fetchedTodos);
      await fetchStats();
    } catch (err) {
      setError('Failed to fetch todos');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (todoData: CreateTodoRequest) => {
    try {
      setError(null);
      const newTodo = await todoApi.createTodo(todoData);
      await fetchTodos();
      return newTodo;
    } catch (err) {
      setError('Failed to create todo');
      console.error('Error creating todo:', err);
      throw err;
    }
  };

  const updateTodo = async (id: number, todoData: UpdateTodoRequest) => {
    try {
      setError(null);
      const updatedTodo = await todoApi.updateTodo(id, todoData);
      await fetchTodos();
      return updatedTodo;
    } catch (err) {
      setError('Failed to update todo');
      console.error('Error updating todo:', err);
      throw err;
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      setError(null);
      await todoApi.deleteTodo(id);
      await fetchTodos();
    } catch (err) {
      setError('Failed to delete todo');
      console.error('Error deleting todo:', err);
      throw err;
    }
  };

  const toggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    await updateTodo(id, { completed: !todo.completed });
  };

  useEffect(() => {
    fetchTodos();
  }, [filter]);

  const changeFilter = (newFilter: 'all' | 'completed' | 'pending') => {
    setFilter(newFilter);
  };

  return {
    todos,
    stats,
    loading,
    error,
    filter,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    changeFilter,
    refetch: fetchTodos,
  };
};