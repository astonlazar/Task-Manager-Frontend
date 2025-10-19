"use client";

import DeleteConfirmModal from "@/components/delete-confim-modal";
import Header from "@/components/header";
import TaskModal from "@/components/task-modal";
import useAuthStore from "@/store/authStore";
import { Task } from "@/types";
import axiosInstance from "@/utils/axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import { DndContext, DragEndEvent, closestCenter, pointerWithin, useDroppable } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

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

  const { setNodeRef: setPendingRef, isOver: isPendingOver } = useDroppable({
    id: "pending-dropzone",
  });
  const { setNodeRef: setCompletedRef, isOver: isCompletedOver } = useDroppable(
    {
      id: "completed-dropzone",
    }
  );

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
    if (!isAuthenticated) router.push("/login");
    else fetchTasks();
  }, [isAuthenticated]);

  useEffect(() => console.log({isPendingOver, isCompletedOver}), [isPendingOver, isCompletedOver])

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    console.log("Drag ended:", { active: active.id, over: over?.id });
    
    // if (!over) {
    //   console.log("No drop target");
    //   return;
    // }

    const draggedTask = tasks.find((t) => t._id === active.id);
    
    if (!draggedTask) {
      console.log("Task not found");
      return;
    }

    console.log("Dragged task:", draggedTask);
    // console.log("Drop zone:", over.id);

    // Check if the task was dropped in a different zone
    const shouldComplete = true  && draggedTask.status !== "completed";
    const shouldUncomplete = true && draggedTask.status === "completed";

    if (shouldComplete || shouldUncomplete) {
      console.log("Updating task status...");
      try {
        await axiosInstance.patch(`/tasks/update-status/${draggedTask._id}`);
        await fetchTasks();
      } catch (err) {
        console.error("Error updating task status:", err);
        setError("Failed to update task status");
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={pointerWithin} modifiers={[restrictToWindowEdges]} >
      <div className="min-h-screen bg-gradient-to-br from-blue-800 to-indigo-900 py-8 px-4 overflow-x-hidden">
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
                <div
                  ref={setPendingRef}
                  className={`space-y-4 p-4 rounded-lg transition-all border-dashed border-2 ${
                    isPendingOver
                      ? "bg-blue-900/40 border-blue-500"
                      : "border-gray-700"
                  }`}
                  style={{ minHeight: "200px" }}
                >
                  {tasks.filter((t) => t.status !== "completed").length === 0 ? (
                    <div className="text-gray-400 text-center py-8">
                      {isPendingOver ? "Drop here to mark as pending" : "No pending tasks 🎉"}
                    </div>
                  ) : (
                    tasks
                      .filter((t) => t.status !== "completed")
                      .map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          handleToggleStatus={handleToggleStatus}
                          handleEditClick={handleEditClick}
                          setIsDeleteModalOpen={setIsDeleteModalOpen}
                          setToDeleteTask={setToDeleteTask}
                        />
                      ))
                  )}
                </div>
              </div>

              {/* Completed Tasks Section */}
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-200 mb-4 border-b border-gray-700 pb-2">
                  Completed Tasks
                </h2>
                <div
                  ref={setCompletedRef}
                  className={`space-y-4 p-4 rounded-lg transition-all border-dashed border-2 ${
                    isCompletedOver
                      ? "bg-green-900/40 border-green-500"
                      : "border-gray-700"
                  }`}
                  style={{ minHeight: "200px" }}
                >
                  {tasks.filter((t) => t.status === "completed").length === 0 ? (
                    <div className="text-gray-400 text-center py-8">
                      {isCompletedOver ? "Drop here to mark as completed" : "No completed tasks yet."}
                    </div>
                  ) : (
                    tasks
                      .filter((t) => t.status === "completed")
                      .map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          handleToggleStatus={handleToggleStatus}
                          handleEditClick={handleEditClick}
                          setIsDeleteModalOpen={setIsDeleteModalOpen}
                          setToDeleteTask={setToDeleteTask}
                        />
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
    </DndContext>
  );
};

export default TaskManager;