import { Task } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Check, Edit2, GripVertical, Trash2 } from "lucide-react";
import React from "react";

const TaskCard = ({
  handleToggleStatus,
  task,
  handleEditClick,
  setIsDeleteModalOpen,
  setToDeleteTask,
}: any) => {
  if(!task) {
    return null
  }

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task?._id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };


  return (
    <div
      className="bg-gray-900 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
      ref={setNodeRef}
      style={style}
      key={task?._id}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span
              {...listeners}
              {...attributes}
              className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300"
            >
              <GripVertical size={18} />
            </span>

            <button
              onClick={() => handleToggleStatus(task)}
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                task.status === "completed"
                  ? "bg-green-500 border-green-500"
                  : "border-gray-300 hover:border-green-500"
              }`}
            >
              {task.status === "completed" && (
                <Check size={16} className="text-white" />
              )}
            </button>
            <h3
              className={`text-xl font-semibold ${
                task.status === "completed"
                  ? "text-gray-600 line-through"
                  : "text-gray-400"
              }`}
            >
              {task.title}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                task.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {task.status}
            </span>
          </div>
          <p
            className={`text-gray-600 ml-9 ${
              task.status === "completed" ? "line-through" : ""
            }`}
          >
            {task.description}
          </p>
          <div className="text-xs text-gray-400 ml-9 mt-2">
            Created: {new Date(task.createdAt).toLocaleString()}
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => handleEditClick(task)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => {
              setIsDeleteModalOpen(true);
              setToDeleteTask(task);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;