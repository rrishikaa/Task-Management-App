'use client';

import { useState, ReactNode, useEffect } from 'react';
import KanbanColumn from './KanbanColumn';
import AddTaskForm from './AddTaskForm';
import { Tasks, ColumnType, Task, Priority } from '../../types/kanban';
import ConfirmationDialog from '../ui/ConfirmationDialog';
import Modal from '../ui/Modal';
import PriorityDropdown from '../filter/priorityDropdown';

type PriorityFilter = 'all' | Priority;

export default function KanbanBoard(): ReactNode {
  const [tasks, setTasks] = useState<Tasks>({
    todo: [],
    inProgress: [],
    review: [],
    done: []
  });

  const STORAGE_KEY = 'kanban-tasks';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{ isOpen: boolean; mode: 'create' | 'edit' }>({
    isOpen: false,
    mode: 'create'
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<{ taskId: number; fromColumn: ColumnType } | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');

  // ------------------- Mock fetch tasks -------------------
  useEffect(() => {
    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);
        if (savedTasks) setTasks(JSON.parse(savedTasks));
      } catch (err) {
        console.error(err);
        setError('Failed to load tasks.');
      } finally {
        setLoading(false);
      }
    }, 1000); // simulate 1 second delay

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // ------------------- Drag & Drop -------------------
  const handleDragStart = (taskId: number, fromColumn: ColumnType) => setDraggedTask({ taskId, fromColumn });

  const handleDrop = (toColumn: ColumnType) => {
    if (!draggedTask) return;
    const { taskId, fromColumn } = draggedTask;
    if (fromColumn === toColumn) { setDraggedTask(null); return; }

    setTasks(prev => {
      const taskToMove = prev[fromColumn].find(t => t.id === taskId);
      if (!taskToMove) return prev;

      return {
        ...prev,
        [fromColumn]: prev[fromColumn].filter(t => t.id !== taskId),
        [toColumn]: [...prev[toColumn], taskToMove]
      };
    });

    setDraggedTask(null);
  };

  // ------------------- Add & Update Task -------------------
  const addNewTask = (newTask: Omit<Task, 'id'> & { column: ColumnType }) => {
    if (!newTask.title.trim()) return;
    setTasks(prev => ({
      ...prev,
      [newTask.column]: [...prev[newTask.column], { ...newTask, id: Date.now() }]
    }));
    setModalState({ isOpen: false, mode: 'create' });
  };

  const updateTask = (updatedTask: Task & { column: ColumnType }) => {
    setTasks(prev => {
      const newTasks = { ...prev };
      const currentColumn = (Object.keys(newTasks) as ColumnType[]).find(col =>
        newTasks[col].some(t => t.id === updatedTask.id)
      );
      if (!currentColumn) return prev;

      if (currentColumn !== updatedTask.column) {
        const taskToMove = newTasks[currentColumn].find(t => t.id === updatedTask.id);
        if (!taskToMove) return prev;
        newTasks[currentColumn] = newTasks[currentColumn].filter(t => t.id !== updatedTask.id);
        newTasks[updatedTask.column] = [...newTasks[updatedTask.column], { ...taskToMove, ...updatedTask }];
      } else {
        newTasks[currentColumn] = newTasks[currentColumn].map(task =>
          task.id === updatedTask.id ? { ...task, ...updatedTask } : task
        );
      }
      return newTasks;
    });

    setModalState({ isOpen: false, mode: 'create' });
    setEditingTask(null);
  };

  // ------------------- Delete Task -------------------
  const handleDeleteTask = (taskId: number) => {
    setTasks(prev => {
      const updatedTasks = { ...prev };
      (Object.keys(updatedTasks) as ColumnType[]).forEach(col => {
        updatedTasks[col] = updatedTasks[col].filter(task => task.id !== taskId);
      });
      return updatedTasks;
    });
  };

  const confirmDelete = () => { if (taskToDelete) { handleDeleteTask(taskToDelete); setTaskToDelete(null); } };
  const cancelDelete = () => setTaskToDelete(null);

  // ------------------- Filter Tasks -------------------
  const getFilteredTasks = (tasks: Tasks): Tasks => {
    if (priorityFilter === 'all') return tasks;
    return {
      todo: tasks.todo.filter(t => t.priority === priorityFilter),
      inProgress: tasks.inProgress.filter(t => t.priority === priorityFilter),
      review: tasks.review.filter(t => t.priority === priorityFilter),
      done: tasks.done.filter(t => t.priority === priorityFilter)
    };
  };
  const filteredTasks = getFilteredTasks(tasks);

  return (
    <div className="min-h-screen bg-gray-100 py-4 md:py-8 px-4 md:px-8 flex flex-col">
      
      {/* Header with Title + Profile */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Task Management Dashboard
        </h1>

        {/* Profile Circle (Hidden on small screens) */}
        <div className="hidden sm:flex items-center gap-3 pr-2">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
            JD
          </div>
        </div>
      </div>

      {/* Priority Filter */}
      <div className="mb-6 flex justify-end">
        <PriorityDropdown priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter} />
      </div>

      {/* Loading / Error / Kanban Columns */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading tasks...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(['todo', 'inProgress', 'review', 'done'] as ColumnType[]).map(col => (
            <KanbanColumn
              key={col}
              title={col.replace(/^\w/, c => c.toUpperCase())}
              column={col}
              tasks={filteredTasks[col]}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onEditTask={task => { setEditingTask(task); setModalState({ isOpen: true, mode: 'edit' }); }}
              onDeleteTask={setTaskToDelete}
              onAddNewTask={addNewTask}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Task Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => { setModalState({ isOpen: false, mode: 'create' }); setEditingTask(null); }}
        title={modalState.mode === 'create' ? 'Add New Task' : 'Edit Task'}
      >
        <AddTaskForm
          mode={modalState.mode}
          onSubmit={taskData => {
            if (modalState.mode === 'create') addNewTask(taskData);
            else if (editingTask) updateTask({ ...taskData, id: editingTask.id });
          }}
          onCancel={() => { setModalState({ isOpen: false, mode: 'create' }); setEditingTask(null); }}
          initialData={editingTask ? {
            title: editingTask.title,
            description: editingTask.description,
            priority: editingTask.priority,
            column: (Object.keys(tasks).find(col =>
              tasks[col as ColumnType].some(t => t.id === editingTask.id)
            ) as ColumnType) || 'todo',
          } : undefined}
        />
      </Modal>

      {/* Add Task Floating Button */}
      <button
        onClick={() => setModalState({ isOpen: true, mode: 'create' })}
        className="fixed bottom-8 right-8 bg-[#7e80e6] hover:bg-[#6366f1] text-white p-5 rounded-full shadow-lg flex items-center justify-center transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span className="sr-only">Add Task</span>
      </button>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={taskToDelete !== null}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
