'use client';

import { useState, ReactNode, useEffect } from 'react';
import KanbanColumn from './KanbanColumn';
import AddTaskForm from './AddTaskForm';
import { Tasks, ColumnType, Task, Priority } from '@/types/kanban';
import ConfirmationDialog from '../ui/ConfirmationDialog';
import Modal from '../ui/Modal';

type PriorityFilter = 'all' | Priority;

export default function KanbanBoard(): ReactNode {
    const [tasks, setTasks] = useState<Tasks>({
        todo: [],
        inProgress: [],
        done: []
    });
    const STORAGE_KEY = 'kanban-tasks';
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        mode: 'add' | 'edit';
    }>({
        isOpen: false,
        mode: 'add'
    });
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [draggedTask, setDraggedTask] = useState<{ taskId: number, fromColumn: ColumnType } | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
    const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');

    const handleDragStart = (taskId: number, fromColumn: ColumnType) => {
        setDraggedTask({ taskId, fromColumn });
    };

    const getFilteredTasks = (tasks: Tasks): Tasks => {
        if (priorityFilter === 'all') return tasks;

        return {
            todo: tasks.todo.filter(task => task.priority === priorityFilter),
            inProgress: tasks.inProgress.filter(task => task.priority === priorityFilter),
            done: tasks.done.filter(task => task.priority === priorityFilter),
        };
    };

    const filteredTasks = getFilteredTasks(tasks);

    useEffect(() => {
        const savedTasks = localStorage.getItem(STORAGE_KEY);
        if (savedTasks) {
            try {
                const parsedTasks = JSON.parse(savedTasks);
                setTasks(parsedTasks);
            } catch (error) {
                console.error('Failed to parse saved tasks', error);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);

    const confirmDelete = () => {
        if (taskToDelete) {
            handleDeleteTask(taskToDelete);
            setTaskToDelete(null);
        }
    };

    const cancelDelete = () => {
        setTaskToDelete(null);
    };

    const handleDrop = (toColumn: ColumnType) => {
        if (!draggedTask) return;

        const { taskId, fromColumn } = draggedTask;

        if (fromColumn === toColumn) {
            setDraggedTask(null);
            return;
        }

        setTasks(prevTasks => {
            const taskToMove = prevTasks[fromColumn].find(task => task.id === taskId);
            if (!taskToMove) return prevTasks;

            const updatedTasks = {
                ...prevTasks,
                [fromColumn]: prevTasks[fromColumn].filter(task => task.id !== taskId),
                [toColumn]: [...prevTasks[toColumn], taskToMove]
            };

            return updatedTasks;
        });

        setDraggedTask(null);
    };

    const addNewTask = (newTask: Omit<Task, 'id'> & { column: ColumnType }) => {
        if (!newTask.title.trim()) return;
        setTasks(prev => ({
            ...prev,
            [newTask.column]: [...prev[newTask.column], {
                ...newTask,
                id: Date.now()
            }]
        }));
        setModalState({ isOpen: false, mode: 'add' });
    };

    const updateTask = (updatedTask: Task) => {
        setTasks(prev => {
            const updatedTasks = { ...prev };
            for (const column in updatedTasks) {
                const col = column as ColumnType;
                const index = updatedTasks[col].findIndex(t => t.id === updatedTask.id);
                if (index !== -1) {
                    updatedTasks[col][index] = updatedTask;
                    break;
                }
            }
            return updatedTasks;
        });
        setModalState({ isOpen: false, mode: 'add' });
    };

    const handleDeleteTask = (taskId: number) => {
        setTasks(prevTasks => {
            const updatedTasks = { ...prevTasks };
            for (const column in updatedTasks) {
                const col = column as ColumnType;
                updatedTasks[col] = updatedTasks[col].filter(task => task.id !== taskId);
            }
            return updatedTasks;
        });
    };

    const handleAddClick = () => {
        setEditingTask(null);
        setModalState({ isOpen: true, mode: 'add' });
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setModalState({ isOpen: true, mode: 'edit' });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 p-2 bg-white">Kanban Board</h1>
            

            {/* Priority Filter Controls */}
            <div className="mb-6 flex flex-wrap items-center gap-4 justify-end">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Filter by priority:</span>
                    <div className="flex space-x-1">
                        {(['all', 'low', 'medium', 'high'] as PriorityFilter[]).map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setPriorityFilter(filter)}
                                className={`px-3 py-1 text-sm rounded-md ${priorityFilter === filter
                                    ? filter === 'all'
                                        ? 'bg-gray-500 text-white'
                                        : filter === 'high'
                                            ? 'bg-red-500 text-white'
                                            : filter === 'medium'
                                                ? 'bg-yellow-500 text-white'
                                                : 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                                    }`}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal for Add/Edit Task */}
            <Modal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ isOpen: false, mode: 'add' })}
                title={modalState.mode === 'add' ? 'Add New Task' : 'Edit Task'}
            >
                <AddTaskForm
                    onSubmit={(taskData) => {
                        if (modalState.mode === 'add') {
                            addNewTask(taskData);
                        } else if (editingTask) {
                            updateTask({ ...taskData, id: editingTask.id });
                        }
                    }}
                    onCancel={() => setModalState({ isOpen: false, mode: 'add' })}
                    initialData={editingTask ? {
                        title: editingTask.title,
                        description: editingTask.description,
                        priority: editingTask.priority,
                        column: Object.entries(tasks).find(([_, colTasks]) =>
                            colTasks.some(t => t.id === editingTask.id)
                        )?.[0] as ColumnType || 'todo'
                    } : undefined}
                />
            </Modal>

            {/* Add Task Button */}
            <button
                onClick={handleAddClick}
                className="fixed z-[99] bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="sr-only">Add Task</span>
            </button>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KanbanColumn
                    title="To Do"
                    column="todo"
                    tasks={filteredTasks.todo}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onEditTask={handleEditTask}
                    onDeleteTask={setTaskToDelete}
                />
                <KanbanColumn
                    title="In Progress"
                    column="inProgress"
                    tasks={filteredTasks.inProgress}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onEditTask={handleEditTask}
                    onDeleteTask={setTaskToDelete}
                />
                <KanbanColumn
                    title="Done"
                    column="done"
                    tasks={filteredTasks.done}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onEditTask={handleEditTask}
                    onDeleteTask={setTaskToDelete}
                />
            </div>

            <ConfirmationDialog
                isOpen={taskToDelete !== null}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
}