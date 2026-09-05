// src/layouts/AdminSidebar.tsx
import { useLocation, useNavigate } from "react-router-dom";

export interface AdminSidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose?: () => void; // Added onClose prop
}

export default function AdminSidebar({ isOpen, isMobile, onClose }: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: "Users",
      path: "/users",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      label: "ID Cards",
      path: "/idcards",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      ),
    },
    {
      label: "Certificates",
      path: "/certificates",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: "Settings",
      path: "/settings",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: "Logout",
      path: "/login",
      isLogout: true,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
    },
  ];

  const handleNavClick = (item: (typeof menuItems)[0]) => {
    if (isMobile && onClose) {
      onClose(); // Retract the drawer on mobile
    }
    if (item.isLogout) {
      localStorage.clear();
      navigate("/login", { replace: true });
      return;
    }
    navigate(item.path);
  };

  if (isMobile) {
    return (
      <div
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col border-l border-[#ebedf2] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="py-2 space-y-1 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center justify-between px-7 py-4 text-[14px] transition-colors cursor-pointer text-left ${
                  isActive ? "text-[#b66dff] font-medium bg-neutral-50" : "text-[#495057] hover:bg-neutral-50"
                }`}
              >
                <span>{item.label}</span>
                <span className={isActive ? "text-[#b66dff]" : "text-[#c3bdbd]"}>{item.icon}</span>
              </button>
            );
          })}
        </nav>
      </div>
    );
  }

  return (
    <aside
      className={`${
        isOpen ? "w-[240px]" : "w-0"
      } transition-all duration-200 bg-white shrink-0 border-r border-[#ebedf2] flex flex-col py-4 select-none overflow-hidden`}
    >
      <nav className="space-y-1 w-[240px]">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className={`w-full flex items-center justify-between px-6 py-3 text-[13px] transition-colors cursor-pointer text-left ${
                isActive ? "text-[#b66dff] font-medium" : "text-[#495057] hover:text-[#b66dff]"
              }`}
            >
              <span>{item.label}</span>
              <span className={isActive ? "text-[#b66dff]" : "text-[#c3bdbd]"}>{item.icon}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}