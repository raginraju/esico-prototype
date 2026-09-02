import { useNavigate } from "react-router-dom";
import { MOCK_CERTIFICATES } from "../data/mockCertificates";
import { FileText, Plus, LogOut } from "lucide-react";

export default function Portal() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("esico_demo_token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header Bar */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00623a] text-white flex items-center justify-center font-bold text-sm">
            E
          </div>
          <div>
            <h1 className="text-sm font-bold text-neutral-900 leading-tight">ESICO Inspector Portal</h1>
            <p className="text-[11px] text-neutral-500">Buvanesh Vijayarayan (Senior Inspector)</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-red-600 font-medium"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Recent Inspection Reports</h2>
            <p className="text-xs text-neutral-500">Overview of issued certificates & tests</p>
          </div>
          <button
            onClick={() => alert("Form creation will connect to Cloudflare D1 in Phase 2.")}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#00623a] text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-[#004d2e]"
          >
            <Plus className="w-4 h-4" />
            New Inspection
          </button>
        </div>

        {/* Certificate Records Table */}
        <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-medium uppercase tracking-wider">
              <tr>
                <th className="p-4">Report No</th>
                <th className="p-4">Equipment</th>
                <th className="p-4">Client</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {Object.values(MOCK_CERTIFICATES).map((item) => (
                <tr key={item.reportNo} className="hover:bg-neutral-50">
                  <td className="p-4 font-bold text-[#15803d]">{item.reportNo}</td>
                  <td className="p-4 font-medium text-neutral-900">{item.equipmentDesc.title}</td>
                  <td className="p-4 text-neutral-600">{item.employer}</td>
                  <td className="p-4 text-neutral-600">{item.location}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded-full text-[10px]">
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => navigate(`/viewPDF/${item.reportNo}`)}
                      className="inline-flex items-center gap-1 text-[#9a4eff] hover:text-[#8c3df2] font-semibold text-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      View Sheet
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}