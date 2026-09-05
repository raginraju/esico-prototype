// src/components/ui/AdminHeader.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="sticky top-0 h-[65px] bg-white px-4 sm:px-6 flex items-center justify-between shadow-xs border-b border-[#ebedf2] z-50 shrink-0">
      {/* Left: Logo */}
      <div className="flex items-center">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <img
            src={isMobile ? "/assets/esico-logo.png" : "/assets/esico-logo-letters.png"}
            alt="ESICO"
            className="h-8 w-auto object-contain"
          />
        </div>
      </div>

      {/* Right: Profile + Hamburger Menu */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#dee2e6] flex items-center justify-center text-[#6c757d] overflow-hidden">
              <svg className="w-6 h-6 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#1bcfb4] rounded-full ring-2 ring-white" />
          </div>
          {!isMobile && (
            <span className="text-[12px] font-medium tracking-tight text-[#495057]">
              EMAAR SUPPORT INSPECTION COMPANY
            </span>
          )}
        </div>

        <button
          onClick={onToggleSidebar}
          className="relative z-60 text-[#6c757d] hover:text-[#343a40] focus:outline-none p-1 cursor-pointer"
          aria-label="Toggle Navigation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}