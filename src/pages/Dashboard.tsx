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
} from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
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
      {/* Top Header Bar */}
      <header className="h-[68px] bg-white border-b border-neutral-100 flex items-center justify-between px-6 shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        {/* Left: Logo & Hamburger Menu */}
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <svg className="w-8 h-8 text-[#00623a]" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 8L15 43L30 58L50 38L70 58L85 43L50 8Z" />
              <path d="M50 92L85 57L70 42L50 62L30 42L15 57L50 92Z" />
              <path d="M42 32L24 50L42 68L48 62L36 50L48 38L42 32Z" fill="#ffffff" />
              <path d="M58 32L76 50L58 68L52 62L64 50L52 38L58 32Z" fill="#ffffff" />
            </svg>
            <span className="text-[22px] font-black tracking-tight text-neutral-900 font-sans">
              ESICO
            </span>
          </div>

          <button className="text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Right: User Profile Indicator */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center text-neutral-500 text-xs font-semibold">
              <svg className="w-5 h-5 text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10b981] border-2 border-white"></span>
          </div>
          <span className="text-[12px] font-medium text-neutral-800 tracking-wide uppercase">
            EMAAR SUPPORT INSPECTION COMPANY
          </span>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="w-60 bg-white border-r border-neutral-100/80 py-5 flex flex-col shrink-0">
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

        {/* Dashboard Content */}
        <main className="flex-1 p-7 overflow-y-auto">
          {/* Breadcrumb Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-[8px] bg-[#b05ff8] flex items-center justify-center text-white shadow-sm">
              <Home className="w-4 h-4" />
            </div>
            <h1 className="text-[17px] font-bold text-neutral-800">
              Dashboard
            </h1>
          </div>

          {/* KPI Statistic Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Total Certificates (Blue Gradient) */}
            <div className="relative overflow-hidden rounded-[4px] bg-gradient-to-r from-[#208ef7] to-[#3aa2f8] p-6 text-white shadow-sm min-h-[148px] flex flex-col justify-between">
              <div>
                <p className="text-[13.5px] font-medium text-white/95">Total Certificates</p>
                <h2 className="text-[34px] font-bold tracking-tight mt-1 leading-none">11016</h2>
              </div>
              {/* Decorative Background Circles */}
                <div className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10" />
                <div className="pointer-events-none absolute -bottom-16 -right-6 w-52 h-52 rounded-full bg-white/10" />
            </div>

            {/* Card 2: This Week (Coral/Red-Pink Gradient) */}
            <div className="relative overflow-hidden rounded-[4px] bg-gradient-to-r from-[#ff8563] via-[#ff7878] to-[#ff6696] p-6 text-white shadow-sm min-h-[148px] flex flex-col justify-between">
              <div>
                <p className="text-[13.5px] font-medium text-white/95">This Week</p>
                <h2 className="text-[34px] font-bold tracking-tight mt-1 leading-none">32</h2>
              </div>
              <div className="text-[11.5px] text-white/90 font-medium">
                2026-08-31 to 2026-09-06
              </div>
              {/* Decorative Background Circles */}
                <div className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10" />
                <div className="pointer-events-none absolute -bottom-16 -right-6 w-52 h-52 rounded-full bg-white/10" />
            </div>

            {/* Card 3: This Month (Emerald/Teal Gradient) */}
            <div className="relative overflow-hidden rounded-[4px] bg-gradient-to-r from-[#17c2a7] to-[#25d292] p-6 text-white shadow-sm min-h-[148px] flex flex-col justify-between">
              <div>
                <p className="text-[13.5px] font-medium text-white/95">This Month</p>
                <h2 className="text-[34px] font-bold tracking-tight mt-1 leading-none">9</h2>
              </div>
              <div className="text-[11.5px] text-white/90 font-medium">
                September
              </div>
              {/* Decorative Background Circles */}
                <div className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10" />
                <div className="pointer-events-none absolute -bottom-16 -right-6 w-52 h-52 rounded-full bg-white/10" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}