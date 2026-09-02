import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("esico_demo_token", "demo_session_active");
    navigate("/portal");
  };

  return (
    <div className="min-h-screen w-full bg-[#ede9f3] flex items-center justify-center p-4">
      {/* Centered Login Box */}
      <div className="w-full max-w-[490px] bg-white rounded-[2px] shadow-sm p-10 sm:p-12">
        
        {/* Brand Header */}
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

        {/* Titles */}
        <div className="mt-7">
          <h1 className="text-[17px] font-bold text-[#22242a]">
            Hello! let's get started
          </h1>
          <p className="text-[13px] text-[#6f7482] mt-1 font-normal">
            Sign in to continue.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignIn} className="mt-6 space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-3.5 py-3 border border-[#e8eaf0] rounded-[2px] text-[13px] text-[#22242a] placeholder-[#a6abb7] focus:outline-none focus:border-neutral-400 bg-white"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3.5 py-3 pr-10 border border-[#e8eaf0] rounded-[2px] text-[13px] text-[#22242a] placeholder-[#a6abb7] focus:outline-none focus:border-neutral-400 bg-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4b5563] hover:text-[#111827] focus:outline-none cursor-pointer"
              tabIndex={-1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-32 py-2.5 bg-gradient-to-r from-[#b765ff] to-[#9c45ff] hover:from-[#a852fa] hover:to-[#8d34f5] active:scale-[0.98] text-white font-bold text-[12px] tracking-wider uppercase rounded-[3px] shadow-sm transition-all cursor-pointer"
            >
              SIGN IN
            </button>
          </div>

          {/* Links */}
          <div className="pt-1">
            <a
              href="#/forgot-password"
              className="text-[12px] font-bold text-[#22242a] underline underline-offset-2 hover:text-black"
            >
              Forgot password?
            </a>
          </div>

          <div className="pt-3 text-[12.5px] text-[#555a68]">
            Don't have an account?{" "}
            <a
              href="#/register"
              className="text-[#1d5bf0] hover:underline font-normal ml-0.5"
            >
              Create
            </a>
          </div>
        </form>

      </div>
    </div>
  );
}