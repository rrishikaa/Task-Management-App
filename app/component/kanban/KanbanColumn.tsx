import { DragEvent, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import KanbanTask from './KanbanTask';
import { ColumnProps, Task, ColumnType } from '../../types/kanban';
import Modal from '../ui/Modal'; 
import AddTaskForm from './AddTaskForm'; 

export default function KanbanColumn({
    title,
    column,
    tasks,
    onDragStart,
    onDrop,
    onEditTask,
    onDeleteTask,
    onAddNewTask,
}: ColumnProps & { onAddNewTask: (newTask: Omit<Task, 'id'> & { column: ColumnType }) => void }) {
    
    const [isModalOpen, setIsModalOpen] = useState(false); 

    const priorityOrder = { high: 1, medium: 2, low: 3 };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        onDrop(column);
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
    };

    const handleFormSubmit = (taskData: Omit<Task, 'id'> & { column: ColumnType }) => {
        onAddNewTask(taskData); 
        setIsModalOpen(false); 
    };

    const sortedTasks = [...tasks].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );

    // 🔹 Column-specific styles
    const columnHeaderStyles = {
        todo: {
            bg: 'bg-pink-500',
            text: 'text-white',
            counterBg: 'bg-white',
            counterText: 'text-pink-500',
            hover: 'hover:bg-pink-600'
        },
        inProgress: {
            bg: 'bg-amber-500',
            text: 'text-white',
            counterBg: 'bg-white',
            counterText: 'text-amber-500',
            hover: 'hover:bg-amber-600'
        },
        review: { 
            bg: 'bg-teal-500', 
            text: 'text-white',
            counterBg: 'bg-white',
            counterText: 'text-teal-500',
            hover: 'hover:bg-teal-500'
        },
        done: {
            bg: 'bg-green-500',
            text: 'text-white',
            counterBg: 'bg-white',
            counterText: 'text-green-500',
            hover: 'hover:bg-green-600'
        }
    };
    
    const currentStyle = columnHeaderStyles[column as keyof typeof columnHeaderStyles] || columnHeaderStyles.todo;

    return (
        <div
            className={`bg-gray-50 p-3 h-full min-h-[400px] rounded-xl border border-gray-200 shadow-md text-black`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            {/* Column Header */}
          <h2
            className={`
                ${currentStyle.bg} p-2 px-4 mb-4 
                flex items-center justify-between 
                rounded-full text-lg font-semibold shadow-md 
                transition-all duration-200
                overflow-hidden
            `}
            >
            {/* Left Section: Column Title + Count */}
            <span className="flex items-center gap-2 min-w-0">
                <span
                className={`
                    inline-flex items-center justify-center h-7 w-7 text-sm font-bold rounded-full 
                    ${currentStyle.counterBg} ${currentStyle.counterText}
                    flex-shrink-0
                `}
                >
                {tasks.length}
                </span>

                <span
                className={`${currentStyle.text} text-base truncate`}
                title={title}
                >
                {title}
                </span>
            </span>

            {/* + Button (hidden if space too tight) */}
        <span className="ml-2 flex-shrink-0 overflow-visible">
            <button
            type="button"
            className={`
                inline-flex items-center justify-center h-7 w-7 rounded-full 
                ${currentStyle.counterBg} ${currentStyle.counterText}
                hover:ring-2 hover:ring-offset-1 hover:ring-offset-transparent hover:ring-white/80
                transition-all duration-150
                
            `}
            onClick={() => setIsModalOpen(true)}
            aria-label={`Add new task to ${title}`}
            >
            <PlusIcon className="h-4 w-4" aria-hidden="true" />
            </button>
        </span>
        </h2>

            {/* Task List */}
            <div className="relative overflow-y-auto max-h-[50vh] pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent py-2">
                {sortedTasks.length > 0 ? (
                    sortedTasks.map(task => (
                        <KanbanTask
                            key={task.id}
                            task={task}
                            column={column}
                            onDragStart={onDragStart}
                            onEditTask={onEditTask}
                            onDeleteTask={onDeleteTask}
                        />
                    ))
                ) : (
                    <div className="p-6 text-center text-gray-500 text-sm bg-gray-100 rounded-xl border border-dashed border-gray-300">
                        Drop tasks here or click '+' to add new ones.
                    </div>
                )}
            </div>
            
            {/* Add Task Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Add Task to ${title}`}
            >
                <AddTaskForm
                    mode="create"
                    onSubmit={handleFormSubmit}
                    onCancel={() => setIsModalOpen(false)}
                    initialData={{
                        title: '',
                        description: '',
                        priority: 'medium',  
                        column: column
                    }}
                />
            </Modal>
        </div>
    );
}
