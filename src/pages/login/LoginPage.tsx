"use client";
import React, { useState } from "react";
import { Loader2, LogIn, UserPlus, AlertCircle } from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/utils/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ username: "", password: "" });
  const router = useRouter();

  const { login } = useAuthStore();

  const validateForm = () => {
    const newErrors = { username: "", password: "" };
    let isValid = true;

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    console.log(formData);

    try {
      const response = await axiosInstance.post("/user/login", formData);

      toast.success(response.data.message);
      login(response.data.token);
      localStorage.setItem("authToken", response.data.token);
      console.log(response.data);
      setLoading(false);
      router.replace("/");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Error"
      );
      setLoading(false);
    }
  };

  const handleInputChange = (field: "username" | "password", value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-indigo-900 flex items-center justify-center px-4">
      <div className="bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="Enter your username"
              className={`w-full px-4 py-2 bg-gray-800 text-gray-100 rounded-lg border ${
                errors.username
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-700 focus:ring-indigo-500"
              } focus:ring-2 focus:border-transparent outline-none`}
            />
            {errors.username && (
              <div className="flex items-center gap-1 mt-1 text-red-400 text-sm">
                <AlertCircle size={14} />
                <span>{errors.username}</span>
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 bg-gray-800 text-gray-100 rounded-lg border ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-700 focus:ring-indigo-500"
              } focus:ring-2 focus:border-transparent outline-none`}
            />
            {errors.password && (
              <div className="flex items-center gap-1 mt-1 text-red-400 text-sm">
                <AlertCircle size={14} />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Logging in...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Login
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-400 text-center mt-6">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-indigo-400 hover:underline hover:text-indigo-300"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;