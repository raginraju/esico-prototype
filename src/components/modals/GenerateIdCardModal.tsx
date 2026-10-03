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
  companyName: string;
  fileNumber: string;
  civilIdNumber: string;
  designation: string;
  typeModel: string;
  capacitySwl: string;
  expiryDate: string;
}

const emptyForm: FormValues = {
  name: "",
  companyName: "",
  fileNumber: "",
  civilIdNumber: "",
  designation: "",
  typeModel: "",
  capacitySwl: "",
  expiryDate: "",
};

function formatCardDate(value: string) {
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}-${month}-${year}` : "Not provided";
}

export default function GenerateIdCardModal({
  isOpen,
  onClose,
  onSuccess,
}: GenerateIdCardModalProps) {
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(emptyForm);
      setPhoto(null);
      setError("");
      setSaved(false);
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!photo) {
      setPhotoUrl(null);
      return;
    }

    const url = URL.createObjectURL(photo);
    setPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

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
      body.append("company_name", form.companyName.trim());
      body.append("file_number", form.fileNumber.trim());
      body.append("civil_id_number", form.civilIdNumber.trim());
      body.append("designation", form.designation.trim());
      body.append("type_model", form.typeModel.trim());
      body.append("capacity_swl", form.capacitySwl.trim());
      body.append("expiry_date", form.expiryDate);
      if (photo) body.append("file", photo);

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
        @page { size: 85.6mm 53.98mm; margin: 0; }
        @media print {
          body * { visibility: hidden !important; }
          .id-card-print, .id-card-print * { visibility: visible !important; }
          .id-card-print {
            position: absolute;
            top: 0;
            left: 0;
            width: 85.6mm !important;
            max-width: none !important;
            height: auto !important;
            margin: 0;
            transform: none;
            box-shadow: none !important;
          }
          .id-card-print, .id-card-print * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .id-card-side {
            width: 85.6mm !important;
            height: 53.98mm !important;
            min-height: 53.98mm !important;
            max-height: 53.98mm !important;
            page-break-after: always;
            break-after: page;
            box-shadow: none !important;
          }
          .id-card-print { gap: 0 !important; }
          .id-card-side:last-child {
            page-break-after: auto;
            break-after: auto;
          }
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
                Company Name
                <input
                  value={form.companyName}
                  onChange={(event) => updateField("companyName", event.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  autoComplete="organization"
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
                Type / Model
                <input
                  value={form.typeModel}
                  onChange={(event) => updateField("typeModel", event.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Capacity / SWL
                <input
                  value={form.capacitySwl}
                  onChange={(event) => updateField("capacitySwl", event.target.value)}
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
              <label className="block text-sm font-medium text-gray-700">
                Employee Photo <span className="font-normal text-gray-400">(optional)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setPhoto(event.target.files?.[0] || null)}
                  className="mt-1 block w-full text-sm text-gray-600 file:mr-3 file:rounded file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-gray-700"
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

          <div className="flex max-h-[75vh] items-center justify-center overflow-y-auto rounded-md bg-[#f0f1ed] p-4">
            <div className="id-card-print flex w-full max-w-[430px] flex-col gap-4">
              <section style={{ aspectRatio: "85.6 / 53.98" }} className="id-card-side relative w-full overflow-hidden border border-neutral-300 bg-white p-[3.5%] font-sans text-black shadow-md">
                <img src="/assets/esico-logo.png" alt="" className="absolute left-[3%] top-[3%] h-[19%] w-[17%] object-contain" />
                <img src="/assets/leea.png" alt="LEEA Full Member" className="absolute right-[3%] top-[2%] h-[27%] w-[15%] object-contain" />
                <img src="/assets/esico-logo.png" alt="" className="pointer-events-none absolute left-[32%] top-[28%] h-[60%] w-[38%] object-contain opacity-[0.12]" />
                <h3 className="absolute left-[21%] top-[7%] w-[57%] text-center font-serif text-[clamp(12px,2vw,21px)] font-bold leading-[1.05]">
                  CERTIFIED<br />{form.designation || "OPERATOR"}
                </h3>
                <div className="absolute left-[3%] top-[38%] flex w-[69%] flex-col gap-[4%] text-[clamp(8px,1.45vw,15px)] font-bold leading-tight">
                  <div className="grid grid-cols-[24%_1fr] gap-1"><span>NAME:</span><span className="truncate">{form.name || "EMPLOYEE NAME"}</span></div>
                  <div className="grid grid-cols-[24%_1fr] gap-1"><span>CIVIL ID:</span><span className="truncate">{form.civilIdNumber || "CIVIL ID NUMBER"}</span></div>
                  <div className="grid grid-cols-[34%_1fr] gap-1"><span className="whitespace-nowrap">CO. NAME:</span><span className="truncate">{form.companyName || "COMPANY NAME"}</span></div>
                </div>
                <div className="absolute bottom-[6%] left-[3%] flex h-[31%] w-[19%] items-center justify-center border border-neutral-200 bg-white p-[1%]">
                  {form.fileNumber ? (
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(form.fileNumber)}`}
                      alt="ID number QR code"
                      className="h-full w-full object-contain"
                    />
                  ) : <span className="text-center text-[7px] text-neutral-400">ID QR</span>}
                </div>
                <div className="absolute bottom-[7%] left-[26%] flex w-[42%] flex-col gap-1 text-[clamp(7px,1.15vw,12px)] font-bold leading-tight">
                  <span>DATE OF ISSUE</span>
                  <span>{formatCardDate(new Date().toISOString().slice(0, 10))}</span>
                  <span className="text-[#ad1018]">DATE OF EXPIRY</span>
                  <span className="text-[#ad1018]">{formatCardDate(form.expiryDate)}</span>
                </div>
                <div className="absolute right-[3%] top-[40%] flex w-[22%] flex-col items-center gap-[3%]">
                  <span className="max-w-full truncate text-[clamp(8px,1.3vw,14px)] font-bold text-[#ad1018]">{form.fileNumber || "ID NUMBER"}</span>
                  <div className="aspect-[4/5] w-full overflow-hidden bg-neutral-200">
                    {photoUrl ? (
                      <img src={photoUrl} alt="Employee" className="h-full w-full object-cover" />
                    ) : <div className="flex h-full items-center justify-center text-center text-[8px] text-neutral-500">EMPLOYEE<br />PHOTO</div>}
                  </div>
                </div>
              </section>

              <section style={{ aspectRatio: "85.6 / 53.98" }} className="id-card-side flex w-full flex-col overflow-hidden border border-neutral-300 bg-white font-sans text-black shadow-md">
                <div className="flex h-[22%] items-center justify-around gap-[1%] border-b border-neutral-300 px-[2%]">
                  <img src="/assets/aramco.png" alt="Saudi Aramco" className="max-h-[78%] max-w-[20%] object-contain" />
                  <img src="/assets/sabic-logo.png" alt="SABIC" className="max-h-[82%] max-w-[13%] object-contain" />
                  <img src="/assets/royal-commission-logo.png" alt="Royal Commission" className="max-h-[82%] max-w-[11%] object-contain" />
                  <img src="/assets/neom.png" alt="NEOM" className="max-h-[82%] max-w-[10%] object-contain" />
                  <img src="/assets/nwc.png" alt="National Water Company" className="max-h-[82%] max-w-[12%] object-contain" />
                  <img src="/assets/saudi-electric-company.png" alt="Saudi Electricity Company" className="max-h-[78%] max-w-[19%] object-contain" />
                </div>
                <div className="flex flex-1 flex-col justify-center border-x border-neutral-300 px-[2%] py-[1%] text-[clamp(7px,1.2vw,12px)] leading-[1.25]">
                  <p className="mb-[2%] text-center font-bold">The holder of this card is certified as a {form.designation || "qualified operator"}.</p>
                  <div className="grid grid-cols-[23%_1fr] gap-x-2 gap-y-[3%] font-bold">
                    <span>TYPE/MODEL:</span><span className="uppercase">{form.typeModel || "-"}</span>
                    <span>CAPACITY/SWL:</span><span>{form.capacitySwl || "-"}</span>
                  </div>
                </div>
                <div className="border-t border-neutral-400 px-[2%] py-[1.5%] text-center">
                  <div className="text-[clamp(9px,1.65vw,16px)] font-extrabold uppercase">Emaar Support Inspection Company</div>
                  <div className="text-[clamp(7px,1.15vw,11px)] font-bold">P.O Box 1301, Ras Tanura 3194 - Kingdom of Saudi Arabia</div>
                  <div className="text-[clamp(7px,1.1vw,10px)] font-bold">Tel: +966 13 6670779, +966 50 725 9023</div>
                  <div className="text-[clamp(7px,1.1vw,10px)] font-bold text-[#1764a0]">www.esico.com.sa <span className="text-black">Email: info@esico.com.sa</span></div>
                </div>
                <div className="border-t border-neutral-300 px-[2%] py-[1%] text-center text-[clamp(6px,0.95vw,9px)] font-semibold leading-tight">
                  This card is valid only for the holder named on the front. It must not be transferred to another person. If found, please return it to the ESICO office.
                  <div className="mt-[1%] text-[clamp(8px,1.45vw,14px)] font-black">THIS IS NOT A SAUDI GOVERNMENT DRIVING LICENSE</div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
