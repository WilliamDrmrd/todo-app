import axios from 'axios';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types/todo';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
}

export const todoApi = {
  getAllTodos: (filter?: 'all' | 'completed' | 'pending'): Promise<Todo[]> => {
    const params = filter ? { filter } : {};
    return api.get('/todos', { params }).then(response => response.data);
  },

  getTodoStats: async (): Promise<TodoStats> => {
    const allTodos = await api.get('/todos').then(response => response.data);
    return {
      total: allTodos.length,
      completed: allTodos.filter((todo: Todo) => todo.completed).length,
      pending: allTodos.filter((todo: Todo) => !todo.completed).length,
    };
  },

  getTodoById: (id: number): Promise<Todo> =>
    api.get(`/todos/${id}`).then(response => response.data),

  createTodo: (todo: CreateTodoRequest): Promise<Todo> =>
    api.post('/todos', todo).then(response => response.data),

  updateTodo: (id: number, todo: UpdateTodoRequest): Promise<Todo> =>
    api.put(`/todos/${id}`, todo).then(response => response.data),

  deleteTodo: (id: number): Promise<Todo> =>
    api.delete(`/todos/${id}`).then(response => response.data),
};