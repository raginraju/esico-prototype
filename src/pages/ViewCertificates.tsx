import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ViewCertificates() {
  const [docType, setDocType] = useState<"certificate" | "idCard">("certificate");
  const [searchId, setSearchId] = useState("ESICO-LFT-R26-8491");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      navigate(`/viewPDF/${searchId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#ede9f6] flex flex-col justify-start sm:justify-center items-center p-4 sm:p-8">
      {/* Main Verification Card */}
      <div className="w-full max-w-[620px] bg-white rounded-xs shadow-sm border border-neutral-100 p-8 sm:p-10">
        
        {/* ESICO Brand Header */}
        <div className="flex items-center gap-3">
          <svg className="w-10 h-10 text-[#00623a]" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 8L15 43L30 58L50 38L70 58L85 43L50 8Z" />
            <path d="M50 92L85 57L70 42L50 62L30 42L15 57L50 92Z" />
            <path d="M42 32L24 50L42 68L48 62L36 50L48 38L42 32Z" fill="#ffffff" />
            <path d="M58 32L76 50L58 68L52 62L64 50L52 38L58 32Z" fill="#ffffff" />
          </svg>
          <span className="text-2xl font-black tracking-normal text-neutral-900 font-sans">
            ESICO
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-[17px] sm:text-[19px] font-bold text-neutral-800 mt-7 tracking-tight">
          Hey! Quickly Verify Your Certificates Here.
        </h1>

        <form onSubmit={handleSearch} className="mt-6 space-y-5">
          {/* Select Type Section */}
          <div>
            <label className="block text-[13px] font-bold text-neutral-800 mb-2.5">
              Select Type:
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-[13px] text-neutral-800 font-normal">
                <input
                  type="radio"
                  name="docType"
                  value="certificate"
                  checked={docType === "certificate"}
                  onChange={() => setDocType("certificate")}
                  className="w-3.5 h-3.5 accent-[#2563eb] cursor-pointer"
                />
                Certificate
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-[13px] text-neutral-800 font-normal">
                <input
                  type="radio"
                  name="docType"
                  value="idCard"
                  checked={docType === "idCard"}
                  onChange={() => setDocType("idCard")}
                  className="w-3.5 h-3.5 accent-[#2563eb] cursor-pointer"
                />
                ID Card
              </label>
            </div>
          </div>

          {/* Search Input */}
          <div>
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="ESICO-LFT-"
              className="w-full px-3.5 py-3 border border-neutral-200 rounded-[2px] text-[14px] text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 bg-white"
              required
            />
          </div>

          {/* Search Action Button */}
          <div>
            <button
              type="submit"
              className="w-36 py-2.5 bg-gradient-to-r from-[#b766ff] to-[#994eff] hover:from-[#aa55ff] hover:to-[#8c3df2] active:scale-[0.98] text-white font-semibold text-[14px] rounded-[4px] shadow-sm transition-all cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}