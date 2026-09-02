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
    <div className="min-h-screen min-h-dvh w-full bg-[#ede9f3] flex items-center justify-center p-4 sm:p-8">
      {/* Centered Verification Card */}
      <div className="w-full max-w-[500px] bg-white rounded-[2px] shadow-sm p-8 sm:p-10">
        
        {/* ESICO Brand Header */}
        <div className="flex items-center gap-2.5">
          <svg className="w-8 h-8 text-[#00623a]" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 8L15 43L30 58L50 38L70 58L85 43L50 8Z" />
            <path d="M50 92L85 57L70 42L50 62L30 42L15 57L50 92Z" />
            <path d="M42 32L24 50L42 68L48 62L36 50L48 38L42 32Z" fill="#ffffff" />
            <path d="M58 32L76 50L58 68L52 62L64 50L52 38L58 32Z" fill="#ffffff" />
          </svg>
          <span className="text-[22px] font-black tracking-tight text-[#22242a] font-sans">
            ESICO
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-[17px] sm:text-[19px] font-bold text-[#22242a] mt-7 tracking-tight">
          Hey! Quickly Verify Your Certificates Here.
        </h1>

        <form onSubmit={handleSearch} className="mt-6 space-y-5">
          {/* Select Type Section */}
          <div>
            <label className="block text-[13px] font-bold text-[#22242a] mb-2.5">
              Select Type:
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#22242a] font-normal">
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

              <label className="flex items-center gap-2 cursor-pointer text-[13px] text-[#22242a] font-normal">
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

          {/* Search Input Field */}
          <div>
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="ESICO-LFT-"
              className="w-full px-3.5 py-3 border border-[#e8eaf0] rounded-[2px] text-[16px] sm:text-[13.5px] text-[#22242a] placeholder-[#a6abb7] focus:outline-none focus:border-neutral-400 bg-white"
              required
            />
          </div>

          {/* Action Button */}
          <div>
            <button
              type="submit"
              className="w-32 py-2.5 bg-gradient-to-r from-[#b765ff] to-[#9c45ff] hover:from-[#a852fa] hover:to-[#8d34f5] active:scale-[0.98] text-white font-semibold text-[13px] rounded-[3px] shadow-sm transition-all cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}