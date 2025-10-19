import { Task } from "@/types";
import { Loader2, X, Trash2 } from "lucide-react";
import React from "react";

interface DeleteConfirmModalProps {
  task: Task;
  handleCloseModal: () => void;
  handleDeleteTask: (id: string) => void;
  loading: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  task,
  handleCloseModal,
  handleDeleteTask,
  loading,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg shadow-xl max-w-sm w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-200">Delete Task</h2>
          <button
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-300 text-lg">
            Are you sure you want to delete{" "}
            <span className="text-red-400 font-semibold">{task.title}</span>?
          </p>
          <p className="text-gray-400 text-sm mt-2">
            This action cannot be undone.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCloseModal}
            className="flex-1 px-4 py-2 bg-gray-400 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDeleteTask(task._id)}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={18} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
