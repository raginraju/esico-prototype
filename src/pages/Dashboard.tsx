import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  CreditCard,
  FileCheck,
  Settings,
  LogOut,
  X,
} from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", icon: Home, path: "/dashboard" },
    { label: "Users", icon: Users, path: "/users" },
    { label: "ID Cards", icon: CreditCard, path: "/id-cards" },
    { label: "Certificates", icon: FileCheck, path: "/certificates" },
    { label: "Settings", icon: Settings, path: "/settings" },
    { label: "Logout", icon: LogOut, path: "/login", isLogout: true },
  ];

  const handleNavClick = (item: (typeof navItems)[0]) => {
    setIsMobileMenuOpen(false);
    if (item.isLogout) {
      localStorage.removeItem("esico_demo_token");
      navigate("/login");
    } else {
      setActiveTab(item.label);
      if (item.label === "Certificates") {
        navigate("/viewcertificates");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f3edf7] flex flex-col font-sans">
      {/* Top Header Bar - Seamless without border */}
      <header className="h-[70px] bg-white flex items-center justify-between px-6 shrink-0 z-30">
        {/* Left: Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <svg
            className="w-9 h-9 text-[#00623a]"
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <path d="M50 8L15 43L30 58L50 38L70 58L85 43L50 8Z" />
            <path d="M50 92L85 57L70 42L50 62L30 42L15 57L50 92Z" />
            <path
              d="M42 32L24 50L42 68L48 62L36 50L48 38L42 32Z"
              fill="#ffffff"
            />
            <path
              d="M58 32L76 50L58 68L52 62L64 50L52 38L58 32Z"
              fill="#ffffff"
            />
          </svg>
          <span className="hidden md:inline text-[22px] font-black tracking-tight text-neutral-900 font-sans">
            ESICO
          </span>
        </div>

        {/* Right: Avatar and Hamburger Menu */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {/* User Avatar with Green Dot */}
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-[#f1f5f9] flex items-center justify-center overflow-hidden">
                <svg
                  className="w-6 h-6 text-[#94a3b8] mt-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#22c55e] ring-2 ring-white"></span>
            </div>

            <span className="hidden md:inline text-[12px] font-medium text-neutral-800 tracking-wide uppercase">
              EMAAR SUPPORT INSPECTION COMPANY
            </span>
          </div>

          {/* Clean 3-Line Hamburger Icon */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-[#4b5563] hover:text-neutral-900 p-1 cursor-pointer focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className="block h-[2px] w-full bg-[#4b5563] rounded-full"></span>
                <span className="block h-[2px] w-full bg-[#4b5563] rounded-full"></span>
                <span className="block h-[2px] w-full bg-[#4b5563] rounded-full"></span>
              </div>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-60 bg-white border-r border-neutral-100/80 py-5 flex-col shrink-0">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.label;

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center justify-between px-6 py-3.5 text-[13.5px] font-medium transition-colors cursor-pointer text-left ${
                    isActive
                      ? "text-[#b05ff8]"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                  }`}
                >
                  <span>{item.label}</span>
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-[#b05ff8]" : "text-neutral-400"
                    }`}
                  />
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Slide-over Drawer from Right */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/10 z-40 md:hidden transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        <div
          className={`fixed top-[70px] right-0 bottom-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-200 ease-in-out md:hidden flex flex-col border-l border-neutral-100 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <nav className="py-5 space-y-1 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.label;

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center justify-between px-7 py-4 text-[14px] font-medium transition-colors text-left cursor-pointer ${
                    isActive
                      ? "text-[#b05ff8]"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  <span>{item.label}</span>
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-[#b05ff8]" : "text-neutral-400"
                    }`}
                  />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Dashboard Content */}
        <main className="flex-1 px-6 py-5 sm:p-7 overflow-y-auto w-full">
          {/* Dashboard Breadcrumb Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-10 h-10 rounded-[10px] bg-[#9333ea] flex items-center justify-center text-white shadow-[0_4px_14px_rgba(147,51,234,0.35)] shrink-0">
              <Home className="w-5 h-5" />
            </div>
            <h1 className="text-[19px] font-bold text-neutral-900 tracking-tight">
              Dashboard
            </h1>
          </div>

          {/* KPI Statistic Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Card 1: Total Certificates */}
            <div className="relative overflow-hidden rounded-[6px] bg-gradient-to-r from-[#208ef7] to-[#3aa2f8] p-6 text-white shadow-sm min-h-[156px] flex flex-col justify-between">
              <div>
                <p className="text-[14px] font-medium text-white/95">
                  Total Certificates
                </p>
                <h2 className="text-[36px] font-bold tracking-tight mt-1 leading-none">
                  11016
                </h2>
              </div>
              <div className="pointer-events-none absolute -top-8 -right-12 w-56 h-56 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -bottom-16 -right-4 w-48 h-48 rounded-full bg-white/10" />
            </div>

            {/* Card 2: This Week */}
            <div className="relative overflow-hidden rounded-[6px] bg-gradient-to-r from-[#ff8563] via-[#ff7878] to-[#ff6696] p-6 text-white shadow-sm min-h-[156px] flex flex-col justify-between">
              <div>
                <p className="text-[14px] font-medium text-white/95">
                  This Week
                </p>
                <h2 className="text-[36px] font-bold tracking-tight mt-1 leading-none">
                  32
                </h2>
              </div>
              <div className="text-[12px] text-white/90 font-medium">
                2026-08-31 to 2026-09-06
              </div>
              <div className="pointer-events-none absolute -top-8 -right-12 w-56 h-56 rounded-full bg-white/15" />
              <div className="pointer-events-none absolute -bottom-16 -right-4 w-48 h-48 rounded-full bg-white/15" />
            </div>

            {/* Card 3: This Month */}
            <div className="relative overflow-hidden rounded-[6px] bg-gradient-to-r from-[#17c2a7] to-[#25d292] p-6 text-white shadow-sm min-h-[156px] flex flex-col justify-between">
              <div>
                <p className="text-[14px] font-medium text-white/95">
                  This Month
                </p>
                <h2 className="text-[36px] font-bold tracking-tight mt-1 leading-none">
                  9
                </h2>
              </div>
              <div className="text-[12px] text-white/90 font-medium">
                September
              </div>
              <div className="pointer-events-none absolute -top-8 -right-12 w-56 h-56 rounded-full bg-white/15" />
              <div className="pointer-events-none absolute -bottom-16 -right-4 w-48 h-48 rounded-full bg-white/15" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}