// src/pages/ViewPDF.tsx
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Download } from "lucide-react";
import html2pdf from "html2pdf.js";
import type { CertificateRecord } from "../types/certificate";
import { authHeaders } from "../lib/utils";

async function generateCertificatePdf(sheet: HTMLElement, reportNumber: string) {
  await document.fonts.ready;
  const images = Array.from(sheet.querySelectorAll("img"));
  await Promise.all(
    images.map(async (image) => {
      if (!image.complete) {
        await new Promise<void>((resolve) => {
          image.addEventListener("load", () => resolve(), { once: true });
          image.addEventListener("error", () => resolve(), { once: true });
        });
      }
    })
  );

  const elements = [sheet, ...Array.from(sheet.querySelectorAll<HTMLElement>("*"))];
  const originalStyles = elements.map((element) => element.getAttribute("style"));
  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = 1;
  colorCanvas.height = 1;
  const colorContext = colorCanvas.getContext("2d", { willReadFrequently: true });
  if (!colorContext) throw new Error("Could not prepare PDF color conversion");
  const normalizedColorCache = new Map<string, string>();
  const normalizeColors = (value: string) => value.replace(/oklch\([^)]*\)/gi, (color) => {
    const normalized = normalizedColorCache.get(color);
    if (normalized) return normalized;

    colorContext.clearRect(0, 0, 1, 1);
    colorContext.fillStyle = color;
    colorContext.fillRect(0, 0, 1, 1);
    const [red, green, blue, alpha] = colorContext.getImageData(0, 0, 1, 1).data;
    const rgb = `rgba(${red}, ${green}, ${blue}, ${(alpha / 255).toFixed(3)})`;
    normalizedColorCache.set(color, rgb);
    return rgb;
  });

  try {
    elements.forEach((element, index) => {
      const computed = window.getComputedStyle(element);
      const declarations: string[] = [];
      for (let propertyIndex = 0; propertyIndex < computed.length; propertyIndex += 1) {
        const property = computed.item(propertyIndex);
        const value = computed.getPropertyValue(property);
        if (value) declarations.push(`${property}:${normalizeColors(value)}`);
      }
      element.setAttribute("style", [originalStyles[index], ...declarations].filter(Boolean).join(";"));
    });

    return await html2pdf()
      .set({
        margin: 0,
        filename: `${reportNumber}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          onclone: (clonedDocument: Document) => {
            clonedDocument.querySelectorAll("style").forEach((style) => style.remove());
            clonedDocument.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]').forEach((link) => {
              if (new URL(link.href).origin === window.location.origin) link.remove();
            });
          },
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(sheet)
      .outputPdf("blob");
  } finally {
    elements.forEach((element, index) => {
      const originalStyle = originalStyles[index];
      if (originalStyle === null) {
        element.removeAttribute("style");
      } else {
        element.setAttribute("style", originalStyle);
      }
    });
  }
}

export default function ViewPDF() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pdfUploadStartedForRef = useRef<string | null>(null);
  const isCreateFlow = Boolean(location.state?.uploadPdf);

  const [cert, setCert] = useState<CertificateRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState<boolean>(true);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    window.scrollTo(0, 0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
      scrollContainerRef.current.scrollTop = 0;
    }

    const searchIdentifier = (id || "ESICO-LFT-R26-8941").trim();
    setLoading(true);
    setError(null);

    const headers = authHeaders();
    const request = Object.keys(headers).length
      ? fetch(`/api/certificates/${encodeURIComponent(searchIdentifier)}`, {
          headers,
          signal: controller.signal,
        })
      : fetch(`/api/certificates/${encodeURIComponent(searchIdentifier)}`, {
          signal: controller.signal,
        });

    request
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || json.status !== "success" || !json.data) {
          throw new Error(json.message || `Certificate '${searchIdentifier}' not found`);
        }
        setCert(json.data);
      })
      .catch((err: any) => {
        if (err.name !== "AbortError") setError(err.message || "Failed to load certificate");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (!cert) return;
    if (isCreateFlow && pdfUploadStartedForRef.current === cert.id) return;

    const controller = new AbortController();
    let createdObjectUrl: string | null = null;
    setPdfLoading(true);
    setPdfError(null);

    const loadPdf = async () => {
      try {
        if (isCreateFlow) {
          pdfUploadStartedForRef.current = cert.id;
          const sheet = document.getElementById("certificate-print-sheet");
          if (!sheet) throw new Error("Certificate sheet is not ready for PDF generation");

          const generatedPdf = await generateCertificatePdf(sheet, cert.report_number);
          const formData = new FormData();
          formData.append("file", generatedPdf, `${cert.report_number}.pdf`);
          const uploadResponse = await fetch(`/api/certificates/${encodeURIComponent(cert.id)}/pdf`, {
            method: "POST",
            headers: authHeaders(),
            body: formData,
          });
          if (!uploadResponse.ok) throw new Error("Failed to save certificate PDF");
        }

        const headers = authHeaders();
        const response = await fetch(`/api/certificates/${encodeURIComponent(cert.id)}/pdf`, {
          headers,
          signal: isCreateFlow ? undefined : controller.signal,
        });
        if (!response.ok) throw new Error("Certificate PDF not found");

        createdObjectUrl = URL.createObjectURL(await response.blob());
        setPdfUrl(createdObjectUrl);
      } catch (error) {
        if (!controller.signal.aborted) {
          setPdfError(error instanceof Error ? error.message : "Failed to load certificate PDF");
        }
      } finally {
        if (!controller.signal.aborted) setPdfLoading(false);
      }
    };

    void loadPdf();
    return () => {
      if (!isCreateFlow) controller.abort();
      if (createdObjectUrl) URL.revokeObjectURL(createdObjectUrl);
    };
  }, [cert, isCreateFlow]);

  if (loading || (cert && pdfLoading && !isCreateFlow)) {
    return (
      <div className="min-h-screen bg-[#ede9f3] flex items-center justify-center p-4 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#00623a] border-t-transparent rounded-full animate-spin" />
          <p className="text-[13px] font-medium text-neutral-600">Retrieving certificate record...</p>
        </div>
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="min-h-screen bg-[#ede9f3] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-[460px] bg-white rounded shadow-sm p-8 text-center space-y-4">
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-base font-bold">
            ✕
          </div>
          <h2 className="text-[16px] font-bold text-neutral-900">Certificate Not Found</h2>
          <p className="text-[12.5px] text-neutral-600">{error || "No record matched the provided identifier."}</p>
          <button
            onClick={() => navigate("/viewcertificates")}
            className="px-6 py-2 bg-[#00623a] text-white text-xs font-semibold rounded shadow-sm hover:bg-[#004d2e]"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  if (pdfError) {
    return (
      <div className="min-h-screen bg-[#ede9f3] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-[460px] bg-white rounded shadow-sm p-8 text-center space-y-4">
          <h2 className="text-[16px] font-bold text-neutral-900">Certificate PDF Unavailable</h2>
          <p className="text-[12.5px] text-neutral-600">{pdfError}</p>
          <button
            onClick={() => navigate("/viewcertificates")}
            className="px-6 py-2 bg-[#00623a] text-white text-xs font-semibold rounded shadow-sm hover:bg-[#004d2e]"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(
    window.location.origin + `/viewcertificates?id=${cert.report_number}`
  )}`;
  const isPreparingPdf = isCreateFlow && pdfLoading && !pdfUrl;

  return (
    <>
    {isPreparingPdf && (
      <div className="min-h-screen bg-[#ece8f2] flex flex-col items-center justify-center gap-3 p-4 font-sans">
        <div className="w-8 h-8 border-4 border-[#00623a] border-t-transparent rounded-full animate-spin" />
        <p className="text-[13px] font-medium text-neutral-600">Preparing certificate PDF...</p>
        <button
          onClick={() => navigate("/viewcertificates")}
          className="mt-2 px-5 py-2 bg-white text-neutral-700 font-semibold rounded border border-neutral-300 text-xs"
        >
          Back to Search
        </button>
      </div>
    )}
    <div
      aria-hidden="true"
      className="view-pdf-container min-h-screen bg-[#ece8f2] py-6 px-2 sm:px-4 flex flex-col items-center"
      style={isPreparingPdf ? { position: "fixed", left: 0, top: 0, opacity: 0, pointerEvents: "none", zIndex: -1 } : { display: "none" }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap"
      />

      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto flex justify-start lg:justify-center print-wrapper"
      >
        {/* Strict A4 Portrait Dimensions (794px width matches 210mm at 96 DPI) */}
        <div
          id="certificate-print-sheet"
          className="w-[794px] min-w-[794px] bg-white border border-neutral-300 p-8 shadow-sm text-neutral-900 text-[10px] leading-[1.25] shrink-0 font-['Ubuntu',sans-serif]"
        >
          {/* Header */}
          <div className="flex justify-between items-start pb-2">
            <div className="pt-0.5">
              <img
                src="/assets/esico-logo-letters.png"
                alt="ESICO Logo"
                className="h-14 object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>

            <div className="text-right">
              <h2 className="text-[1.32rem] font-bold text-black leading-tight" dir="rtl">
                شركة مساندة الإعمار للفحص
              </h2>
              <h3 className="text-[1.3rem] font-bold text-black leading-tight">
                Emaar Support Inspection Co.
              </h3>
              <p className="text-[8.5px] text-neutral-800 mt-0.5">
                6888, King Faisal Bin Abdul Aziz St, Ad Danah, Ras Tannurah, Saudi Arabia 32817
              </p>
              <p className="text-[8.5px] text-neutral-800">
                Tel : +966 507259023, +966 136670779, 055 8889186, 050 0484444
              </p>
              <p className="text-[8.5px] text-neutral-800">
                Email : info@esico.com.sa &nbsp; Website : www.esico.com.sa &nbsp; C.R : 2054100036
              </p>
            </div>
          </div>

          <div className="border-t-[1.5px] border-black my-2"></div>

          {/* Certificate Title */}
          <h1 className="text-center font-bold text-[11.5px] tracking-tight uppercase text-black mb-2">
            {cert.certificate_title}
          </h1>

          {/* Table 1: Dates & Report Number */}
          <table className="w-full border-collapse border border-neutral-500 text-center mb-1">
            <tbody>
              <tr>
                <td className="border border-neutral-500 py-1.5 px-2 w-[35%] text-neutral-800">
                  Date of thorough examination :{" "}
                  <strong className="font-bold text-black">{cert.sel_date || cert.selected_date}</strong>
                </td>
                <td className="border border-neutral-500 py-1.5 px-2 w-[30%] text-neutral-800">
                  Date of issue : <strong className="font-bold text-black">{cert.date_of_issue}</strong>
                </td>
                <td className="border border-neutral-500 py-1.5 px-2 w-[35%] text-neutral-800">
                  Report No. :{" "}
                  <strong className="text-[#37b420] font-bold">{cert.report_number}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Table 2: Employer, Location, Sticker, Standards */}
          <table className="w-full border-collapse border border-neutral-500 text-center mb-1">
            <thead>
              <tr className="border-b border-neutral-500 text-neutral-700">
                <th className="border border-neutral-500 py-1 px-2 font-normal w-[35%]">
                  Name & Address of employer
                </th>
                <th className="border border-neutral-500 py-1 px-2 font-normal w-[15%]">Location</th>
                <th className="border border-neutral-500 py-1 px-2 font-normal w-[15%]">Sticker</th>
                <th className="border border-neutral-500 py-1 px-2 font-normal w-[35%]">Standards</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-neutral-500 py-1.5 px-2 font-bold text-black">
                  {cert.employer_name_address}
                </td>
                <td className="border border-neutral-500 py-1.5 px-2 font-bold text-black">
                  {cert.location}
                </td>
                <td className="border border-neutral-500 py-1.5 px-2 font-bold text-black">
                  {cert.sticker_number || "-"}
                </td>
                <td className="border border-neutral-500 py-1.5 px-2 font-bold text-black">
                  {cert.applied_standards || "-"}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Table 3: Equipment Specifications (Locked height: 150px to guarantee portrait layout) */}
          <table className="w-full border-collapse border border-neutral-500 text-center mb-1">
            <thead>
              <tr className="border-b border-neutral-500 text-neutral-700">
                <th className="border border-neutral-500 py-1 px-1 font-normal w-[22%]">
                  Equipment Identification
                  <br />
                  No
                </th>
                <th className="border border-neutral-500 py-1 px-2 font-normal w-[34%]">
                  Equipment Description
                </th>
                <th className="border border-neutral-500 py-1 px-1 font-normal w-[15%]">
                  Safe Working
                  <br />
                  Load(s)
                </th>
                <th className="border border-neutral-500 py-1 px-1 font-normal w-[14%]">
                  Date of
                  <br />
                  Manufacture
                </th>
                <th className="border border-neutral-500 py-1 px-1 font-normal w-[15%]">
                  Manufacturer
                  <br />
                  Name
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="align-middle" style={{ height: "150px" }}>
                <td className="border border-neutral-500 p-2 font-bold text-black text-center align-middle">
                  {cert.equipment_id || "-"}
                </td>
                <td className="border border-neutral-500 p-2 text-black leading-[1.35] text-left align-middle">
                  <div
                    dangerouslySetInnerHTML={{ __html: cert.equipment_description }}
                    className="font-bold uppercase text-[9.5px]"
                  />
                </td>
                <td className="border border-neutral-500 p-2 font-bold text-black align-middle">
                  {cert.safe_working_loads || "-"}
                </td>
                <td className="border border-neutral-500 p-2 font-bold text-black align-middle">
                  {cert.manufacture_date || "-"}
                </td>
                <td className="border border-neutral-500 p-2 font-bold text-black align-middle">
                  {cert.manufacturer_name || "-"}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Table 4: Inspection Questionnaire Checklist */}
          <div className="w-full border border-neutral-500 mb-1 grid grid-cols-2 divide-x divide-neutral-500">
            {/* Left Column (2 Questions) */}
            <div className="flex flex-col justify-around py-1.5 px-1 gap-2">
              {/* Question 1 */}
              <div className="flex justify-between items-center pl-1">
                <div className="text-neutral-800 text-[9.5px] leading-snug">
                  Is this the first examination after<br />installaton or assembly at a new site<br />or location?
                </div>
                <div className="flex border border-neutral-400 text-center text-[9.5px] divide-x divide-neutral-400 w-[120px] h-[26px] items-center shrink-0 mr-1 bg-white">
                  <div className="w-1/4 h-full flex items-center justify-center">Yes</div>
                  <div className="w-1/4 h-full flex items-center justify-center">
                    {cert.first_examined === "Yes" ? (
                      <span className="w-3.5 h-3.5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[8px] font-bold">✓</span>
                    ) : (
                      "-"
                    )}
                  </div>
                  <div className="w-1/4 h-full flex items-center justify-center">No</div>
                  <div className="w-1/4 h-full flex items-center justify-center">
                    {cert.first_examined !== "Yes" ? (
                      <span className="w-3.5 h-3.5 rounded-full bg-[#cc0000] text-white flex items-center justify-center text-[8px] font-bold">✕</span>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
              </div>

              {/* Question 2 */}
              <div className="flex justify-between items-center pl-1">
                <div className="text-neutral-800 text-[9.5px] leading-snug">
                  If the answer to the above question is<br />YES, has the equipment been<br />installed correctly?
                </div>
                <div className="flex border border-neutral-400 text-center text-[9.5px] divide-x divide-neutral-400 w-[120px] h-[26px] items-center shrink-0 mr-1 bg-white">
                  <div className="w-1/4 h-full flex items-center justify-center">Yes</div>
                  <div className="w-1/4 h-full flex items-center justify-center">
                    {cert.installed_correctly === "Yes" ? (
                      <span className="w-3.5 h-3.5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[8px] font-bold">✓</span>
                    ) : (
                      "-"
                    )}
                  </div>
                  <div className="w-1/4 h-full flex items-center justify-center">No</div>
                  <div className="w-1/4 h-full flex items-center justify-center">
                    {cert.installed_correctly === "No" ? (
                      <span className="w-3.5 h-3.5 rounded-full bg-[#cc0000] text-white flex items-center justify-center text-[8px] font-bold">✕</span>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (3 Questions) */}
            <div className="flex flex-col justify-around py-1.5 px-1 gap-1.5">
              {/* Question 3 */}
              <div className="flex justify-between items-center pl-1">
                <div className="text-neutral-800 text-[9.5px] leading-snug">
                  Was the examination carried out<br />within an interval of?
                </div>
                <div className="w-[120px] text-center font-normal text-neutral-900 text-[9.5px] mr-1">
                  - &nbsp; {cert.months_interval ? `${cert.months_interval} Months` : "-"}
                </div>
              </div>

              {/* Question 4 */}
              <div className="flex justify-between items-center pl-1">
                <div className="text-neutral-800 text-[9.5px] leading-snug">
                  In accordance with an examination<br />scheme?
                </div>
                <div className="flex border border-neutral-400 text-center text-[9.5px] divide-x divide-neutral-400 w-[120px] h-[26px] items-center shrink-0 mr-1 bg-white">
                  <div className="w-1/4 h-full flex items-center justify-center">Yes</div>
                  <div className="w-1/4 h-full flex items-center justify-center">
                    {cert.exam_scheme === "Yes" ? (
                      <span className="w-3.5 h-3.5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[8px] font-bold">✓</span>
                    ) : (
                      "-"
                    )}
                  </div>
                  <div className="w-1/4 h-full flex items-center justify-center">No</div>
                  <div className="w-1/4 h-full flex items-center justify-center">
                    {cert.exam_scheme === "No" ? (
                      <span className="w-3.5 h-3.5 rounded-full bg-[#cc0000] text-white flex items-center justify-center text-[8px] font-bold">✕</span>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
              </div>

              {/* Question 5 */}
              <div className="flex justify-between items-center pl-1">
                <div className="text-neutral-800 text-[9.5px] leading-snug">
                  After the occurence of exceptional<br />circumstances?
                </div>
                <div className="flex border border-neutral-400 text-center text-[9.5px] divide-x divide-neutral-400 w-[120px] h-[26px] items-center shrink-0 mr-1 bg-white">
                  <div className="w-1/4 h-full flex items-center justify-center">Yes</div>
                  <div className="w-1/4 h-full flex items-center justify-center">
                    {cert.after_occur === "Yes" ? (
                      <span className="w-3.5 h-3.5 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[8px] font-bold">✓</span>
                    ) : (
                      "-"
                    )}
                  </div>
                  <div className="w-1/4 h-full flex items-center justify-center">No</div>
                  <div className="w-1/4 h-full flex items-center justify-center">
                    {cert.after_occur !== "Yes" ? (
                      <span className="w-3.5 h-3.5 rounded-full bg-[#cc0000] text-white flex items-center justify-center text-[8px] font-bold">✕</span>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table 5: Defect Checks & Observations */}
          <table className="w-full border-collapse border border-neutral-500 mb-2 text-[9.5px]">
            <tbody>
              <tr className="border-b border-neutral-500">
                <td colSpan={2} className="p-1.5 text-neutral-800">
                  Identification of any part found to have a defect which is or could become a danger to
                  persons and a description of the defect (if none state NONE) :{" "}
                  <b>{cert.defect || "NONE"}</b>
                </td>
              </tr>
              <tr className="border-b border-neutral-500">
                <td className="p-1.5 border-r border-neutral-500 text-neutral-800 w-[80%]">
                  Is the above an existing or imminent danger to persons, Note: This is a reportable defect?
                </td>
                <td className="p-1.5 text-center font-bold text-neutral-900 w-[20%]">
                  {cert.iminent_danger || "No"}
                </td>
              </tr>
              <tr className="border-b border-neutral-500">
                <td className="p-1.5 border-r border-neutral-500 text-neutral-800 w-[50%]">
                  Is the above a defect which is not yet could become a danger to persons (if YES state the
                  date by when)
                </td>
                <td className="p-1.5 text-left font-bold text-neutral-900 pl-4 w-[50%]">
                  Yes by : {cert.defect2 || "N/A"}
                </td>
              </tr>
              <tr className="border-b border-neutral-500">
                <td colSpan={2} className="p-1.5 text-neutral-800">
                  Particulars of any repair, renewal or alteration required to remedy the defect identified
                  above : <b>{cert.repair_renewal || "NONE"}</b>
                </td>
              </tr>
              <tr className="border-b border-neutral-500">
                <td colSpan={2} className="p-1.5 text-neutral-800">
                  Particulars of any tests carried out as part of the examination (if none state NONE) :{" "}
                  <b>{cert.any_tests_carried || "NONE"}</b>
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="p-1.5 font-bold text-black leading-tight">
                  Observation/additional comments relative to this thorough examination :{" "}
                  {cert.observation}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Verification & Sign-off Block */}
          <div className="pt-2 flex justify-between items-center text-[10px]">
            {/* Left: QR + QA/QC Stamp */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1.5">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-[72px] h-[72px] object-contain border border-neutral-200"
                />
                <div className="relative w-[72px] h-[72px] flex items-center justify-center">
                  <img
                    src="/assets/qa-qc.png"
                    alt="QA QC Seal"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <img
                    src="/assets/signature.png"
                    alt="QC Signature"
                    className="absolute inset-0 m-auto w-10 h-10 object-contain mix-blend-multiply opacity-90"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              </div>

              <p className="text-neutral-700 text-[8.5px] mt-1 leading-tight">
                For confirmation scan QR code
                <br />
                search with report number :{" "}
                <strong className="font-bold text-black">{cert.report_number}</strong>
              </p>
            </div>

            {/* Middle: Safe to operate badge & Next Inspection */}
            <div className="flex flex-col items-center">
              <div className="border border-[#16a34a] px-5 py-1.5 rounded-[3px] flex items-center gap-2 text-[#16a34a] font-bold text-[13px] bg-white">
                <span className="w-4 h-4 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[9px] font-bold">
                  ✓
                </span>
                <span>Safe to operate</span>
              </div>
              <div className="text-[#dc2626] font-bold text-[11px] mt-2">
                Next Inspection : {cert.nex_date || cert.next_date}
              </div>
            </div>

            {/* Right: Inspector Details, Seal & Signature */}
            <div className="flex flex-col items-end">
              <p className="font-normal text-black text-[11px] mb-1">
                Inspected by : <span className="font-bold">{cert.inspector_name}</span>
              </p>
              <div className="relative w-28 h-20 flex items-center justify-end">
                <img
                  src="/assets/inspector-seal.png"
                  alt="Inspector Seal"
                  className="w-20 h-20 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                {cert.signature ? (
                  <img
                    src={`https://esicoksa.com/backend/media/signatures/${cert.signature}`}
                    alt="Inspector Signature"
                    className="absolute -right-2 bottom-0 w-24 h-16 object-contain mix-blend-multiply"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <img
                    src="/assets/signature.png"
                    alt="Inspector Signature"
                    className="absolute -right-2 bottom-0 w-24 h-16 object-contain mix-blend-multiply"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Footer Accreditation Logos */}
          <div className="pt-3 mt-2 flex items-center justify-between gap-1.5 select-none">
            <img src="/assets/leea.png" alt="LEEA" className="h-[38px] max-w-[68px] object-contain" />
            <img src="/assets/aramco.png" alt="Saudi Aramco" className="h-[38px] max-w-[74px] object-contain" />
            <img src="/assets/ep-municipality.png" alt="Eastern Province Municipality" className="h-[38px] max-w-[68px] object-contain" />
            <img src="/assets/neom.png" alt="NEOM" className="h-[38px] max-w-[68px] object-contain" />
            <img src="/assets/nwc.png" alt="National Water Company" className="h-[38px] max-w-[68px] object-contain" />
            <img src="/assets/royal-commission-logo.png" alt="Royal Commission" className="h-[38px] max-w-[68px] object-contain" />
            <img src="/assets/sabic-logo.png" alt="SABIC" className="h-[38px] max-w-[68px] object-contain" />
            <img src="/assets/saudi-electric-company.png" alt="Saudi Electricity Company" className="h-[38px] max-w-[74px] object-contain" />
            <img src="/assets/iaf-logo.png" alt="IAF" className="h-[38px] max-w-[68px] object-contain" />
            <img src="/assets/accredition.png" alt="IAS Accreditation" className="h-[38px] max-w-[68px] object-contain" />
          </div>
        </div>
      </div>

      {/* Screen Control Buttons */}
      <div className="mt-5 mb-8 flex gap-3 print:hidden self-center">
        <button
          onClick={() => navigate("/viewcertificates")}
          className="px-6 py-2 bg-white hover:bg-neutral-100 text-neutral-700 font-semibold rounded border border-neutral-300 shadow-sm text-xs cursor-pointer transition-all"
        >
          Back to Search
        </button>
      </div>

    </div>
    {pdfUrl && (
      <div className="min-h-screen bg-[#ece8f2] py-4 px-2 sm:px-4 flex flex-col items-center">
        <iframe
          title="Certificate PDF"
          src={pdfUrl}
          className="w-full max-w-[900px] h-[calc(100vh-88px)] min-h-[520px] border-0 bg-white"
        />
        <div className="mt-3 flex gap-3">
          <button
            onClick={() => navigate("/viewcertificates")}
            className="px-5 py-2 bg-white text-neutral-700 font-semibold rounded border border-neutral-300 text-xs"
          >
            Back to Search
          </button>
          <a
            href={pdfUrl}
            download={`${cert.report_number || cert.id}.pdf`}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#00623a] text-white font-semibold rounded text-xs"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>
        </div>
      </div>
    )}
    </>
  );
}