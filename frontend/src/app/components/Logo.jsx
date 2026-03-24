import { Check } from "lucide-react";
function Logo({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: "#6C63FF" }}
      >
        <Check className="w-5 h-5 text-white" strokeWidth={3} />
      </div>
      <span
        className="font-bold"
        style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "20px",
          color: "#F0F0F5",
        }}
      >
        Taskly
      </span>
    </div>
  );
}
export { Logo };
