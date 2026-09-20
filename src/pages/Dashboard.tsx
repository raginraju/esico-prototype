// src/pages/Dashboard.tsx
import { Home } from "lucide-react";
import { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import { authHeaders } from "../lib/utils";

type DashboardStats = {
  total: number;
  week: number;
  month: number;
  weekStart: string;
  weekEnd: string;
  monthLabel: string;
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const headers = authHeaders();
        const response = Object.keys(headers).length
          ? await fetch("/api/certificates/stats", { headers })
          : await fetch("/api/certificates/stats");
        const json = await response.json();

        if (json.status === "success" && json.data) {
          setStats(json.data);
        }
      } catch (error) {
        console.error("Failed to load dashboard statistics:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <PageHeader title="Dashboard" icon={<Home className="w-5 h-5" />} />

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Total Certificates */}
        <div className="relative overflow-hidden rounded-[6px] bg-gradient-to-r from-[#208ef7] to-[#3aa2f8] p-6 text-white shadow-sm min-h-[156px] flex flex-col justify-between">
          <div>
            <p className="text-[14px] font-medium text-white/95">
              Total Certificates
            </p>
            <h2 className="text-[36px] font-bold tracking-tight mt-1 leading-none">
              {stats?.total ?? "-"}
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
              {stats?.week ?? "-"}
            </h2>
          </div>
          <div className="text-[12px] text-white/90 font-medium">
            {stats ? `${stats.weekStart} to ${stats.weekEnd}` : "Loading..."}
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
              {stats?.month ?? "-"}
            </h2>
          </div>
          <div className="text-[12px] text-white/90 font-medium">
            {stats?.monthLabel ?? "Loading..."}
          </div>
          <div className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 -right-6 w-52 h-52 rounded-full bg-white/10" />
        </div>
      </div>
    </>
  );
}