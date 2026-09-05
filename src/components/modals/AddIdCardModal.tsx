// src/components/modals/AddIdCardModal.tsx
import { useState, useEffect } from "react";

interface AddIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddIdCardModal({
  isOpen,
  onClose,
  onSuccess,
}: AddIdCardModalProps) {
  const [name, setName] = useState("");
  const [fileNumber, setFileNumber] = useState("");
  const [civilIdNumber, setCivilIdNumber] = useState("");
  const [designation, setDesignation] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setFileNumber("");
      setCivilIdNumber("");
      setDesignation("");
      setExpiryDate("");
      setFile(null);
      setShowError(false);
      setShowSuccess(false);
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(false);
    setShowSuccess(false);

    if (!name.trim() || !fileNumber.trim() || !civilIdNumber.trim()) {
      setErrorMsg("Please fill in Name, File Number, and Civil ID Number.");
      setShowError(true);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("file_number", fileNumber.trim());
      formData.append("civil_id_number", civilIdNumber.trim());
      formData.append("designation", designation.trim());
      formData.append("expiry_date", expiryDate);
      if (file) {
        formData.append("file", file);
      }

      const res = await fetch("/api/idcards", {
        method: "POST",
        body: formData,
      });

      let data: any = null;
      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const errorText = await res.text();
        throw new Error(errorText || `Server returned error (${res.status})`);
      }

      if (!res.ok || data?.status === "error") {
        throw new Error(data?.message || "Failed to create ID card");
      }

      setSuccessMsg("ID Card added successfully!");
      setShowSuccess(true);
      onSuccess();

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err?.message || "Something went wrong.");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="modal-box bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <h4 className="text-lg font-semibold text-[#343a40] mb-4">Add New ID Card</h4>

        <div
          className="err-display bg-red-50 text-red-700 p-3 rounded mb-4 text-sm flex items-center gap-2"
          style={{ display: showError ? "flex" : "none", textAlign: "left" }}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 576 512"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <path d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" />
          </svg>
          <p>{errorMsg}</p>
        </div>

        <div
          className="success-display bg-green-50 text-green-700 p-3 rounded mb-4 text-sm flex items-center gap-2"
          style={{ display: showSuccess ? "flex" : "none", textAlign: "left" }}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
          </svg>
          <p>{successMsg}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#b66dff]"
          />
          <input
            type="text"
            name="file_number"
            placeholder="File Number"
            value={fileNumber}
            onChange={(e) => setFileNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#b66dff]"
          />
          <input
            type="text"
            name="civil_id_number"
            placeholder="Civil ID Number"
            value={civilIdNumber}
            onChange={(e) => setCivilIdNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#b66dff]"
          />
          <input
            type="text"
            name="designation"
            placeholder="Designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#b66dff]"
          />
          <input
            type="date"
            name="expiry_date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#b66dff]"
          />
          <input
            type="file"
            name="file"
            accept=".pdf,.jpg,.jpeg"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-[#b66dff] hover:file:bg-violet-100"
          />

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-light px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-gradient-primary px-4 py-2 bg-gradient-to-r from-[#da8cff] to-[#b66dff] text-white rounded-md text-sm font-medium hover:opacity-90 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}