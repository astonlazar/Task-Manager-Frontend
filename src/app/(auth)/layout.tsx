"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
   const [isChecking, setIsChecking] = useState(true);
   const {isAuthenticated} = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    } else {
      setIsChecking(false);
    }
  }, [router]);

    if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-indigo-900 text-white">
        <p className="animate-pulse text-lg">Checking authentication...</p>
      </div>
    );
  }

  return (
    <>
    { children }
    </>
  );
}
