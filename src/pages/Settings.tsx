// src/pages/Settings.tsx
import { useState, useRef, useEffect } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";

export default function Settings() {
  // Form States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Signature Pad State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [inspectorSignature, setInspectorSignature] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/session", { credentials: "same-origin" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.authenticated || !data.user) {
          throw new Error(data.message || "Could not load the signed-in user's profile.");
        }
        if (cancelled) return;
        setFullName(data.user.name || "");
        setEmail(data.user.email || "");
        setMobile(data.user.mobile || "");
        setGender(data.user.gender || "");
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setProfileError(error instanceof Error ? error.message : "Could not load profile.");
        }
      })
      .finally(() => {
        if (!cancelled) setProfileLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.strokeStyle = "#111827";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    canvas.setPointerCapture(e.pointerId);
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    isDrawingRef.current = true;
    lastPointRef.current = point;
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    const lastPoint = lastPointRef.current;
    if (!canvas || !lastPoint) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const midpoint = {
      x: (lastPoint.x + point.x) / 2,
      y: (lastPoint.y + point.y) / 2,
    };
    ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, midpoint.x, midpoint.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(midpoint.x, midpoint.y);
    lastPointRef.current = point;
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const lastPoint = lastPointRef.current;
    if (isDrawingRef.current && canvas && lastPoint) {
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      if (ctx) {
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      }
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    }
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
  };

  const handleSaveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setInspectorSignature(canvas.toDataURL("image/png"));
  };

  const handleUpdateProfile = async () => {
    setSaveError("");
    setSaveSuccess("");

    if (!fullName.trim()) {
      setSaveError("Full name is required.");
      return;
    }
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setSaveError("New password and confirmation do not match.");
        return;
      }
      if (newPassword.length < 8) {
        setSaveError("New password must be at least 8 characters.");
        return;
      }
    }

    setSaving(true);
    try {
      const payload: { name: string; gender: string; password?: string } = {
        name: fullName.trim(),
        gender,
      };
      if (newPassword) payload.password = newPassword;

      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to update profile.");
      }

      setFullName(data.user.name || "");
      setGender(data.user.gender || "");
      setNewPassword("");
      setConfirmPassword("");
      setSaveSuccess("Profile updated successfully.");
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        icon={<SettingsIcon className="w-5 h-5" />}
      />

      {/* Card 1: Personal Details */}
      <div className="bg-white rounded-[4px] shadow-[0_0_10px_rgba(0,0,0,0.03)] border border-[#ebedf2] p-6">
        <h2 className="text-[13px] font-medium text-[#495057] mb-4">Personal Details</h2>

        {profileError && <p role="alert" className="mb-4 text-[12px] text-red-600">{profileError}</p>}
        {profileLoading && <p role="status" className="mb-4 text-[12px] text-[#6c757d]">Loading profile...</p>}
        {saveError && <p role="alert" className="mb-4 text-[12px] text-red-600">{saveError}</p>}
        {saveSuccess && <p role="status" className="mb-4 text-[12px] text-green-700">{saveSuccess}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-[12px] text-[#6c757d] mb-1">
              Full Name <span className="text-[11px] text-[#adb5bd]">(This will be displayed in the certificate)</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-9 px-3 border border-[#ced4da] rounded-[2px] text-[12.5px] text-[#343a40] focus:outline-none focus:border-[#b66dff] bg-white"
            />
          </div>

          {/* Email (Readonly) */}
          <div>
            <label className="block text-[12px] text-[#6c757d] mb-1">Email</label>
            <input
              type="email"
              readOnly
              value={email}
              className="w-full h-9 px-3 border border-[#ced4da] rounded-[2px] text-[12.5px] text-[#6c757d] bg-[#e9ecef] cursor-not-allowed outline-none"
            />
          </div>

          {/* Mobile (Readonly) */}
          <div>
            <label className="block text-[12px] text-[#6c757d] mb-1">Mobile</label>
            <input
              type="text"
              readOnly
              value={mobile}
              className="w-full h-9 px-3 border border-[#ced4da] rounded-[2px] text-[12.5px] text-[#6c757d] bg-[#e9ecef] cursor-not-allowed outline-none"
            />
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="settings-gender" className="block text-[12px] text-[#6c757d] mb-1">Gender</label>
            <select
              id="settings-gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full h-9 px-3 border border-[#ced4da] rounded-[2px] text-[12.5px] text-[#343a40] focus:outline-none focus:border-[#b66dff] bg-white"
            >
              <option value="">Not set</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[12px] text-[#6c757d] mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-9 pl-3 pr-9 border border-[#ced4da] rounded-[2px] text-[12.5px] text-[#343a40] placeholder-[#ced4da] focus:outline-none focus:border-[#b66dff] bg-white"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2.5 top-2.5 text-[#6c757d] hover:text-[#343a40]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-[12px] text-[#6c757d] mb-1">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-9 pl-3 pr-9 border border-[#ced4da] rounded-[2px] text-[12.5px] text-[#343a40] placeholder-[#ced4da] focus:outline-none focus:border-[#b66dff] bg-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2.5 top-2.5 text-[#6c757d] hover:text-[#343a40]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={handleUpdateProfile}
            disabled={profileLoading || saving}
            className="px-6 py-2 bg-gradient-to-r from-[#da8cff] to-[#9a55ff] text-white text-[13px] font-medium rounded-[4px] shadow-xs hover:opacity-95 transition-opacity cursor-pointer"
          >
            {saving ? "Updating..." : "Update"}
          </button>
        </div>
      </div>

      {/* Card 2: Signature Upload & Pad */}
      <div className="bg-white rounded-[4px] shadow-[0_0_10px_rgba(0,0,0,0.03)] border border-[#ebedf2] p-6 space-y-6">
        <h2 className="text-[13px] font-medium text-[#495057]">Signature Upload</h2>

        {/* Canvas Sign Area */}
        <div>
          <p className="text-[12px] text-[#6c757d] mb-1.5">Sign Here</p>
          <div className="relative border border-[#ced4da] rounded-[2px] bg-white w-full max-w-[506px] min-h-[300px] aspect-[506/400]">
            <canvas
              ref={canvasRef}
              width={506}
              height={400}
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerCancel={stopDrawing}
              className="w-full h-full cursor-crosshair touch-none"
            />

            {/* Save / Clear Controls */}
            <div className="absolute top-2 right-2 flex gap-1 bg-white/80 p-0.5 rounded shadow-2xs">
              <button
                type="button"
                onClick={handleSaveSignature}
                className="px-2 py-0.5 border border-[#ced4da] text-[11px] text-[#495057] hover:bg-[#f8f9fa] rounded-[2px] cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleClearSignature}
                className="px-2 py-0.5 border border-[#ced4da] text-[11px] text-[#495057] hover:bg-[#f8f9fa] rounded-[2px] cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Previews: Inspector Signature & QC Signature */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <p className="text-[12px] text-[#6c757d] mb-1.5">Inspector Signature</p>
            <div className="border border-[#ced4da] rounded-[2px] bg-white h-[200px] flex items-center justify-center p-4">
              <img
                src={inspectorSignature || "/assets/signature.png"}
                alt="Inspector Signature"
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
          </div>

          <div>
            <p className="text-[12px] text-[#6c757d] mb-1.5">QC Signature</p>
            <div className="border border-[#ced4da] rounded-[2px] bg-white h-[200px] flex items-center justify-center p-4">
              <img
                src="/assets/signature.png"
                alt="QC Signature"
                className="h-full w-full object-contain mix-blend-multiply"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => alert("Signatures uploaded successfully")}
            className="px-6 py-2 bg-gradient-to-r from-[#da8cff] to-[#9a55ff] text-white text-[13px] font-medium rounded-[4px] shadow-xs hover:opacity-95 transition-opacity cursor-pointer"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}