import React, { useState } from 'react';
import { FiPlus, FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext'; // Import useTheme

export default function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Complete React project', completed: false, date: 'Today' },
    { id: 2, text: 'Study for Algorithms exam', completed: false, date: 'Tomorrow' },
  ]);
  const [newTodoText, setNewTodoText] = useState('');
  const { theme } = useTheme(); // Use the theme context

  const addTodo = (e) => {
    e.preventDefault();
    if (newTodoText.trim() === '') return;

    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: newTodoText.trim(),
        completed: false,
        date: 'Today', // Defaulting to 'Today' for new todos
      },
    ]);
    setNewTodoText('');
  };

  const toggleTodoComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="bg-white dark:bg-blue-900/50 dark:backdrop-blur-md dark:backdrop-filter rounded-2xl shadow-lg dark:shadow-xl-dark p-4 sm:p-6 hover:shadow-xl dark:hover:shadow-2xl-dark transition">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Your Planner
      </h2>
      <p className="text-gray-600 dark:text-gray-200 text-base mb-4">
        Organize your tasks and stay on top of your studies!
      </p>

      {/* Add To-Do Input */}
      <form onSubmit={addTodo} className="flex items-center mb-5 bg-gray-100 dark:bg-blue-800/70 dark:border-blue-700 rounded-lg p-3 shadow-sm border border-gray-200">
        <FiPlus className="text-blue-500 dark:text-blue-300 mr-3 text-xl" />
        <input
          type="text"
          placeholder="Add a to-do"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-blue-300 text-lg"
        />
        <button type="submit" className="sr-only">Add</button>
      </form>

      {/* To-Do List */}
      <div className="space-y-3">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-blue-800/50 dark:backdrop-blur-sm dark:backdrop-filter rounded-lg shadow-sm border border-gray-200 dark:border-blue-700 transition-colors"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodoComplete(todo.id)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:bg-blue-700 dark:border-blue-600 dark:focus:ring-blue-400 dark:checked:bg-blue-500"
              />
              <span
                className={`ml-3 text-lg font-medium text-gray-800 dark:text-white ${
                  todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
                }`}
              >
                {todo.text}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-300">
                {todo.date}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition"
                title="Delete To-Do"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
