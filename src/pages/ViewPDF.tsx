import { useParams, useNavigate } from "react-router-dom";
import { MOCK_CERTIFICATES } from "../data/mockCertificates";

export default function ViewPDF() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cert = (id && MOCK_CERTIFICATES[id]) || MOCK_CERTIFICATES["ESICO-LFT-R26-8491"];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] py-6 px-2 sm:px-4 flex flex-col items-center print:bg-white print:p-0 print:m-0">
      {/* Scrollable Container for Mobile Screens */}
      <div className="w-full overflow-x-auto flex justify-center print:overflow-visible">
        {/* Printable Document Sheet (A4 Proportionate) */}
        <div className="w-[920px] min-w-[920px] bg-white border border-neutral-300 p-8 shadow-sm text-neutral-800 text-[10.5px] leading-[1.3] font-sans print:border-none print:shadow-none print:p-0 print:w-full print:min-w-0">
          
          {/* Header */}
          <div className="flex justify-between items-start pb-2">
            {/* Logo */}
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

            {/* Company Bilingual Details */}
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

          {/* Certificate Title */}
          <h1 className="text-center font-bold text-[11.5px] py-0.5 tracking-tight uppercase text-neutral-900">
            CERTIFICATE OF THOROUGH EXAMINATION AND / OR TEST OF EARTH MOVING EQUIPMENTS
          </h1>

          {/* Table 1: Dates & Report Number */}
          <table className="w-full border-collapse border border-neutral-400 text-center my-1">
            <tbody>
              <tr>
                <td className="border-r border-neutral-400 py-1 px-2 w-[34%] text-neutral-800">
                  Date of thorough examination : <strong className="font-bold text-neutral-900">{cert.examDate}</strong>
                </td>
                <td className="border-r border-neutral-400 py-1 px-2 w-[33%] text-neutral-800">
                  Date of issue : <strong className="font-bold text-neutral-900">{cert.issueDate}</strong>
                </td>
                <td className="py-1 px-2 text-neutral-800">
                  Report No. : <strong className="text-[#15803d] font-bold">{cert.reportNo}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Table 2: Employer, Location, Sticker, Standards */}
          <table className="w-full border-collapse border border-neutral-400 text-center my-1">
            <thead>
              <tr className="border-b border-neutral-400 text-neutral-700 bg-neutral-50/50">
                <th className="border-r border-neutral-400 py-1 px-2 font-normal w-[35%]">Name & Address of employer</th>
                <th className="border-r border-neutral-400 py-1 px-2 font-normal w-[18%]">Location</th>
                <th className="border-r border-neutral-400 py-1 px-2 font-normal w-[18%]">Sticker</th>
                <th className="py-1 px-2 font-normal">Standards</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-r border-neutral-400 py-1.5 px-2 font-bold text-neutral-900">{cert.employer}</td>
                <td className="border-r border-neutral-400 py-1.5 px-2 font-bold text-neutral-900">{cert.location}</td>
                <td className="border-r border-neutral-400 py-1.5 px-2 font-bold text-neutral-900">{cert.sticker}</td>
                <td className="py-1.5 px-2 font-bold text-neutral-900">{cert.standards}</td>
              </tr>
            </tbody>
          </table>

          {/* Table 3: Equipment Specifications */}
          <table className="w-full border-collapse border border-neutral-400 text-center my-1">
            <thead>
              <tr className="border-b border-neutral-400 text-neutral-700 bg-neutral-50/50">
                <th className="border-r border-neutral-400 py-1 px-2 font-normal w-[22%]">Equipment Identification<br />No</th>
                <th className="border-r border-neutral-400 py-1 px-2 font-normal w-[36%]">Equipment Description</th>
                <th className="border-r border-neutral-400 py-1 px-2 font-normal w-[16%]">Safe Working<br />Load(s)</th>
                <th className="border-r border-neutral-400 py-1 px-2 font-normal w-[13%]">Date of<br />Manufacture</th>
                <th className="py-1 px-2 font-normal">Manufacturer<br />Name</th>
              </tr>
            </thead>
            <tbody>
              <tr className="align-middle">
                <td className="border-r border-neutral-400 p-2 font-bold text-neutral-900 whitespace-pre-line leading-tight">
                  {cert.equipmentId}
                </td>
                <td className="border-r border-neutral-400 p-2 text-neutral-800 leading-snug">
                  <div className="font-bold text-neutral-900">{cert.equipmentDesc.title}</div>
                  <div>Model: {cert.equipmentDesc.model}</div>
                  <div>Operating Mass: {cert.equipmentDesc.operatingMass}</div>
                  <div>Static Liner Load: {cert.equipmentDesc.staticLinerLoad}</div>
                  <div>Compaction Width: {cert.equipmentDesc.compactionWidth}</div>
                </td>
                <td className="border-r border-neutral-400 p-2 font-bold text-neutral-900 whitespace-pre-line leading-tight">
                  {cert.safeWorkingLoad}
                </td>
                <td className="border-r border-neutral-400 p-2 font-bold text-neutral-900">
                  {cert.manufactureDate}
                </td>
                <td className="p-2 font-bold text-neutral-900">
                  {cert.manufacturer}
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
                    <span>-</span>
                    <span>No</span>
                    <span className="flex items-center justify-center">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#dc2626] text-white flex items-center justify-center text-[9px] font-bold">✕</span>
                    </span>
                  </div>
                </td>
                <td className="p-1 border-r border-neutral-400 w-[27%] text-neutral-800">
                  Was the examination carried out within an interval of?
                </td>
                <td className="p-1 text-center text-neutral-800">
                  - &nbsp; 12 Months
                </td>
              </tr>

              <tr className="border-b border-neutral-400">
                <td rowSpan={2} className="p-1 border-r border-neutral-400 align-top text-neutral-800">
                  If the answer to the above question is YES, has the equipment been installed correctly?
                </td>
                <td rowSpan={2} className="p-0 border-r border-neutral-400 text-center align-middle">
                  <div className="grid grid-cols-4 divide-x divide-neutral-400 h-full py-2 items-center">
                    <span>Yes</span>
                    <span>-</span>
                    <span>No</span>
                    <span>-</span>
                  </div>
                </td>
                <td className="p-1 border-r border-neutral-400 text-neutral-800">
                  In accordance with an examination scheme?
                </td>
                <td className="p-0 text-center">
                  <div className="grid grid-cols-4 divide-x divide-neutral-400 h-full py-1 items-center">
                    <span>Yes</span>
                    <span className="flex items-center justify-center">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                    </span>
                    <span>No</span>
                    <span>-</span>
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
                    <span>-</span>
                    <span>No</span>
                    <span className="flex items-center justify-center">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#dc2626] text-white flex items-center justify-center text-[9px] font-bold">✕</span>
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Table 5: Defect Checks & Observations */}
          <div className="border border-neutral-400 my-1 divide-y divide-neutral-400 text-[10px]">
            <div className="p-1 text-neutral-800">
              Identification of any part found to have a defect which is or could become a danger to persons and a description of the defect (if none state NONE) : NONE
            </div>
            <div className="grid grid-cols-12 divide-x divide-neutral-400">
              <div className="col-span-9 p-1 text-neutral-800">
                Is the above an existing or imminent danger to persons, Note: This is a reportable defect?
              </div>
              <div className="col-span-3 p-1 text-neutral-800">
                N/A
              </div>
            </div>
            <div className="grid grid-cols-12 divide-x divide-neutral-400">
              <div className="col-span-6 p-1 text-neutral-800">
                Is the above a defect which is not yet could become a danger to persons (if YES state the date by when)
              </div>
              <div className="col-span-6 p-1 text-neutral-800">
                Yes by : N/A
              </div>
            </div>
            <div className="p-1 text-neutral-800">
              Particulars of any repair, renewal or alteration required to remedy the defect identified above : N/A
            </div>
            <div className="p-1 text-neutral-800">
              Particulars of any tests carried out as part of the examination (if none state NONE) : NONE
            </div>
            <div className="p-1 font-bold text-neutral-900">
              Observation/additional comments relative to this thorough examination : No defects found at the time of inspection.
            </div>
          </div>

          {/* Sign-off, QR, Stamp & Verification */}
          <div className="mt-2.5 flex justify-between items-center text-[10px]">
            {/* Left: QR Code + Stamp + Search text */}
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

              {/* Blue Circular Stamp */}
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#1e40af] flex flex-col items-center justify-center text-[7px] font-bold text-[#1e40af] text-center rotate-[-8deg] shrink-0 select-none">
                <span className="leading-tight font-serif" dir="rtl">شركة مساندة الإعمار</span>
                <span className="text-[5.5px] tracking-tight">EMAAR SUPPORT</span>
                <span className="text-[6px] border-y border-[#1e40af] px-1 font-mono">2054100036</span>
              </div>

              <div>
                <p className="text-neutral-700 text-[9.5px]">For confirmation scan QR code</p>
                <p className="text-neutral-900 font-semibold text-[10px]">
                  search with report number : <strong className="font-bold">{cert.reportNo}</strong>
                </p>
              </div>
            </div>

            {/* Center: Status Box */}
            <div className="flex flex-col items-center">
              <div className="border border-[#16a34a] px-6 py-1 rounded-[3px] flex items-center gap-1.5 text-[#16a34a] font-bold text-[11.5px]">
                <span className="w-4 h-4 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[9px]">✓</span>
                <span>Safe to operate</span>
              </div>
              <div className="text-[#dc2626] font-bold text-[10.5px] mt-1">
                Next Inspection : {cert.nextInspectionDate}
              </div>
            </div>

            {/* Right: Inspector Sign-off & Badge */}
            <div className="text-right flex flex-col items-end">
              <p className="font-medium text-neutral-900 text-[10px]">
                Inspected by : <strong className="font-bold">{cert.inspectorName}</strong>
              </p>
              <div className="mt-1 flex items-center gap-2">
                {/* Triangular / Diamond Inspector Stamp */}
                <div className="w-14 h-12 border border-[#1e40af] rounded flex flex-col items-center justify-center text-[6.5px] text-[#1e40af] font-bold rotate-2 select-none">
                  <span>ESICO</span>
                  <span>INSPECTOR</span>
                  <span className="text-[5.5px]">2054100036</span>
                </div>

                {/* Vector Cursive Signature */}
                <svg className="w-20 h-10 text-neutral-900" viewBox="0 0 100 40">
                  <path
                    d="M10,25 C25,5 30,35 45,15 C55,5 60,30 80,10 C90,2 75,38 95,20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Partner & Accreditation Logos Footer */}
          <div className="mt-5 pt-2.5 border-t border-neutral-300 flex items-center justify-between text-[7.5px] font-bold text-neutral-700 gap-1 select-none">
            {/* LEEA */}
            <div className="border border-neutral-400 px-1 py-0.5 text-center leading-tight">
              LEEA<br /><span className="text-[5.5px] font-normal">Full Member</span>
            </div>

            {/* Saudi Aramco */}
            <div className="flex items-center gap-1">
              <div className="w-3.5 h-3.5 bg-[#00843D] rounded-xs flex items-center justify-center text-white text-[6px]">✦</div>
              <div className="text-left leading-tight">
                <div className="text-[7.5px] font-serif" dir="rtl">أرامكو السعودية</div>
                <div className="text-[7px] text-[#00843D] font-bold">saudi aramco</div>
                <div className="text-[6.5px] text-neutral-500 font-mono">10056897</div>
              </div>
            </div>

            {/* EP-Q4634 */}
            <div className="border border-cyan-700 text-cyan-800 px-1 py-0.5 text-center text-[7px]">
              EP-Q4634
            </div>

            {/* NEOM */}
            <div className="text-center leading-tight">
              <div className="text-[8px] font-black tracking-widest text-neutral-900">NEOM نيوم</div>
              <div className="text-[6px] text-neutral-500 font-mono">1100004498</div>
            </div>

            {/* NWC */}
            <div className="text-center leading-tight">
              <div className="text-teal-700 text-[7px]" dir="rtl">شركة المياه الوطنية</div>
              <div className="text-[5.5px] text-neutral-500">National Water Company</div>
              <div className="text-[6px] font-mono text-neutral-600">33564</div>
            </div>

            {/* Saudi Government Shield 10739 */}
            <div className="border border-amber-600 text-amber-800 rounded-full px-1.5 py-0.5 text-center text-[6.5px]">
              10739
            </div>

            {/* SABIC */}
            <div className="text-center leading-tight">
              <div className="text-teal-600 font-black text-[9px]">سابك</div>
              <div className="text-teal-600 font-bold text-[7.5px] -mt-0.5">sabic</div>
              <div className="text-[6px] font-mono text-neutral-500">001052261</div>
            </div>

            {/* Saudi Electricity Company */}
            <div className="text-center leading-tight">
              <div className="text-blue-800 text-[7px]" dir="rtl">الشركة السعودية للكهرباء</div>
              <div className="text-[5.5px] text-neutral-500">Saudi Electricity Company</div>
              <div className="text-[6px] font-mono text-neutral-600">05022531</div>
            </div>

            {/* IAF */}
            <div className="border-2 border-blue-900 text-blue-900 rounded-full px-1.5 py-0.5 text-center text-[7.5px] font-serif font-black tracking-tighter">
              IAF
            </div>

            {/* IAS */}
            <div className="border border-neutral-700 px-1 py-0.5 text-center font-serif text-[7.5px] leading-tight">
              IAS<br /><span className="text-[5px] tracking-tighter block font-sans">ACCREDITED</span>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Buttons (Hidden when printing) */}
      <div className="mt-5 flex gap-3 print:hidden">
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

      {/* Embedded Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 6mm 8mm;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            background-color: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}