import { Priority, Task, ColumnType } from "../../types/kanban";
import { FormEvent, useState } from "react";
import { Sparkles } from "lucide-react"; 

type Props = {
  mode: "create" | "edit";
  onSubmit: (task: Omit<Task, "id"> & { column: ColumnType }) => void;
  onCancel: () => void;
  initialData?: Omit<Task, "id"> & { column: ColumnType };
};

export default function AddTaskForm({
  mode,
  onSubmit,
  onCancel,
  initialData,
}: Props) {
  const [task, setTask] = useState<Omit<Task, "id"> & { column: ColumnType }>(
    () => ({
      title: initialData?.title || "",
      description: initialData?.description || "",
      priority: initialData?.priority || "medium",
      column: initialData?.column || "todo",
    })
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!task.title.trim()) return;
    onSubmit(task);
  };

 

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      <div className="flex ">
        <button
          type="button"
          
          className="relative inline-flex items-center gap-2 px-4 py-2 font-medium text-gray-800 
                     bg-white border-0 rounded-full transition-all duration-300 
                     shadow-sm hover:shadow-md
                     before:absolute before:inset-0 before:rounded-full 
                     before:p-[2px] before:bg-gradient-to-r before:from-[#6366f1]/50 before:to-[#7e80e6]/50
                     before:content-[''] before:-z-10
                     hover:scale-[1.03]"
        >
          <Sparkles className="w-4 h-4 text-[#6366f1]" />
          Generate
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">Title *</label>
        <input
          type="text"
          placeholder="Task title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          className="w-full p-2 border text-black rounded focus:ring-0 focus:border-[#6366f1]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Description
        </label>
        <textarea
          placeholder="Task description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          className="w-full p-2 border text-black rounded focus:ring-1 focus:border-[#6366f1]"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Column
        </label>
        <div className="grid grid-cols-4 gap-2">
          {(["todo", "inProgress","review", "done"] as ColumnType[]).map((col) => (
            <button
              key={col}
              type="button"
              onClick={() => setTask({ ...task, column: col })}
              className={`py-2 rounded-md text-sm font-medium ${
                task.column === col
                  ? col === "todo"
                    ? "bg-pink-500 text-white"
                    : col === "inProgress"
                    ? "bg-amber-500 text-white"
                    : col === "review"
                    ? "bg-teal-500 text-white"
                    : "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {col === "todo"
                ? "To Do"
                : col === "inProgress"
                ? "In Progress"
                : col === "review"
                ? "Review"
                : "Done"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <div className="flex gap-2">
          {(["low", "medium", "high"] as Priority[]).map((priority) => (
            <button
              key={priority}
              type="button"
              onClick={() => setTask({ ...task, priority })}
              className={`flex-1 py-2 rounded-md text-sm font-medium ${
                task.priority === priority
                  ? priority === "high"
                    ? "bg-red-500 text-white"
                    : priority === "medium"
                    ? "bg-yellow-500 text-white"
                    : "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#6366f1] text-white rounded-md hover:bg-[#7e80e6] transition-colors"
        >
          {mode === "edit" ? "Update Task" : "Add Task"}
        </button>
      </div>
    </form>
  );
}
