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
      localStorage.clear();
      navigate("/login", { replace: true });
    } else {
      setActiveTab(item.label);
      if (item.label === "Certificates") {
        navigate("/viewcertificates");
      }
    }
  };

  return (
    /* Outer container is bg-white so the iOS status bar and header are one continuous white surface */
    <div className="min-h-screen min-h-dvh bg-white flex flex-col font-sans">
      {/* Header Bar */}
      <header className="w-full bg-white px-6 pt-3 pb-3 flex items-center justify-between shrink-0 z-30">
        {/* Left: Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/assets/esico-logo-letters.png"
            alt="ESICO Logo"
            className="h-9 w-auto object-contain"
          />
        </div>

        {/* Right: Avatar + Indicator + Hamburger */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#e2e8f0] flex items-center justify-center overflow-hidden">
                <svg
                  className="w-7 h-7 text-white mt-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
              <span className="absolute bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00d284] border-2 border-white"></span>
            </div>

            <span className="hidden md:inline text-[12px] font-medium text-neutral-800 tracking-wide uppercase">
              EMAAR SUPPORT INSPECTION COMPANY
            </span>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-[#64748b] hover:text-neutral-900 p-1 cursor-pointer focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <div className="w-6 h-4 flex flex-col justify-between">
                <span className="block h-[2.5px] w-full bg-[#64748b] rounded-full"></span>
                <span className="block h-[2.5px] w-full bg-[#64748b] rounded-full"></span>
                <span className="block h-[2.5px] w-full bg-[#64748b] rounded-full"></span>
              </div>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Layout - Lilac Canvas starts HERE */}
      <div className="flex flex-1 bg-[#f3edf7] relative">
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

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/10 z-40 md:hidden transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        <div
          className={`fixed top-0 right-0 bottom-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-200 ease-in-out md:hidden flex flex-col border-l border-neutral-100 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-neutral-500 hover:text-neutral-800 p-1 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="py-2 space-y-1 flex-1 overflow-y-auto">
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

        {/* Dashboard Canvas */}
        <main className="flex-1 px-6 py-6 sm:p-7 overflow-y-auto w-full">
          {/* Breadcrumb Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-11 h-11 rounded-[12px] bg-gradient-to-b from-[#b765ff] to-[#9c45ff] flex items-center justify-center text-white shadow-[0_4px_14px_rgba(156,69,255,0.35)] shrink-0">
              <Home className="w-5 h-5" />
            </div>
            <h1 className="text-[20px] font-bold text-neutral-900 tracking-tight">
              Dashboard
            </h1>
          </div>

          {/* KPI Statistic Cards */}
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
              <div className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -bottom-16 -right-6 w-52 h-52 rounded-full bg-white/10" />
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
              <div className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -bottom-16 -right-6 w-52 h-52 rounded-full bg-white/10" />
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
              <div className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -bottom-16 -right-6 w-52 h-52 rounded-full bg-white/10" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}