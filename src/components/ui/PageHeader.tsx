// src/components/ui/PageHeader.tsx
import { type ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  icon: ReactNode;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export default function PageHeader({ title, icon, actionButton }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-[36px] h-[36px] rounded-[4px] bg-gradient-to-r from-[#da8cff] to-[#9a55ff] flex items-center justify-center text-white shadow-xs">
          {icon}
        </div>
        <h1 className="text-[17px] font-bold text-[#343a40]">{title}</h1>
      </div>

      {actionButton && (
        <button
          onClick={actionButton.onClick}
          className="px-4 py-2 bg-gradient-to-r from-[#da8cff] to-[#9a55ff] text-white text-[13px] font-medium rounded-[4px] shadow-xs hover:opacity-95 transition-opacity cursor-pointer"
        >
          {actionButton.label}
        </button>
      )}
    </div>
  );
}