import { cn } from "../../lib/utils";

export function CenteredLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen min-h-dvh w-full bg-[#ede9f3] flex items-center justify-center p-4 sm:p-8">
      {children}
    </div>
  );
}

export function AuthCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("w-full max-w-[500px] bg-white rounded-[2px] shadow-sm p-8 sm:p-10", className)}>
      {children}
    </div>
  );
}