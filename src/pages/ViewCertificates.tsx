// src/pages/ViewCertificates.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrandLogo } from "../components/ui/BrandLogo";
import { CenteredLayout, AuthCard } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function ViewCertificates() {
  const [docType, setDocType] = useState<"certificate" | "idCard">("certificate");
  const [searchId, setSearchId] = useState("ESICO-LFT-R26-8491");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      navigate(`/viewPDF/${encodeURIComponent(searchId.trim())}`);
    }
  };

  return (
    <CenteredLayout>
      <AuthCard>
        <BrandLogo />

        <h1 className="text-[17px] sm:text-[19px] font-bold text-[#22242a] mt-7 tracking-tight">
          Hey! Quickly Verify Your Certificates Here.
        </h1>

        <form onSubmit={handleSearch} className="mt-6 space-y-5">
          <div className="space-y-2.5">
            <span className="block text-[13px] font-bold text-[#22242a]">Select Type:</span>
            <div className="flex items-center gap-6 text-[13px] text-[#22242a]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="docType"
                  value="certificate"
                  checked={docType === "certificate"}
                  onChange={() => setDocType("certificate")}
                  className="w-3.5 h-3.5 accent-[#2563eb]"
                />
                Certificate
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="docType"
                  value="idCard"
                  checked={docType === "idCard"}
                  onChange={() => setDocType("idCard")}
                  className="w-3.5 h-3.5 accent-[#2563eb]"
                />
                ID Card
              </label>
            </div>
          </div>

          <Input
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="ESICO-LFT-"
            required
          />

          <Button type="submit">Search</Button>
        </form>
      </AuthCard>
    </CenteredLayout>
  );
}