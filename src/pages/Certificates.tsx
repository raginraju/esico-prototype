// src/pages/Certificates.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileCheck } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";

interface CertificateItem {
  id: string;
  reportNumber: string;
  stickerNumber: string;
  location: string;
  dateOfExamination: string;
  inspectedBy: string;
}

const INITIAL_CERTIFICATES: CertificateItem[] = [
  {
    id: "1",
    reportNumber: "ESICO-LFT-R26-10674",
    stickerNumber: "12326",
    location: "DIRIYA RIYADH",
    dateOfExamination: "2026-09-05",
    inspectedBy: "Jay Prakash",
  },
  {
    id: "2",
    reportNumber: "ESICO-LFT-R26-10673",
    stickerNumber: "12325",
    location: "RIYADH YARD",
    dateOfExamination: "2026-09-05",
    inspectedBy: "Jay Prakash",
  },
  {
    id: "3",
    reportNumber: "ESICO-LFT-R26-10964",
    stickerNumber: "12616",
    location: "JUBAIL",
    dateOfExamination: "2026-09-05",
    inspectedBy: "BUVANESH VIJAYARAYAN",
  },
  {
    id: "4",
    reportNumber: "ESICO-LFT-R26-10672",
    stickerNumber: "12324",
    location: "RIYADH",
    dateOfExamination: "2026-09-05",
    inspectedBy: "Jay Prakash",
  },
  {
    id: "5",
    reportNumber: "ESICO-LFT-030926-02",
    stickerNumber: "N/A",
    location: "AL HASA SEVEN PROJECT SITE",
    dateOfExamination: "2026-09-05",
    inspectedBy: "ANSON",
  },
  {
    id: "6",
    reportNumber: "ESICO-LFT-030926-01",
    stickerNumber: "N/A",
    location: "AL HASA SEVEN PROJECT SITE",
    dateOfExamination: "2026-09-05",
    inspectedBy: "ANSON",
  },
  {
    id: "7",
    reportNumber: "ESICO-LFT-R26-10963",
    stickerNumber: "12615",
    location: "RAS TANURA",
    dateOfExamination: "2026-09-03",
    inspectedBy: "BUVANESH VIJAYARAYAN",
  },
  {
    id: "8",
    reportNumber: "ESICO-LFT-R26-10961",
    stickerNumber: "12613",
    location: "JUBAIL",
    dateOfExamination: "2026-09-03",
    inspectedBy: "BUVANESH VIJAYARAYAN",
  },
  {
    id: "9",
    reportNumber: "ESICO-LFT-R26-10960",
    stickerNumber: "12612",
    location: "JUBAIL",
    dateOfExamination: "2026-09-03",
    inspectedBy: "BUVANESH VIJAYARAYAN",
  },
  {
    id: "10",
    reportNumber: "ESICO-LFT-R26-10959",
    stickerNumber: "12611",
    location: "JUBAIL",
    dateOfExamination: "2026-09-03",
    inspectedBy: "BUVANESH VIJAYARAYAN",
  },
];

export default function Certificates() {
  const navigate = useNavigate();
  const [certificates] = useState<CertificateItem[]>(INITIAL_CERTIFICATES);

  // Filters State
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportNumber, setReportNumber] = useState("");
  const [inspector, setInspector] = useState("");

  const handleResetFilters = () => {
    setFromDate("");
    setToDate("");
    setReportNumber("");
    setInspector("");
  };

  return (
    <>
      <PageHeader
        title="Certificates"
        icon={<FileCheck className="w-5 h-5" />}
        actionButton={{
          label: "Add New",
          onClick: () => alert("Add New Certificate"),
        }}
      />

      {/* White Card with Filters & Table */}
      <div className="bg-white rounded-[4px] shadow-[0_0_10px_rgba(0,0,0,0.03)] border border-[#ebedf2] overflow-hidden">
        {/* Filter Search Bar */}
        <div className="p-6 pb-4 flex flex-wrap items-end gap-3 text-[#495057]">
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
              onClick={handleResetFilters}
              className="w-9 h-9 flex items-center justify-center bg-[#e8eff4] text-[#6c757d] hover:bg-[#dee2e6] rounded-[2px] transition-colors cursor-pointer"
              title="Reset filters"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={() => {}}
              className="w-9 h-9 flex items-center justify-center bg-gradient-to-r from-[#da8cff] to-[#9a55ff] text-white rounded-[2px] shadow-xs hover:opacity-95 transition-opacity cursor-pointer"
              title="Search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#ebedf2] text-[13px] font-semibold text-[#343a40]">
                <th className="py-3.5 px-6 font-semibold">Report Number</th>
                <th className="py-3.5 px-6 font-semibold">Sticker Number</th>
                <th className="py-3.5 px-6 font-semibold">Location</th>
                <th className="py-3.5 px-6 font-semibold">
                  <span className="inline-flex items-center gap-1 cursor-pointer">
                    Date of Examination
                    <span className="text-[10px] text-[#adb5bd]">↑↓</span>
                  </span>
                </th>
                <th className="py-3.5 px-6 font-semibold">Inspected By</th>
                <th className="py-3.5 px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebedf2] text-[13px]">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="py-3.5 px-6 text-[#343a40] font-normal whitespace-nowrap">
                    {cert.reportNumber}
                  </td>
                  <td className="py-3.5 px-6 text-[#6c757d] whitespace-nowrap">
                    {cert.stickerNumber}
                  </td>
                  <td className="py-3.5 px-6 text-[#6c757d] whitespace-nowrap">
                    {cert.location}
                  </td>
                  <td className="py-3.5 px-6 text-[#6c757d] whitespace-nowrap">
                    {cert.dateOfExamination}
                  </td>
                  <td className="py-3.5 px-6 text-[#6c757d] whitespace-nowrap">
                    {cert.inspectedBy}
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-3 text-[#212529]">
                      {/* Edit Action */}
                      <button
                        onClick={() => alert(`Edit ${cert.reportNumber}`)}
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
                        onClick={() => navigate(`/viewPDF/${encodeURIComponent(cert.reportNumber)}`)}
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
                        onClick={() => alert(`Delete ${cert.reportNumber}`)}
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 border-t border-[#ebedf2] flex items-center justify-end gap-3 text-[12px] text-[#6c757d]">
          <span>1 - 10 of 11084 Entries</span>

          <button
            disabled
            className="w-7 h-7 flex items-center justify-center border border-[#ced4da] rounded-[2px] bg-white text-[#ced4da] cursor-not-allowed"
            aria-label="Previous page"
          >
            ‹
          </button>

          <select
            defaultValue="1"
            className="h-7 px-2 border border-[#ced4da] rounded-[2px] bg-white text-[#495057] text-[12px] focus:outline-none focus:border-[#b66dff]"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>

          <button
            className="w-7 h-7 flex items-center justify-center border border-[#ced4da] rounded-[2px] bg-white text-[#495057] hover:bg-[#f8f9fa] cursor-pointer"
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      </div>
    </>
  );
}