// src/components/ui/PageHeader.tsx
import { type ReactNode } from "react";

interface HeaderAction {
  label: string;
  onClick: () => void;
  secondary?: boolean;
}

interface PageHeaderProps {
  title: string;
  icon: ReactNode;
  actionButton?: HeaderAction;
  actionButtons?: HeaderAction[];
}

export default function PageHeader({ title, icon, actionButton, actionButtons }: PageHeaderProps) {
  const buttons = actionButtons || (actionButton ? [actionButton] : []);

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-[36px] h-[36px] rounded-[4px] bg-gradient-to-r from-[#da8cff] to-[#9a55ff] flex items-center justify-center text-white shadow-xs">
          {icon}
        </div>
        <h1 className="text-[17px] font-bold text-[#343a40]">{title}</h1>
      </div>

      {buttons.length > 0 && (
        <div className="flex flex-wrap justify-end gap-2">
          {buttons.map((button) => (
            <button
              key={button.label}
              onClick={button.onClick}
              className={button.secondary
                ? "px-4 py-2 border border-[#b66dff] bg-white text-[#8d49d8] text-[13px] font-medium rounded-[4px] shadow-xs hover:bg-[#faf6ff] transition-colors cursor-pointer"
                : "px-4 py-2 bg-gradient-to-r from-[#da8cff] to-[#9a55ff] text-white text-[13px] font-medium rounded-[4px] shadow-xs hover:opacity-95 transition-opacity cursor-pointer"}
            >
              {button.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}