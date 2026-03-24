import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
function InputField({
  icon,
  isPassword = false,
  label,
  className = "",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-[12px]" style={{ color: "#F0F0F5" }}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "#7A7A95" }}
          >
            {icon}
          </div>
        )}
        <input
          type={isPassword && !showPassword ? "password" : "text"}
          className={`w-full h-12 rounded-[10px] border transition-all ${icon ? "pl-12" : "pl-4"} ${isPassword ? "pr-12" : "pr-4"} ${className}`}
          style={{
            background: "#1A1A24",
            borderColor: "#2E2E3E",
            color: "#F0F0F5",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#6C63FF";
            e.target.style.boxShadow = "0 0 0 3px rgba(108, 99, 255, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#2E2E3E";
            e.target.style.boxShadow = "none";
          }}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
            style={{ color: "#7A7A95" }}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
export { InputField };
