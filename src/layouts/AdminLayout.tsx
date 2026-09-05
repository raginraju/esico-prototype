// src/layouts/AdminLayout.tsx
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/ui/AdminHeader";
import AdminSidebar from "../components/ui/AdminSidebar";

export default function AdminLayout() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#f2edf3] flex flex-col font-['Ubuntu',sans-serif] text-[#343a40]">
      <AdminHeader onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      
      <div className="flex flex-1 relative overflow-hidden">
        {/* Mobile Backdrop Overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <AdminSidebar
          isOpen={sidebarOpen}
          isMobile={isMobile}
          onClose={() => setSidebarOpen(false)}
        />
        
        {/* Added pt-[65px] for mobile so the content starts below the sticky header */}
        <main className="flex-1 p-6 md:p-8 pt-[65px] md:pt-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}