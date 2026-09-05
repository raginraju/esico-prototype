import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { CertificateRecord } from "../types/certificate";

export default function ViewPDF() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [cert, setCert] = useState<CertificateRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
      scrollContainerRef.current.scrollTop = 0;
    }

    const searchIdentifier = (id || "ESICO-LFT-R26-8941").trim();
    setLoading(true);
    setError(null);

    fetch(`/api/certificates/${encodeURIComponent(searchIdentifier)}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || json.status !== "success" || !json.data) {
          throw new Error(json.message || `Certificate '${searchIdentifier}' not found`);
        }
        setCert(json.data);
      })
      .catch((err: any) => setError(err.message || "Failed to load certificate"))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => {
    if (typeof window.print === "function") {
      window.print();
    } else {
      alert("Printing is not supported on this browser.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ede9f3] flex items-center justify-center p-4 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#9c45ff] border-t-transparent rounded-full animate-spin" />
          <p className="text-[13px] font-medium text-neutral-600">Retrieving certificate record...</p>
        </div>
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="min-h-screen bg-[#ede9f3] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-[460px] bg-white rounded-[2px] shadow-sm p-8 text-center space-y-4">
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-base font-bold">
            ✕
          </div>
          <h2 className="text-[16px] font-bold text-neutral-900">Certificate Not Found</h2>
          <p className="text-[12.5px] text-neutral-600">{error || "No record matched the provided identifier."}</p>
          <button
            onClick={() => navigate("/viewcertificates")}
            className="px-6 py-2 bg-gradient-to-r from-[#b765ff] to-[#9c45ff] text-white text-xs font-semibold rounded-[3px] shadow-sm cursor-pointer hover:opacity-95"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-pdf-container min-h-screen bg-[#ede9f3] py-4 px-2 sm:px-4 flex flex-col items-start lg:items-center">
      {/* Scroll Container (anchored top-left on mobile screens) */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto flex justify-start lg:justify-center print-wrapper"
      >
        {/* Printable Document Sheet (A4 Proportionate) */}
        <div
          id="certificate-print-sheet"
          className="w-[920px] min-w-[920px] bg-white border border-neutral-300 p-8 shadow-sm text-neutral-800 text-[10.5px] leading-[1.3] font-sans shrink-0"
        >
          {/* Header */}
          <div className="flex justify-between items-start pb-2">
            <div className="flex items-center gap-3 pt-1">
              <svg className="w-14 h-14 text-[#00623a]" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 8L15 43L30 58L50 38L70 58L85 43L50 8Z" />
                <path d="M50 92L85 57L70 42L50 62L30 42L15 57L50 92Z" />
                <path d="M42 32L24 50L42 68L48 62L36 50L48 38L42 32Z" fill="#ffffff" />
                <path d="M58 32L76 50L58 68L52 62L64 50L52 38L58 32Z" fill="#ffffff" />
              </svg>
              <span className="text-[28px] font-black tracking-tight text-neutral-900 font-sans">
                ESICO
              </span>
            </div>

            <div className="text-right">
              <h2 className="text-[1.35rem] font-bold text-neutral-900 leading-tight font-serif" dir="rtl">
                شركة مساندة الإعمار للفحص
              </h2>
              <h3 className="text-[1.35rem] font-bold text-neutral-900 leading-tight font-serif">
                Emaar Support Inspection Co.
              </h3>
              <p className="text-[9.5px] text-neutral-800 mt-1">
                6888, King Faisal Bin Abdul Aziz St, Ad Danah, Ras Tannurah, Saudi Arabia 32817
              </p>
              <p className="text-[9.5px] text-neutral-800">
                Tel : +966 507259023, +966 136670779, 055 8889186, 050 0484444
              </p>
              <p className="text-[9.5px] text-neutral-800">
                Email : info@esico.com.sa &nbsp; Website : www.esico.com.sa &nbsp; C.R : 2054100036
              </p>
            </div>
          </div>

          <div className="border-t border-neutral-800 my-1.5"></div>

          <h1 className="text-center font-bold text-[11.5px] py-0.5 tracking-tight uppercase text-neutral-900">
            {cert.certificate_title}
          </h1>

          {/* Table 1: Dates & Report Number */}
          <table className="w-full border-collapse border border-neutral-400 text-center my-1">
            <tbody>
              <tr>
                <td className="border-r border-neutral-400 py-1 px-2 w-[34%] text-neutral-800">
                  Date of thorough examination :{" "}
                  <strong className="font-bold text-neutral-900">
                    {cert.sel_date || cert.selected_date}
                  </strong>
                </td>
                <td className="border-r border-neutral-400 py-1 px-2 w-[33%] text-neutral-800">
                  Date of issue :{" "}
                  <strong className="font-bold text-neutral-900">{cert.date_of_issue}</strong>
                </td>
                <td className="py-1 px-2 text-neutral-800">
                  Report No. : <strong className="text-[#15803d] font-bold">{cert.report_number}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Table 2: Employer, Location, Sticker, Standards */}
          <table className="w-full border-collapse border border-neutral-400 text-center my-1">
            <thead>
              <tr className="border-b border-neutral-400 text-neutral-700 bg-neutral-50/50">
                <th className="border-r border-neutral-400 py-1 px-2 font-normal w-[35%]">
                  Name & Address of employer
                </th>
                <th className="border-r border-neutral-400 py-1 px-2 font-normal w-[18%]">Location</th>
                <th className="border-r border-neutral-400 py-1 px-2 font-normal w-[18%]">Sticker</th>
                <th className="py-1 px-2 font-normal">Standards</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-r border-neutral-400 py-1.5 px-2 font-bold text-neutral-900">
                  {cert.employer_name_address}
                </td>
                <td className="border-r border-neutral-400 py-1.5 px-2 font-bold text-neutral-900">
                  {cert.location}
                </td>
                <td className="border-r border-neutral-400 py-1.5 px-2 font-bold text-neutral-900">
                  {cert.sticker_number || "-"}
                </td>
                <td className="py-1.5 px-2 font-bold text-neutral-900">
                  {cert.applied_standards || "-"}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Table 3: Equipment Specifications */}
          <table className="w-full border-collapse border border-neutral-400 text-center my-1">
            <thead>
              <tr className="border-b border-neutral-400 text-neutral-700 bg-neutral-50/50">
                <th className="border-r border-neutral-400 py-1 px-2 font-normal w-[22%]">
                  Equipment Identification<br />No
                </th>
                <th className="border-r border-neutral-400 py-1 px-2 font-normal w-[36%]">
                  Equipment Description
                </th>
                <th className="border-r border-neutral-400 py-1 px-2 font-normal w-[16%]">
                  Safe Working<br />Load(s)
                </th>
                <th className="border-r border-neutral-400 py-1 px-2 font-normal w-[13%]">
                  Date of<br />Manufacture
                </th>
                <th className="py-1 px-2 font-normal">Manufacturer<br />Name</th>
              </tr>
            </thead>
            <tbody>
              <tr className="align-middle">
                <td className="border-r border-neutral-400 p-2 font-bold text-neutral-900 whitespace-pre-line leading-tight">
                  {cert.equipment_id || "-"}
                </td>
                <td className="border-r border-neutral-400 p-2 text-neutral-800 leading-snug text-left">
                  <div
                    dangerouslySetInnerHTML={{ __html: cert.equipment_description }}
                    className="font-semibold space-y-0.5"
                  />
                </td>
                <td className="border-r border-neutral-400 p-2 font-bold text-neutral-900 whitespace-pre-line leading-tight">
                  {cert.safe_working_loads || "-"}
                </td>
                <td className="border-r border-neutral-400 p-2 font-bold text-neutral-900">
                  {cert.manufacture_date || "-"}
                </td>
                <td className="p-2 font-bold text-neutral-900">
                  {cert.manufacturer_name || "-"}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Table 4: Inspection Questionnaire Checklist */}
          <table className="w-full border-collapse border border-neutral-400 text-left my-1">
            <tbody>
              <tr className="border-b border-neutral-400">
                <td className="p-1 border-r border-neutral-400 w-[42%] text-neutral-800">
                  Is this the first examination after installaton or assembly at a new site or location?
                </td>
                <td className="p-0 border-r border-neutral-400 w-[14%] text-center">
                  <div className="grid grid-cols-4 divide-x divide-neutral-400 h-full py-1 items-center">
                    <span>Yes</span>
                    <span>{cert.first_examined === "Yes" ? "✓" : "-"}</span>
                    <span>No</span>
                    <span className="flex items-center justify-center">
                      {cert.first_examined !== "Yes" ? (
                        <span className="w-3.5 h-3.5 rounded-full bg-[#dc2626] text-white flex items-center justify-center text-[9px] font-bold">
                          ✕
                        </span>
                      ) : (
                        "-"
                      )}
                    </span>
                  </div>
                </td>
                <td className="p-1 border-r border-neutral-400 w-[27%] text-neutral-800">
                  Was the examination carried out within an interval of?
                </td>
                <td className="p-1 text-center text-neutral-800 font-semibold">
                  - &nbsp; {cert.months_interval ? `${cert.months_interval} Months` : "-"}
                </td>
              </tr>

              <tr className="border-b border-neutral-400">
                <td rowSpan={2} className="p-1 border-r border-neutral-400 align-top text-neutral-800">
                  If the answer to the above question is YES, has the equipment been installed correctly?
                </td>
                <td rowSpan={2} className="p-0 border-r border-neutral-400 text-center align-middle">
                  <div className="grid grid-cols-4 divide-x divide-neutral-400 h-full py-2 items-center">
                    <span>Yes</span>
                    <span>{cert.installed_correctly === "Yes" ? "✓" : "-"}</span>
                    <span>No</span>
                    <span>{cert.installed_correctly === "No" ? "✕" : "-"}</span>
                  </div>
                </td>
                <td className="p-1 border-r border-neutral-400 text-neutral-800">
                  In accordance with an examination scheme?
                </td>
                <td className="p-0 text-center">
                  <div className="grid grid-cols-4 divide-x divide-neutral-400 h-full py-1 items-center">
                    <span>Yes</span>
                    <span className="flex items-center justify-center">
                      {cert.exam_scheme === "Yes" ? (
                        <span className="w-3.5 h-3.5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[9px] font-bold">
                          ✓
                        </span>
                      ) : (
                        "-"
                      )}
                    </span>
                    <span>No</span>
                    <span>{cert.exam_scheme === "No" ? "✕" : "-"}</span>
                  </div>
                </td>
              </tr>

              <tr className="border-b border-neutral-400">
                <td className="p-1 border-r border-neutral-400 text-neutral-800">
                  After the occurence of exceptional circumstances?
                </td>
                <td className="p-0 text-center">
                  <div className="grid grid-cols-4 divide-x divide-neutral-400 h-full py-1 items-center">
                    <span>Yes</span>
                    <span>{cert.after_occur === "Yes" ? "✓" : "-"}</span>
                    <span>No</span>
                    <span className="flex items-center justify-center">
                      {cert.after_occur !== "Yes" ? (
                        <span className="w-3.5 h-3.5 rounded-full bg-[#dc2626] text-white flex items-center justify-center text-[9px] font-bold">
                          ✕
                        </span>
                      ) : (
                        "-"
                      )}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Table 5: Defect Checks & Observations */}
          <div className="border border-neutral-400 my-1 divide-y divide-neutral-400 text-[10px]">
            <div className="p-1 text-neutral-800">
              Identification of any part found to have a defect which is or could become a danger to persons and a description of the defect (if none state NONE) :{" "}
              <b>{cert.defect || "NONE"}</b>
            </div>
            <div className="grid grid-cols-12 divide-x divide-neutral-400">
              <div className="col-span-9 p-1 text-neutral-800">
                Is the above an existing or imminent danger to persons, Note: This is a reportable defect?
              </div>
              <div className="col-span-3 p-1 text-neutral-800 font-semibold">
                {cert.iminent_danger || "No"}
              </div>
            </div>
            <div className="grid grid-cols-12 divide-x divide-neutral-400">
              <div className="col-span-6 p-1 text-neutral-800">
                Is the above a defect which is not yet could become a danger to persons (if YES state the date by when)
              </div>
              <div className="col-span-6 p-1 text-neutral-800 font-semibold">
                Yes by : {cert.defect2 || "N/A"}
              </div>
            </div>
            <div className="p-1 text-neutral-800">
              Particulars of any repair, renewal or alteration required to remedy the defect identified above :{" "}
              <b>{cert.repair_renewal || "NONE"}</b>
            </div>
            <div className="p-1 text-neutral-800">
              Particulars of any tests carried out as part of the examination (if none state NONE) :{" "}
              <b>{cert.any_tests_carried || "NONE"}</b>
            </div>
            <div className="p-1 font-bold text-neutral-900">
              Observation/additional comments relative to this thorough examination :{" "}
              <span className="font-normal">{cert.observation}</span>
            </div>
          </div>

          {/* Sign-off, QR, Stamp & Verification */}
          <div className="mt-2.5 flex justify-between items-center text-[10px]">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 border border-neutral-700 bg-white p-1 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 29 29" className="w-full h-full">
                  <rect x="0" y="0" width="7" height="7" fill="black" />
                  <rect x="1" y="1" width="5" height="5" fill="white" />
                  <rect x="2" y="2" width="3" height="3" fill="black" />
                  <rect x="22" y="0" width="7" height="7" fill="black" />
                  <rect x="23" y="1" width="5" height="5" fill="white" />
                  <rect x="24" y="2" width="3" height="3" fill="black" />
                  <rect x="0" y="22" width="7" height="7" fill="black" />
                  <rect x="1" y="23" width="5" height="5" fill="white" />
                  <rect x="2" y="24" width="3" height="3" fill="black" />
                  <rect x="9" y="3" width="2" height="2" fill="black" />
                  <rect x="13" y="2" width="2" height="2" fill="black" />
                  <rect x="17" y="4" width="2" height="2" fill="black" />
                  <rect x="8" y="9" width="3" height="2" fill="black" />
                  <rect x="12" y="11" width="2" height="3" fill="black" />
                  <rect x="16" y="8" width="3" height="2" fill="black" />
                  <rect x="10" y="15" width="2" height="3" fill="black" />
                  <rect x="14" y="16" width="3" height="2" fill="black" />
                  <rect x="18" y="14" width="2" height="3" fill="black" />
                  <rect x="22" y="11" width="3" height="2" fill="black" />
                  <rect x="11" y="22" width="2" height="2" fill="black" />
                  <rect x="15" y="24" width="3" height="2" fill="black" />
                  <rect x="22" y="22" width="4" height="2" fill="black" />
                </svg>
              </div>

              <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#1e40af] flex flex-col items-center justify-center text-[7px] font-bold text-[#1e40af] text-center rotate-[-8deg] shrink-0 select-none">
                <span className="leading-tight font-serif" dir="rtl">شركة مساندة الإعمار</span>
                <span className="text-[5.5px] tracking-tight">EMAAR SUPPORT</span>
                <span className="text-[6px] border-y border-[#1e40af] px-1 font-mono">2054100036</span>
              </div>

              <div>
                <p className="text-neutral-700 text-[9.5px]">For confirmation scan QR code</p>
                <p className="text-neutral-900 font-semibold text-[10px]">
                  search with report number : <strong className="font-bold">{cert.report_number}</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="border border-[#16a34a] px-6 py-1 rounded-[3px] flex items-center gap-1.5 text-[#16a34a] font-bold text-[11.5px]">
                <span className="w-4 h-4 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[9px]">
                  {cert.safe_to_operate === "Yes" ? "✓" : "✕"}
                </span>
                <span>{cert.safe_to_operate === "Yes" ? "Safe to operate" : "Not Safe to operate"}</span>
              </div>
              <div className="text-[#dc2626] font-bold text-[10.5px] mt-1">
                Next Inspection : {cert.nex_date || cert.next_date}
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <p className="font-medium text-neutral-900 text-[10px]">
                Inspected by : <strong className="font-bold">{cert.inspector_name}</strong>
              </p>
              <div className="mt-1 flex items-center gap-2">
                <div className="w-14 h-12 border border-[#1e40af] rounded flex flex-col items-center justify-center text-[6.5px] text-[#1e40af] font-bold rotate-2 select-none">
                  <span>ESICO</span>
                  <span>INSPECTOR</span>
                  <span className="text-[5.5px]">2054100036</span>
                </div>

                {cert.signature ? (
                  <img
                    src={`https://esicoksa.com/backend/media/signatures/${cert.signature}`}
                    alt="Inspector Signature"
                    className="max-h-10 max-w-[80px] object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <svg className="w-20 h-10 text-neutral-900" viewBox="0 0 100 40">
                    <path
                      d="M10,25 C25,5 30,35 45,15 C55,5 60,30 80,10 C90,2 75,38 95,20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Footer Badges */}
          <div className="mt-5 pt-2.5 border-t border-neutral-300 flex items-center justify-between text-[7.5px] font-bold text-neutral-700 gap-1 select-none">
            <div className="border border-neutral-400 px-1 py-0.5 text-center leading-tight">
              LEEA<br /><span className="text-[5.5px] font-normal">Full Member</span>
            </div>

            <div className="flex items-center gap-1">
              <div className="w-3.5 h-3.5 bg-[#00843D] rounded-xs flex items-center justify-center text-white text-[6px]">✦</div>
              <div className="text-left leading-tight">
                <div className="text-[7.5px] font-serif" dir="rtl">أرامكو السعودية</div>
                <div className="text-[7px] text-[#00843D] font-bold">saudi aramco</div>
                <div className="text-[6.5px] text-neutral-500 font-mono">10056897</div>
              </div>
            </div>

            <div className="border border-cyan-700 text-cyan-800 px-1 py-0.5 text-center text-[7px]">
              EP-Q4634
            </div>

            <div className="text-center leading-tight">
              <div className="text-[8px] font-black tracking-widest text-neutral-900">NEOM نيوم</div>
              <div className="text-[6px] text-neutral-500 font-mono">1100004498</div>
            </div>

            <div className="text-center leading-tight">
              <div className="text-teal-700 text-[7px]" dir="rtl">شركة المياه الوطنية</div>
              <div className="text-[5.5px] text-neutral-500">National Water Company</div>
              <div className="text-[6px] font-mono text-neutral-600">33564</div>
            </div>

            <div className="border border-amber-600 text-amber-800 rounded-full px-1.5 py-0.5 text-center text-[6.5px]">
              10739
            </div>

            <div className="text-center leading-tight">
              <div className="text-teal-600 font-black text-[9px]">سابك</div>
              <div className="text-teal-600 font-bold text-[7.5px] -mt-0.5">sabic</div>
              <div className="text-[6px] font-mono text-neutral-500">001052261</div>
            </div>

            <div className="text-center leading-tight">
              <div className="text-blue-800 text-[7px]" dir="rtl">الشركة السعودية للكهرباء</div>
              <div className="text-[5.5px] text-neutral-500">Saudi Electricity Company</div>
              <div className="text-[6px] font-mono text-neutral-600">05022531</div>
            </div>

            <div className="border-2 border-blue-900 text-blue-900 rounded-full px-1.5 py-0.5 text-center text-[7.5px] font-serif font-black tracking-tighter">
              IAF
            </div>

            <div className="border border-neutral-700 px-1 py-0.5 text-center font-serif text-[7.5px] leading-tight">
              IAS<br /><span className="text-[5px] tracking-tighter block font-sans">ACCREDITED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-5 mb-8 flex gap-3 print:hidden self-center">
        <button
          onClick={() => navigate("/viewcertificates")}
          className="px-6 py-2 bg-white hover:bg-neutral-100 text-neutral-700 font-semibold rounded-md border border-neutral-300 shadow-sm text-xs cursor-pointer transition-all"
        >
          Back to Search
        </button>
        <button
          onClick={handlePrint}
          className="px-14 py-2.5 bg-[#e5e7eb] hover:bg-[#d1d5db] active:scale-95 text-neutral-900 font-semibold rounded-md border border-neutral-300 shadow-sm text-sm cursor-pointer transition-all"
        >
          Print
        </button>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 5mm;
          }
          html, body {
            background-color: white !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            width: 100% !important;
          }
          .view-pdf-container {
            padding: 0 !important;
            background: white !important;
            min-height: auto !important;
            display: block !important;
          }
          .print-wrapper {
            overflow: visible !important;
            display: block !important;
            width: 100% !important;
          }
          #certificate-print-sheet {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
            margin: 0 auto !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            zoom: 78%;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}