import * as React from "react";
import { cn } from "~/lib/utils";

export interface TabsProps {
  tabs: { id: string; label: string }[];
  value: string;
  onValueChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onValueChange, className }: TabsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            className={cn(
              " px-3 py-1.5 text-sm cursor-pointer  ml-3 p-3 pl-0 border-b-6 border-transparent",
              active ? " text-white" : " text-[#65717C] hover:text-white",
              active ? "border-b-6 border-[#F9000E]" : null
            )}
            onClick={() => onValueChange(t.id)}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
