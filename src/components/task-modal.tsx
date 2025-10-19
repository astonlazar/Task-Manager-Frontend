import { Task } from "@/types";
import { Loader2, X } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

const TaskModal = ({
  editingTask,
  handleCloseModal,
  handleUpdateTask,
  handleCreateTask,
  formData,
  setFormData,
  loading,
}: {
  editingTask: Task | null;
  handleCloseModal: () => void;
  handleUpdateTask: (e: any) => void;
  handleCreateTask: (e: any) => void;
  formData: { title: string; description: string };
  setFormData: Dispatch<SetStateAction<{ title: string; description: string }>>;
  loading: boolean
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-200">
            {editingTask ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask}>
          <div className="mb-4">
            <label className="block text-gray-200 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full text-gray-200 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-200 font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full text-gray-200 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-32 resize-none"
              required
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex-1 px-4 py-2 bg-gray-400 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Saving...
                </>
              ) : (
                <>{editingTask ? "Update" : "Create"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
