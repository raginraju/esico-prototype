// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrandLogo } from "../components/ui/BrandLogo";
import { CenteredLayout, AuthCard } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        token?: string;
        error?: string;
      };

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid email or password");
      }

      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredLayout>
      <AuthCard>
        <BrandLogo />

        <h1 className="text-[17px] sm:text-[19px] font-bold text-[#22242a] mt-7 tracking-tight">
          Inspector Portal Sign In
        </h1>
        <p className="text-[13px] text-neutral-500 mt-1">
          Enter your credentials to manage inspection certificates.
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-[2px]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="admin@esico.com.sa"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-[14px]"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </form>
      </AuthCard>
    </CenteredLayout>
  );
}