// components/kanban/KanbanColumn.tsx
import { DragEvent } from 'react';
import KanbanTask from './KanbanTask';
import { ColumnProps } from '../../types/kanban';

export default function KanbanColumn({
    title,
    column,
    tasks,
    onDragStart,
    onDrop,
    onEditTask,
    onDeleteTask
}: ColumnProps) {
    const priorityOrder = { high: 1, medium: 2, low: 3 };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        onDrop(column);
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
    };

    // Sort tasks by priority (high to low)
    const sortedTasks = [...tasks].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );

    // Column color based on status
    const columnColors = {
        todo: 'border-blue-200',
        inProgress: 'border-yellow-200',
        done: 'border-green-200'
    };

    return (
        <div
            className={`bg-white p-4 h-full min-h-[400px] rounded-lg border shadow-sm`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center justify-between">
                <span>{title}</span>
                <span className="inline-flex items-center justify-center text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-0.5">{tasks.length}</span>
            </h2>
            <div className="space-y-3">
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
                    <div className="p-6 text-center text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed">
                        No tasks in this column
                    </div>
                )}
            </div>
        </div>
    );
}