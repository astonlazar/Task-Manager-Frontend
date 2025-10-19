"use client";

import DeleteConfirmModal from "@/components/delete-confim-modal";
import Header from "@/components/header";
import TaskModal from "@/components/task-modal";
import useAuthStore from "@/store/authStore";
import { Task } from "@/types";
import axiosInstance from "@/utils/axios";
import axios from "axios";
import { Loader2, Plus, Edit2, Trash2, Check, X, Delete } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [toDeleteTask, setToDeleteTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
  }>({
    title: "",
    description: "",
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Fetch all tasks
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/tasks");
      const data = response.data.data;
      setTasks(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
    if (isAuthenticated) fetchTasks();
  }, [isAuthenticated]);

  // Create task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/tasks/create-task", formData);
      await fetchTasks();
      setFormData({ title: "", description: "" });
      setIsModalOpen(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Update task
  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(
        `/tasks/edit/${editingTask._id}`,
        formData
      );
      await fetchTasks();
      setFormData({ title: "", description: "" });
      setEditingTask(null);
      setIsModalOpen(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Delete task
  const handleDeleteTask = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.delete(`/tasks/delete/${id}`);
      await fetchTasks();
      handleCloseDeleteModal();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle task status
  const handleToggleStatus = async (task: Task) => {
    setLoading(true);
    setError(null);
    try {
      const newStatus = task.status === "completed" ? "pending" : "completed";
      const response = await axiosInstance.patch(
        `/tasks/update-status/${task._id}`
      );
      await fetchTasks();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Open modal for editing
  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setFormData({ title: task.title, description: task.description });
    setIsModalOpen(true);
  };

  // Open modal for creating
  const handleCreateClick = () => {
    setEditingTask(null);
    setFormData({ title: "", description: "" });
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setFormData({ title: "", description: "" });
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setToDeleteTask(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-indigo-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Header handleCreateClick={handleCreateClick} />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && tasks.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-gray-300" size={40} />
          </div>
        )}

        {/* Tasks List */}
        {!loading && tasks.length === 0 ? (
          <div className="bg-gray-900 rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">
              No tasks yet. Create your first task!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Pending Tasks Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-200 mb-4 border-b border-gray-700 pb-2">
                Pending Tasks
              </h2>
              <div className="space-y-4">
                {tasks.filter((task) => task.status !== "completed").length ===
                0 ? (
                  <p className="text-gray-400 text-sm">No pending tasks 🎉</p>
                ) : (
                  tasks
                    .filter((task) => task.status !== "completed")
                    .map((task) => (
                      <div
                        key={task._id}
                        className="bg-gray-900 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
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
                                task.status === "completed"
                                  ? "line-through"
                                  : ""
                              }`}
                            >
                              {task.description}
                            </p>
                            <div className="text-xs text-gray-400 ml-9 mt-2">
                              Created:{" "}
                              {new Date(task.createdAt).toLocaleString()}
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
                    ))
                )}
              </div>
            </div>

            {/* Completed Tasks Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-200 mb-4 border-b border-gray-700 pb-2">
                Completed Tasks
              </h2>
              <div className="space-y-4">
                {tasks.filter((task) => task.status === "completed").length ===
                0 ? (
                  <p className="text-gray-400 text-sm">
                    No completed tasks yet.
                  </p>
                ) : (
                  tasks
                    .filter((task) => task.status === "completed")
                    .map((task) => (
                      <div
                        key={task._id}
                        className="bg-gray-900 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <button
                                onClick={() => handleToggleStatus(task)}
                                className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors bg-green-500 border-green-500"
                              >
                                <Check size={16} className="text-white" />
                              </button>
                              <h3 className="text-xl font-semibold text-gray-600 line-through">
                                {task.title}
                              </h3>
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                {task.status}
                              </span>
                            </div>
                            <p className="text-gray-600 ml-9 line-through">
                              {task.description}
                            </p>
                            <div className="text-xs text-gray-400 ml-9 mt-2">
                              Created:{" "}
                              {new Date(task.createdAt).toLocaleString()}
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
                    ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <TaskModal
            editingTask={editingTask}
            formData={formData}
            handleCloseModal={handleCloseModal}
            handleCreateTask={handleCreateTask}
            handleUpdateTask={handleUpdateTask}
            loading={loading}
            setFormData={setFormData}
          />
        )}

        {isDeleteModalOpen && toDeleteTask && (
          <DeleteConfirmModal
            task={toDeleteTask}
            handleCloseModal={handleCloseDeleteModal}
            handleDeleteTask={handleDeleteTask}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default TaskManager;
