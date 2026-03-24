function StatCard({ icon, label, value, iconColor = "#6C63FF" }) {
  return (
    <div
      className="flex-1 rounded-[12px] p-5 border"
      style={{
        background: "#1A1A24",
        borderColor: "#2E2E3E",
      }}
    >
      <div className="flex items-center gap-3">
        <div style={{ color: iconColor }}>{icon}</div>
        <div className="flex flex-col">
          <div style={{ fontSize: "24px", fontWeight: 700, color: "#F0F0F5" }}>
            {value}
          </div>
          <div style={{ fontSize: "12px", color: "#7A7A95" }}>{label}</div>
        </div>
      </div>
    </div>
  );
}
export { StatCard };
