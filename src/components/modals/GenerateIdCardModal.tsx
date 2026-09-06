import { useEffect, useState } from "react";
import { Printer, Sparkles, X } from "lucide-react";
import { authHeaders } from "../../lib/utils";

interface GenerateIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormValues {
  name: string;
  fileNumber: string;
  civilIdNumber: string;
  designation: string;
  expiryDate: string;
}

const emptyForm: FormValues = {
  name: "",
  fileNumber: "",
  civilIdNumber: "",
  designation: "",
  expiryDate: "",
};

export default function GenerateIdCardModal({
  isOpen,
  onClose,
  onSuccess,
}: GenerateIdCardModalProps) {
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(emptyForm);
      setError("");
      setSaved(false);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const updateField = (field: keyof FormValues, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const values = Object.values(form).map((value) => value.trim());

    if (values.some((value) => !value)) {
      setError("Please fill in all ID card fields before generating it.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const body = new FormData();
      body.append("name", form.name.trim());
      body.append("file_number", form.fileNumber.trim());
      body.append("civil_id_number", form.civilIdNumber.trim());
      body.append("designation", form.designation.trim());
      body.append("expiry_date", form.expiryDate);

      const response = await fetch("/api/idcards", {
        method: "POST",
        headers: authHeaders(),
        body,
      });
      const data = await response.json();

      if (!response.ok || data?.status === "error") {
        throw new Error(data?.message || "Failed to generate ID card");
      }

      setSaved(true);
      onSuccess();
    } catch (submissionError: any) {
      setError(submissionError?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="id-card-modal fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4">
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .id-card-print, .id-card-print * { visibility: visible !important; }
          .id-card-print {
            position: absolute;
            top: 0;
            left: 50%;
            width: 430px !important;
            max-width: none !important;
            height: auto !important;
            margin: 0;
            transform: translateX(-50%);
            box-shadow: none !important;
          }
          .id-card-print, .id-card-print * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .id-card-print-header { background: #8d49d8 !important; }
          .id-card-print-footer { background: #343a40 !important; }
        }
      `}</style>
      <div className="mx-auto flex min-h-full w-full max-w-4xl items-center justify-center">
        <div className="relative grid w-full gap-6 rounded-lg bg-white p-6 shadow-xl md:grid-cols-[minmax(260px,0.8fr)_minmax(360px,1.2fr)]">
          <button
            type="button"
            onClick={onClose}
            className="absolute -right-3 -top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#343a40] text-white shadow-md hover:bg-[#212529]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div>
            <h2 className="mb-1 text-lg font-semibold text-[#343a40]">Generate ID Card</h2>
            <p className="mb-5 text-sm text-gray-500">Enter the employee details to create a printable card.</p>

            {error && (
              <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Name
                <input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  autoComplete="name"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                File Number
                <input
                  value={form.fileNumber}
                  onChange={(event) => updateField("fileNumber", event.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Civil ID
                <input
                  value={form.civilIdNumber}
                  onChange={(event) => updateField("civilIdNumber", event.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Designation
                <input
                  value={form.designation}
                  onChange={(event) => updateField("designation", event.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Expiry Date
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(event) => updateField("expiryDate", event.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </label>

              <div className="flex flex-wrap justify-end gap-3 pt-3">
                {!saved && (
                  <button type="button" onClick={onClose} className="rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700">
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-md bg-gradient-to-r from-[#da8cff] to-[#b66dff] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  {loading ? "Generating..." : saved ? "Generated" : "Generate & Save"}
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  disabled={!saved}
                  className="flex items-center gap-2 rounded-md border border-[#b66dff] px-4 py-2 text-sm font-medium text-[#8d49d8] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Printer className="h-4 w-4" />
                  Print Card
                </button>
              </div>
            </form>
          </div>

          <div className="flex items-center justify-center rounded-md bg-[#f5f1f8] p-5">
            <div className="id-card-print w-full max-w-[430px] overflow-hidden rounded-xl border border-[#d8c4e8] bg-white shadow-lg">
              <div className="id-card-print-header bg-gradient-to-r from-[#7a2e9f] to-[#b66dff] px-6 py-5 text-white">
                <div className="text-xs font-semibold uppercase tracking-[0.2em]">ESICO</div>
                <div className="mt-1 text-lg font-bold">Employee Identity Card</div>
              </div>
              <div className="space-y-4 p-6 text-sm">
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-400">Name</div>
                  <div className="mt-1 text-xl font-bold text-[#343a40]">{form.name || "Employee name"}</div>
                  <div className="text-sm text-[#8d49d8]">{form.designation || "Designation"}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-400">File Number</div>
                    <div className="mt-1 font-semibold text-[#343a40]">{form.fileNumber || "Not provided"}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-400">Civil ID</div>
                    <div className="mt-1 font-semibold text-[#343a40]">{form.civilIdNumber || "Not provided"}</div>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <div className="text-xs uppercase tracking-wide text-gray-400">Expiry Date</div>
                  <div className="mt-1 font-semibold text-[#343a40]">{form.expiryDate || "Not provided"}</div>
                </div>
              </div>
              <div className="id-card-print-footer bg-[#343a40] px-6 py-3 text-center text-xs text-white">Authorized Personnel</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
