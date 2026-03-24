function Button({
  variant = "primary",
  children,
  fullWidth = false,
  icon,
  className = "",
  ...props
}) {
  const baseStyles =
    "h-12 px-6 rounded-[10px] font-medium transition-all flex items-center justify-center gap-2";
  const variants = {
    primary: "text-white hover:opacity-90",
    "outline-violet":
      "bg-transparent border border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF]/10",
    "outline-red":
      "bg-transparent border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10",
  };
  const widthClass = fullWidth ? "w-full" : "";
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      style={variant === "primary" ? { background: "#6C63FF" } : void 0}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
export { Button };
