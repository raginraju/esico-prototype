import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  CreditCard,
  FileCheck,
  Settings,
  LogOut,
  Menu,
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
      {/* Responsive Header Bar */}
      <header className="h-[64px] bg-white border-b border-neutral-100 flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <svg
              className="w-8 h-8 text-[#00623a]"
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
            <span className="hidden sm:inline text-[22px] font-black tracking-tight text-neutral-900 font-sans">
              ESICO
            </span>
          </div>
        </div>

        {/* Right: Avatar and Mobile Hamburger Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center text-neutral-500 text-xs font-semibold">
                <svg
                  className="w-5 h-5 text-neutral-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10b981] border-2 border-white"></span>
            </div>
            <span className="hidden md:inline text-[12px] font-medium text-neutral-800 tracking-wide uppercase">
              EMAAR SUPPORT INSPECTION COMPANY
            </span>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-neutral-600 hover:text-neutral-900 p-1 cursor-pointer transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1 relative">
        {/* Desktop Sidebar (Hidden on mobile) */}
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

        {/* Mobile Slide-over Drawer & Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 md:hidden transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-200 ease-in-out md:hidden flex flex-col ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-100">
            <span className="font-bold text-neutral-900 text-sm tracking-wide">
              Navigation Menu
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-neutral-500 hover:text-neutral-800 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="py-4 space-y-1 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.label;

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center justify-between px-6 py-3.5 text-[14px] font-medium transition-colors text-left ${
                    isActive
                      ? "text-[#b05ff8] bg-purple-50/50 font-semibold"
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
        <main className="flex-1 p-4 sm:p-7 overflow-y-auto w-full">
          {/* Breadcrumb Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-[8px] bg-[#b05ff8] flex items-center justify-center text-white shadow-sm shrink-0">
              <Home className="w-4 h-4" />
            </div>
            <h1 className="text-[17px] font-bold text-neutral-800">
              Dashboard
            </h1>
          </div>

          {/* Full-Width Responsive KPI Statistic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Card 1: Total Certificates (Blue Gradient) */}
            <div className="relative overflow-hidden rounded-[4px] bg-gradient-to-r from-[#208ef7] to-[#3aa2f8] p-6 text-white shadow-sm min-h-[148px] flex flex-col justify-between">
              <div>
                <p className="text-[13.5px] font-medium text-white/95">
                  Total Certificates
                </p>
                <h2 className="text-[34px] font-bold tracking-tight mt-1 leading-none">
                  11016
                </h2>
              </div>
              {/* Overlapping Circles on Right Edge */}
              <div className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -bottom-16 -right-6 w-52 h-52 rounded-full bg-white/10" />
            </div>

            {/* Card 2: This Week (Pink/Coral Gradient) */}
            <div className="relative overflow-hidden rounded-[4px] bg-gradient-to-r from-[#ff8563] via-[#ff7878] to-[#ff6696] p-6 text-white shadow-sm min-h-[148px] flex flex-col justify-between">
              <div>
                <p className="text-[13.5px] font-medium text-white/95">
                  This Week
                </p>
                <h2 className="text-[34px] font-bold tracking-tight mt-1 leading-none">
                  32
                </h2>
              </div>
              <div className="text-[11.5px] text-white/90 font-medium">
                2026-08-31 to 2026-09-06
              </div>
              {/* Overlapping Circles on Right Edge */}
              <div className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/15" />
              <div className="pointer-events-none absolute -bottom-16 -right-6 w-52 h-52 rounded-full bg-white/15" />
            </div>

            {/* Card 3: This Month (Teal/Emerald Gradient) */}
            <div className="relative overflow-hidden rounded-[4px] bg-gradient-to-r from-[#17c2a7] to-[#25d292] p-6 text-white shadow-sm min-h-[148px] flex flex-col justify-between">
              <div>
                <p className="text-[13.5px] font-medium text-white/95">
                  This Month
                </p>
                <h2 className="text-[34px] font-bold tracking-tight mt-1 leading-none">
                  9
                </h2>
              </div>
              <div className="text-[11.5px] text-white/90 font-medium">
                September
              </div>
              {/* Overlapping Circles on Right Edge */}
              <div className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/15" />
              <div className="pointer-events-none absolute -bottom-16 -right-6 w-52 h-52 rounded-full bg-white/15" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}