"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SectionCollapse({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border rounded-2xl shadow-sm mb-4 bg-white">
      <div
        className="flex items-center justify-between p-4 cursor-pointer bg-blue-50 hover:bg-blue-100 rounded-t-2xl"
        onClick={() => setOpen(!open)}
      >
        <h2 className="text-lg font-semibold text-blue-800">{title}</h2>
        {open ? <ChevronUp /> : <ChevronDown />}
      </div>
      {open && <div className="px-4 pb-4 pt-1 space-y-3">{children}</div>}
    </div>
  );
}