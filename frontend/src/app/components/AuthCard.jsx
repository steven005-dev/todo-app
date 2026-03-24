import { Logo } from "./Logo";

function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#0F0F13" }}
    >
      <div
        className="w-full max-w-[480px] rounded-[12px] p-10 flex flex-col gap-5"
        style={{
          background: "#1A1A24",
          borderWidth: "1px",
          borderColor: "#2E2E3E",
          boxShadow: "0 10px 40px rgba(108, 99, 255, 0.1)",
        }}
      >
        <div className="flex flex-col gap-3 items-center text-center">
          <Logo />
          <div>
            <h1
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "24px",
                fontWeight: 600,
                color: "#F0F0F5",
              }}
            >
              {title}
            </h1>
            <p style={{ fontSize: "14px", color: "#7A7A95", marginTop: "8px" }}>
              {subtitle}
            </p>
          </div>
        </div>

        {children}

        <div
          className="text-center"
          style={{ fontSize: "14px", color: "#7A7A95" }}
        >
          {footer}
        </div>
      </div>
    </div>
  );
}
export { AuthCard };
