// src/layouts/AdminLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/ui/AdminHeader";
import AdminSidebar from "../components/ui/AdminSidebar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#f2edf3] flex flex-col font-['Ubuntu',sans-serif] text-[#343a40]">
      <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar isOpen={sidebarOpen} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}