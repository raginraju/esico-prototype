// src/pages/Certificates.tsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FileCheck } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";

interface CertificateItem {
  id: string;
  unique_id: string;
  report_number: string;
  sticker_number: string;
  location: string;
  selected_date: string;
  inspector_name: string;
  inspected_by: string;
}

export default function Certificates() {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportNumber, setReportNumber] = useState("");
  const [inspector, setInspector] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCertificates = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (reportNumber.trim()) {
        params.append("search", reportNumber.trim());
      }

      const res = await fetch(`/api/certificates?${params.toString()}`);
      const json = await res.json();

      if (json.status === "success" && Array.isArray(json.data)) {
        let filtered = json.data as CertificateItem[];

        if (fromDate) {
          filtered = filtered.filter((c) => c.selected_date >= fromDate);
        }
        if (toDate) {
          filtered = filtered.filter((c) => c.selected_date <= toDate);
        }
        if (inspector) {
          filtered = filtered.filter(
            (c) =>
              c.inspected_by?.toLowerCase() === inspector.toLowerCase() ||
              c.inspector_name?.toLowerCase() === inspector.toLowerCase()
          );
        }

        setCertificates(filtered);
        setTotal(json.pagination?.total ?? json.count ?? 0);
        setTotalPages(json.pagination?.totalPages ?? 1);
      }
    } catch (err) {
      console.error("Failed to load certificates:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, reportNumber, fromDate, toDate, inspector]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCertificates();
  };

  const handleResetFilters = () => {
    setFromDate("");
    setToDate("");
    setReportNumber("");
    setInspector("");
    setPage(1);
  };

  const handleDelete = async (id: string, reportNo: string) => {
    if (!confirm(`Are you sure you want to delete certificate ${reportNo}?`)) return;

    try {
      const res = await fetch(`/api/certificates/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (json.status === "success") {
        fetchCertificates();
      } else {
        alert(json.message || "Failed to delete certificate");
      }
    } catch (err) {
      console.error("Failed to delete certificate:", err);
    }
  };

  const startEntry = total === 0 ? 0 : (page - 1) * limit + 1;
  const endEntry = Math.min(page * limit, total);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Certificates"
          icon={<FileCheck className="w-5 h-5" />}
        />
        <Link to="/certificates/new">
          <button className="btn btn-gradient-primary brd-btn px-4 py-2 bg-gradient-to-r from-[#da8cff] to-[#9a55ff] text-white rounded-[4px] shadow-sm hover:opacity-95 transition-opacity cursor-pointer text-sm font-medium">
            Add New
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-[4px] shadow-[0_0_10px_rgba(0,0,0,0.03)] border border-[#ebedf2] overflow-hidden">
        {/* Filter Search Bar */}
        <form onSubmit={handleSearch} className="p-6 pb-4 flex flex-wrap items-end gap-3 text-[#495057]">
          <div>
            <label className="block text-[12px] font-medium mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-9 px-3 border border-[#ced4da] rounded-[2px] text-[12px] text-[#495057] focus:outline-none focus:border-[#b66dff] bg-white"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-9 px-3 border border-[#ced4da] rounded-[2px] text-[12px] text-[#495057] focus:outline-none focus:border-[#b66dff] bg-white"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium mb-1">Report / Sticker Number</label>
            <input
              type="text"
              placeholder=""
              value={reportNumber}
              onChange={(e) => setReportNumber(e.target.value)}
              className="h-9 w-48 px-3 border border-[#ced4da] rounded-[2px] text-[12px] text-[#495057] focus:outline-none focus:border-[#b66dff] bg-white"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium mb-1">Inspector</label>
            <select
              value={inspector}
              onChange={(e) => setInspector(e.target.value)}
              className="h-9 w-48 px-3 border border-[#ced4da] rounded-[2px] text-[12px] text-[#495057] focus:outline-none focus:border-[#b66dff] bg-white"
            >
              <option value="">Select Inspector</option>
              <option value="Jay Prakash">Jay Prakash</option>
              <option value="BUVANESH VIJAYARAYAN">BUVANESH VIJAYARAYAN</option>
              <option value="ANSON">ANSON</option>
            </select>
          </div>

          {/* Reset & Search Buttons */}
          <div className="flex items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={handleResetFilters}
              className="w-9 h-9 flex items-center justify-center bg-[#e8eff4] text-[#6c757d] hover:bg-[#dee2e6] rounded-[2px] transition-colors cursor-pointer"
              title="Reset filters"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              type="submit"
              className="w-9 h-9 flex items-center justify-center bg-gradient-to-r from-[#da8cff] to-[#9a55ff] text-white rounded-[2px] shadow-xs hover:opacity-95 transition-opacity cursor-pointer"
              title="Search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#ebedf2] text-[13px] font-semibold text-[#343a40]">
                <th className="py-3.5 px-6 font-semibold">Report Number</th>
                <th className="py-3.5 px-6 font-semibold">Sticker Number</th>
                <th className="py-3.5 px-6 font-semibold">Location</th>
                <th className="py-3.5 px-6 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    Date of Examination
                  </span>
                </th>
                <th className="py-3.5 px-6 font-semibold">Inspected By</th>
                <th className="py-3.5 px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebedf2] text-[13px]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#6c757d]">
                    Loading certificates...
                  </td>
                </tr>
              ) : certificates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#6c757d]">
                    No certificates found.
                  </td>
                </tr>
              ) : (
                certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="py-3.5 px-6 text-[#343a40] font-normal whitespace-nowrap">
                      {cert.report_number}
                    </td>
                    <td className="py-3.5 px-6 text-[#6c757d] whitespace-nowrap">
                      {cert.sticker_number || "N/A"}
                    </td>
                    <td className="py-3.5 px-6 text-[#6c757d] whitespace-nowrap">
                      {cert.location || "N/A"}
                    </td>
                    <td className="py-3.5 px-6 text-[#6c757d] whitespace-nowrap">
                      {cert.selected_date}
                    </td>
                    <td className="py-3.5 px-6 text-[#6c757d] whitespace-nowrap">
                      {cert.inspected_by || cert.inspector_name || "N/A"}
                    </td>
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-3 text-[#212529]">
                        {/* Edit Action */}
                        <button
                          onClick={() => navigate(`/certificates/edit/${cert.id}`)}
                          className="p-1 hover:text-[#b66dff] transition-colors cursor-pointer"
                          title="Edit"
                          aria-label="Edit"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </button>

                        {/* PDF View Action */}
                        <button
                          onClick={() => navigate(`/viewPDF/${encodeURIComponent(cert.report_number)}`)}
                          className="p-1 hover:text-[#198ae3] transition-colors cursor-pointer flex items-center gap-0.5 text-[11px] font-semibold"
                          title="View PDF"
                          aria-label="View PDF"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                          </svg>
                          <span className="text-[9px] uppercase tracking-tighter">PDF</span>
                        </button>

                        {/* Delete Action */}
                        <button
                          onClick={() => handleDelete(cert.id, cert.report_number)}
                          className="p-1 hover:text-[#fe7c96] transition-colors cursor-pointer"
                          title="Delete"
                          aria-label="Delete"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 border-t border-[#ebedf2] flex items-center justify-end gap-3 text-[12px] text-[#6c757d]">
          <span>
            {startEntry} - {endEntry} of {total} Entries
          </span>

          <button
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="w-7 h-7 flex items-center justify-center border border-[#ced4da] rounded-[2px] bg-white text-[#495057] disabled:text-[#ced4da] disabled:cursor-not-allowed hover:bg-[#f8f9fa] cursor-pointer"
            aria-label="Previous page"
          >
            ‹
          </button>

          <select
            value={page}
            onChange={(e) => setPage(Number(e.target.value))}
            className="h-7 px-2 border border-[#ced4da] rounded-[2px] bg-white text-[#495057] text-[12px] focus:outline-none focus:border-[#b66dff]"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            className="w-7 h-7 flex items-center justify-center border border-[#ced4da] rounded-[2px] bg-white text-[#495057] disabled:text-[#ced4da] disabled:cursor-not-allowed hover:bg-[#f8f9fa] cursor-pointer"
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      </div>
    </>
  );
}