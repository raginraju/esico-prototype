import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!response.ok) {
        const isJson = response.headers.get("content-type")?.includes("application/json");
        let errorMessage = `Server error (${response.status})`;

        if (isJson) {
          const errData = await response.json().catch(() => null);
          errorMessage = errData?.error || errorMessage;
        } else {
          const text = await response.text().catch(() => "");
          if (response.status === 404) {
            errorMessage = "API route not found (404). Ensure you are accessing the .pages.dev URL.";
          } else if (text) {
            errorMessage = text;
          }
        }

        throw new Error(errorMessage);
      }

      // 2. Parse successful response
      const data = await response.json();

      // Store auth session token
      localStorage.setItem("esico_demo_token", data.token);
      localStorage.setItem("esico_user_role", data.user?.role || "INSPECTOR");

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ede9f3] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-white rounded-[4px] shadow-sm p-8">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <svg
            className="w-8 h-8 text-[#00623a]"
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <path d="M50 8L15 43L30 58L50 38L70 58L85 43L50 8Z" />
            <path d="M50 92L85 57L70 42L50 62L30 42L15 57L50 92Z" />
            <path
              d="M42 32L24 50L42 68L48 62L36 50L48 38L42 32Z"
              fill="#ffffff"
            />
            <path
              d="M58 32L76 50L58 68L52 62L64 50L52 38L58 32Z"
              fill="#ffffff"
            />
          </svg>
          <span className="text-[22px] font-black tracking-tight text-[#22242a]">
            ESICO
          </span>
        </div>

        <h1 className="text-[19px] font-bold text-[#22242a] mb-1">
          Inspector Sign In
        </h1>
        <p className="text-[13px] text-neutral-500 mb-5">
          Enter credentials to access inspection operations
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded break-words">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@esico.com.sa"
              className="w-full px-3 py-2.5 border border-neutral-300 rounded text-[16px] sm:text-[13.5px] focus:outline-none focus:border-neutral-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-neutral-300 rounded text-[16px] sm:text-[13.5px] focus:outline-none focus:border-neutral-500 bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-[#b765ff] to-[#9c45ff] hover:from-[#a852fa] hover:to-[#8d34f5] text-white font-semibold text-xs rounded shadow-sm disabled:opacity-50 cursor-pointer transition-all mt-2"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}