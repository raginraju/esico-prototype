// src/components/ui/BrandLogo.tsx
import { cn } from "../../lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
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
  );
}