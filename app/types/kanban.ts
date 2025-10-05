// types/kanban.ts
export type Task = {
    id: number;
    title: string;
    description: string;
    priority: Priority;
};

export type ColumnType = 'todo' | 'inProgress' | 'done';

export type Tasks = {
    [key in ColumnType]: Task[];
};

export type ColumnProps = {
    title: string;
    column: ColumnType;
    tasks: Task[];
    onDragStart: (taskId: number, column: ColumnType) => void;
    onDrop: (column: ColumnType) => void;
    onEditTask?: (task: Task) => void;
};

export type TaskProps = {
    task: Task;
    onDragStart: (taskId: number, column: ColumnType) => void;
    column: ColumnType;
    onEditTask?: (task: Task) => void;
    onDeleteTask?: (taskId: number) => void;
};

export type AddTaskFormProps = {
    onSubmit: (task: Omit<Task, 'id'> & { column: ColumnType }) => void;
    onCancel: () => void;
    initialData?: Omit<Task, 'id'> & { column: ColumnType };
};

export type Priority = 'low' | 'medium' | 'high';

export type PriorityFilter = 'all' | Priority;