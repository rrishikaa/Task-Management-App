import { DragEvent, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import KanbanTask from './KanbanTask';
import { ColumnProps, Task, ColumnType } from '../../types/kanban';
import Modal from '../ui/Modal'; 
import AddTaskForm from './AddTaskForm'; 

// NOTE: The parent component (KanbanBoard) must now pass a new prop to this component:
// onAddNewTask: (newTask: Omit<Task, 'id'> & { column: ColumnType }) => void;

export default function KanbanColumn({
    title,
    column,
    tasks,
    onDragStart,
    onDrop,
    onEditTask,
    onDeleteTask,
    onAddNewTask, // <-- This function handles saving the task to the global state
}: ColumnProps & { onAddNewTask: (newTask: Omit<Task, 'id'> & { column: ColumnType }) => void }) {
    
    // 1. LOCAL STATE: This state controls the modal visibility for adding a new task
    const [isModalOpen, setIsModalOpen] = useState(false); 

    const priorityOrder = { high: 1, medium: 2, low: 3 };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        onDrop(column);
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
    };

    // Handler for the AddTaskForm submission
    const handleFormSubmit = (taskData: Omit<Task, 'id'> & { column: ColumnType }) => {
        // Call the parent's function to actually add the task
        onAddNewTask(taskData); 
        // Close the modal
        setIsModalOpen(false); 
    };

    // Sort tasks by priority (high to low)
    const sortedTasks = [...tasks].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );

    // Define specific styles for the column headers based on the column key (from the image)
    const columnHeaderStyles = {
        todo: {
            bg: 'bg-indigo-600',
            text: 'text-white',
            counterBg: 'bg-white',
            counterText: 'text-indigo-600',
            hover: 'hover:bg-indigo-700'
        },
        inProgress: {
            bg: 'bg-amber-500',
            text: 'text-white',
            counterBg: 'bg-white',
            counterText: 'text-amber-500',
            hover: 'hover:bg-amber-600'
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
            {/* Column Header (Styling matched to image) */}
            <h2 
                className={`
                    ${currentStyle.bg} p-2 px-4 h-11 mb-4 flex items-center justify-between 
                    rounded-full text-lg font-semibold shadow-md transition-all duration-200
                `}
            >
                {/* Task Counter and Title */}
                <span className="flex items-center space-x-3">
                    <span 
                        className={`
                            inline-flex items-center justify-center h-7 w-7 text-sm font-bold rounded-full 
                            ${currentStyle.counterBg} ${currentStyle.counterText}
                            flex-shrink-0
                        `}
                    >
                        {tasks.length}
                    </span>
                    <span className={`${currentStyle.text} text-base truncate`}>
                        {title}
                    </span>
                </span>
                
                {/* Add Button: Opens the local modal */}
                <button 
                    type="button" 
                    className={`
                        inline-flex items-center justify-center h-7 w-7 rounded-full 
                        ${currentStyle.counterBg} ${currentStyle.counterText}
                        hover:ring-2 hover:ring-offset-1 hover:ring-offset-transparent hover:ring-white/80
                        transition-all duration-150 flex-shrink-0
                    `}
                    // 2. FIX: This is the correct handler to open the modal
                    onClick={() => setIsModalOpen(true)} 
                    aria-label={`Add new task to ${title}`}
                >
                    <PlusIcon className="h-4 w-4" aria-hidden="true" />
                </button>
            </h2>
            
            {/* Task List */}
            <div className="space-y-4">
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
            
            {/* Modal for Add Task: Localized to this column */}
           <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={`Add Task to ${title}`}
        >
            <AddTaskForm
                mode="create"  // explicitly tell the form it is creating
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
