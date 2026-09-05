// src/pages/NewCertificate.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CERTIFICATE_TITLES = [
  "CERTIFICATE OF THOROUGH EXAMINATION AND /OR TEST",
  "CERTIFICATE OF THOROUGH EXAMINATION OF LIFTING EQUIPMENT",
  "CERTIFICATE OF THOROUGH EXAMINATION OF ACCESS PLATFORMS",
  "REPORT OF THOROUGH EXAMINATION OF HOIST / CRANE",
];

export default function NewCertificate() {
  const navigate = useNavigate();

  // Form Field States
  const [titleType, setTitleType] = useState<"existing" | "new">("existing");
  const [selectedTitle, setSelectedTitle] = useState(CERTIFICATE_TITLES[0]);
  const [customTitle, setCustomTitle] = useState("");

  const [dateOfExam, setDateOfExam] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [appliedStandards, setAppliedStandards] = useState("");
  const [reportNumber, setReportNumber] = useState("ESICO-LFT-");
  const [stickerNumber, setStickerNumber] = useState("");
  const [employer, setEmployer] = useState("");
  const [location, setLocation] = useState("");
  const [equipmentId, setEquipmentId] = useState("");
  const [equipmentDescription, setEquipmentDescription] = useState("");
  const [safeWorkingLoads, setSafeWorkingLoads] = useState("");
  const [manufacturerName, setManufacturerName] = useState("");
  const [manufactureDate, setManufactureDate] = useState("");

  const [firstExamined, setFirstExamined] = useState("No");
  const [installedCorrectly, setInstalledCorrectly] = useState("No");
  const [monthsInterval, setMonthsInterval] = useState("6");
  const [examScheme, setExamScheme] = useState("Yes");
  const [afterOccur, setAfterOccur] = useState("No");

  const [defect, setDefect] = useState("NONE");
  const [iminentDanger, setIminentDanger] = useState("No");
  const [defectDate, setDefectDate] = useState("");
  const [repairRenewal, setRepairRenewal] = useState("");
  const [testsCarried, setTestsCarried] = useState("NONE");
  const [observation, setObservation] = useState("");
  const [safeToOperate, setSafeToOperate] = useState("Yes");
  const [dateOfIssue, setDateOfIssue] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Status & Feedback States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const title = titleType === "existing" ? selectedTitle : customTitle;

    if (!reportNumber.trim() || reportNumber === "ESICO-LFT-") {
      setErrorMsg("Please enter a valid Report Number.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!employer.trim()) {
      setErrorMsg("Name and Address of employer is required.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!equipmentDescription.trim()) {
      setErrorMsg("Equipment Description is required.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);

    const payload = {
      certificate_title: title,
      selected_date: dateOfExam,
      applied_standards: appliedStandards,
      report_number: reportNumber.toUpperCase().trim(),
      sticker_number: stickerNumber.trim(),
      employer_name_address: employer.trim(),
      location: location.trim(),
      equipment_id: equipmentId.trim(),
      equipment_description: equipmentDescription.trim(),
      safe_working_loads: safeWorkingLoads.trim(),
      manufacturer_name: manufacturerName.trim(),
      manufacture_date: manufactureDate.trim(),
      first_examined: firstExamined,
      installed_correctly: installedCorrectly,
      months_interval: monthsInterval,
      exam_scheme: examScheme,
      after_occur: afterOccur,
      defect: defect.trim() || "NONE",
      iminent_danger: iminentDanger,
      defect2: defectDate.trim() || "N/A",
      repair_renewal: repairRenewal.trim() || "NONE",
      any_tests_carried: testsCarried.trim() || "NONE",
      observation: observation.trim(),
      safe_to_operate: safeToOperate,
      date_of_issue: dateOfIssue,
    };

    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.status === "error") {
        throw new Error(data.message || "Failed to create certificate");
      }

      setSuccessMsg("Certificate has been created successfully!");
      setTimeout(() => {
        navigate("/certificates");
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => navigate("/certificates")}
          className="p-1.5 rounded bg-white border border-[#ebedf2] text-[#6c757d] hover:text-[#343a40] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h3 className="text-xl font-bold text-[#343a40]">Add New Certificate</h3>
      </div>

      <div className="bg-white rounded-[4px] shadow-[0_0_10px_rgba(0,0,0,0.03)] border border-[#ebedf2]">
        <div className="p-6">
          {/* Error Banner */}
          {errorMsg && (
            <div className="bg-red-50 text-red-700 p-3.5 rounded text-[13px] flex items-center gap-2 mb-5">
              <svg stroke="currentColor" fill="currentColor" viewBox="0 0 576 512" height="1.1em" width="1.1em" className="shrink-0">
                <path d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" />
              </svg>
              <p>{errorMsg}</p>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="bg-green-50 text-green-700 p-3.5 rounded text-[13px] flex items-center gap-2 mb-5">
              <svg stroke="currentColor" fill="currentColor" viewBox="0 0 512 512" height="1.1em" width="1.1em" className="shrink-0">
                <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
              </svg>
              <p>{successMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4 text-[13px] text-[#495057]">
            {/* Title Selection */}
            <div>
              <label className="block font-medium mb-1.5">Certificate Title</label>
              <div className="flex items-center gap-4 mb-2">
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="titletype"
                    value="existing"
                    checked={titleType === "existing"}
                    onChange={() => setTitleType("existing")}
                    className="accent-[#b66dff]"
                  />
                  Existing
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="titletype"
                    value="new"
                    checked={titleType === "new"}
                    onChange={() => setTitleType("new")}
                    className="accent-[#b66dff]"
                  />
                  New
                </label>
              </div>

              {titleType === "existing" ? (
                <select
                  value={selectedTitle}
                  onChange={(e) => setSelectedTitle(e.target.value)}
                  className="w-full h-10 px-3 border border-[#ced4da] rounded-[2px] bg-white focus:outline-none focus:border-[#b66dff]"
                >
                  {CERTIFICATE_TITLES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Enter custom certificate title..."
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full h-10 px-3 border border-[#ced4da] rounded-[2px] focus:outline-none focus:border-[#b66dff]"
                />
              )}
            </div>

            {/* Exam Date & Standards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Date of Thorough Examination</label>
                <input
                  type="date"
                  value={dateOfExam}
                  onChange={(e) => setDateOfExam(e.target.value)}
                  className="w-full h-10 px-3 border border-[#ced4da] rounded-[2px] bg-white focus:outline-none focus:border-[#b66dff]"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Applied Standards</label>
                <input
                  type="text"
                  placeholder="Type something..."
                  value={appliedStandards}
                  onChange={(e) => setAppliedStandards(e.target.value)}
                  className="w-full h-10 px-3 border border-[#ced4da] rounded-[2px] focus:outline-none focus:border-[#b66dff]"
                />
              </div>
            </div>

            {/* Report & Sticker Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Report Number</label>
                <input
                  type="text"
                  placeholder="ESICO-LFT-RXX-XXX"
                  value={reportNumber}
                  onChange={(e) => setReportNumber(e.target.value.toUpperCase())}
                  className="w-full h-10 px-3 border border-[#ced4da] rounded-[2px] uppercase focus:outline-none focus:border-[#b66dff]"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Sticker Number</label>
                <input
                  type="text"
                  value={stickerNumber}
                  onChange={(e) => setStickerNumber(e.target.value)}
                  className="w-full h-10 px-3 border border-[#ced4da] rounded-[2px] focus:outline-none focus:border-[#b66dff]"
                />
              </div>
            </div>

            {/* Employer & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">
                  Name and Address of employer for whom the thorough examination was made
                </label>
                <input
                  type="text"
                  placeholder="Type something..."
                  value={employer}
                  onChange={(e) => setEmployer(e.target.value)}
                  className="w-full h-10 px-3 border border-[#ced4da] rounded-[2px] focus:outline-none focus:border-[#b66dff]"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Location</label>
                <input
                  type="text"
                  placeholder="Type something..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-10 px-3 border border-[#ced4da] rounded-[2px] focus:outline-none focus:border-[#b66dff]"
                />
              </div>
            </div>

            {/* Equipment ID & Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Equipment Identification Number</label>
                <input
                  type="text"
                  value={equipmentId}
                  onChange={(e) => setEquipmentId(e.target.value)}
                  className="w-full h-10 px-3 border border-[#ced4da] rounded-[2px] focus:outline-none focus:border-[#b66dff]"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Equipment Description</label>
                <textarea
                  rows={4}
                  placeholder="Equipment description, specifications, serial numbers..."
                  value={equipmentDescription}
                  onChange={(e) => setEquipmentDescription(e.target.value)}
                  className="w-full p-3 border border-[#ced4da] rounded-[2px] focus:outline-none focus:border-[#b66dff]"
                />
              </div>
            </div>

            {/* Safe Working Load(s) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Safe Working Load(s)</label>
                <input
                  type="text"
                  value={safeWorkingLoads}
                  onChange={(e) => setSafeWorkingLoads(e.target.value)}
                  className="w-full h-10 px-3 border border-[#ced4da] rounded-[2px] focus:outline-none focus:border-[#b66dff]"
                />
              </div>
            </div>

            {/* Manufacturer & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Manufacturer Name</label>
                <input
                  type="text"
                  value={manufacturerName}
                  onChange={(e) => setManufacturerName(e.target.value)}
                  className="w-full h-10 px-3 border border-[#ced4da] rounded-[2px] focus:outline-none focus:border-[#b66dff]"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Date of Manufacture (if known)</label>
                <input
                  type="text"
                  value={manufactureDate}
                  onChange={(e) => setManufactureDate(e.target.value)}
                  className="w-full h-10 px-3 border border-[#ced4da] rounded-[2px] focus:outline-none focus:border-[#b66dff]"
                />
              </div>
            </div>

            {/* First Examined & Installed Correctly */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">
                  Is this the first examination after installation or assembly at a new site or location?
                </label>
                <div className="flex gap-4 mt-2">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="firstExamined"
                      value="Yes"
                      checked={firstExamined === "Yes"}
                      onChange={() => setFirstExamined("Yes")}
                      className="accent-[#b66dff]"
                    />
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="firstExamined"
                      value="No"
                      checked={firstExamined === "No"}
                      onChange={() => setFirstExamined("No")}
                      className="accent-[#b66dff]"
                    />
                    No
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  If the answer to the previous question is YES, has the equipment been installed correctly?
                </label>
                <div className="flex gap-4 mt-2">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="installedCorrectly"
                      value="Yes"
                      checked={installedCorrectly === "Yes"}
                      onChange={() => setInstalledCorrectly("Yes")}
                      className="accent-[#b66dff]"
                    />
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="installedCorrectly"
                      value="No"
                      checked={installedCorrectly === "No"}
                      onChange={() => setInstalledCorrectly("No")}
                      className="accent-[#b66dff]"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>

            <p className="font-semibold text-[#343a40] pt-2 border-t border-[#ebedf2]">
              Was the examination carried out:
            </p>

            {/* Intervals */}
            <div>
              <label className="block font-medium mb-1">Within an interval of?</label>
              <div className="flex gap-6 mt-1">
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="monthsInterval"
                    value="3"
                    checked={monthsInterval === "3"}
                    onChange={() => setMonthsInterval("3")}
                    className="accent-[#b66dff]"
                  />
                  3 Months
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="monthsInterval"
                    value="6"
                    checked={monthsInterval === "6"}
                    onChange={() => setMonthsInterval("6")}
                    className="accent-[#b66dff]"
                  />
                  6 Months
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="monthsInterval"
                    value="12"
                    checked={monthsInterval === "12"}
                    onChange={() => setMonthsInterval("12")}
                    className="accent-[#b66dff]"
                  />
                  12 Months
                </label>
              </div>
            </div>

            {/* Scheme & Occur */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">In accordance with an examination scheme?</label>
                <div className="flex gap-4 mt-1">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="examScheme"
                      value="Yes"
                      checked={examScheme === "Yes"}
                      onChange={() => setExamScheme("Yes")}
                      className="accent-[#b66dff]"
                    />
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="examScheme"
                      value="No"
                      checked={examScheme === "No"}
                      onChange={() => setExamScheme("No")}
                      className="accent-[#b66dff]"
                    />
                    No
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">After the occurrence of exceptional circumstances?</label>
                <div className="flex gap-4 mt-1">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="afterOccur"
                      value="Yes"
                      checked={afterOccur === "Yes"}
                      onChange={() => setAfterOccur("Yes")}
                      className="accent-[#b66dff]"
                    />
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="afterOccur"
                      value="No"
                      checked={afterOccur === "No"}
                      onChange={() => setAfterOccur("No")}
                      className="accent-[#b66dff]"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>

            {/* Defect Description */}
            <div>
              <label className="block font-medium mb-1">
                Identification of any part found to have a defect which is or could become a danger to persons and a description of the defect (if none state NONE)
              </label>
              <input
                type="text"
                value={defect}
                onChange={(e) => setDefect(e.target.value)}
                className="w-full h-10 px-3 border border-[#ced4da] rounded-[2px] focus:outline-none focus:border-[#b66dff]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">
                  Is the above an existing or imminent danger to persons? (Reportable defect)
                </label>
                <div className="flex gap-4 mt-1">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="iminentDanger"
                      value="Yes"
                      checked={iminentDanger === "Yes"}
                      onChange={() => setIminentDanger("Yes")}
                      className="accent-[#b66dff]"
                    />
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="iminentDanger"
                      value="No"
                      checked={iminentDanger === "No"}
                      onChange={() => setIminentDanger("No")}
                      className="accent-[#b66dff]"
                    />
                    No
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Is the above a defect which is not yet could become a danger to persons (if YES state the date by when)
                </label>
                <input
                  type="text"
                  placeholder="Date or details..."
                  value={defectDate}
                  onChange={(e) => setDefectDate(e.target.value)}
                  className="w-full h-10 px-3 border border-[#ced4da] rounded-[2px] focus:outline-none focus:border-[#b66dff]"
                />
              </div>
            </div>

            {/* Repair & Tests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">
                  Particulars of any repair, renewal or alteration required to remedy the defect identified above
                </label>
                <input
                  type="text"
                  value={repairRenewal}
                  onChange={(e) => setRepairRenewal(e.target.value)}
                  className="w-full h-10 px-3 border border-[#ced4da] rounded-[2px] focus:outline-none focus:border-[#b66dff]"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Particulars of any tests carried out as part of the examination (if none state NONE)
                </label>
                <input
                  type="text"
                  value={testsCarried}
                  onChange={(e) => setTestsCarried(e.target.value)}
                  className="w-full h-10 px-3 border border-[#ced4da] rounded-[2px] focus:outline-none focus:border-[#b66dff]"
                />
              </div>
            </div>

            {/* Observations & Safe to Operate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">
                  Observation / additional comments relative to this thorough examination
                </label>
                <textarea
                  rows={3}
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  className="w-full p-3 border border-[#ced4da] rounded-[2px] focus:outline-none focus:border-[#b66dff]"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Is this equipment safe to operate?</label>
                <div className="flex gap-4 mt-2">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="safeToOperate"
                      value="Yes"
                      checked={safeToOperate === "Yes"}
                      onChange={() => setSafeToOperate("Yes")}
                      className="accent-[#b66dff]"
                    />
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="safeToOperate"
                      value="No"
                      checked={safeToOperate === "No"}
                      onChange={() => setSafeToOperate("No")}
                      className="accent-[#b66dff]"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>

            {/* Date of Issue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Date of issue</label>
                <input
                  type="date"
                  value={dateOfIssue}
                  onChange={(e) => setDateOfIssue(e.target.value)}
                  className="w-full h-10 px-3 border border-[#ced4da] rounded-[2px] bg-white focus:outline-none focus:border-[#b66dff]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-[#da8cff] to-[#9a55ff] text-white font-medium text-[14px] rounded-[4px] shadow-sm hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {loading && (
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <span>{loading ? "Submitting..." : "Submit"}</span>
              </button>
              <button
                type="button"
                onClick={() => navigate("/certificates")}
                className="px-6 py-3 bg-[#f8f9fa] border border-[#ebedf2] text-[#6c757d] hover:bg-[#e9ecef] rounded-[4px] text-[14px] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}