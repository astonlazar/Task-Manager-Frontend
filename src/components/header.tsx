import useAuthStore from "@/store/authStore";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Header = ({ handleCreateClick }: { handleCreateClick: () => void }) => {
  const { logout, isAuthenticated } = useAuthStore();
  const router = useRouter()
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-300">Task Manager</h1>
          <p className="text-gray-200 mt-1">Organize your tasks efficiently</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleCreateClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            New Task
          </button>
          {isAuthenticated ? (
            <button onClick={() => {
              logout();
              router.push("/login")
            }} className="bg-red-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              Logout
            </button>
          ) : (
            <button onClick={() => router.push("/login")} className="bg-blue-400 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
