import { Calendar, Check } from "lucide-react";
import { format, isPast, isValid, parseISO } from "date-fns";
const priorityColors = {
  faible: { color: "#22C55E", label: "Basse" },
  moyenne: { color: "#F59E0B", label: "Moyenne" },
  haute: { color: "#EF4444", label: "Haute" },
};
const fallbackPriority = { color: "#7A7A95", label: "Non definie" };
function TaskCard({ task, isSelected, onSelect, onToggleComplete }) {
  const priorityConfig = priorityColors[task.priorite] ?? fallbackPriority;
  const isCompleted = task.statut === "terminee" || task.statut === "terminée" || task.completed === true;
  const taskDate = task.date instanceof Date ? task.date : parseISO(String(task.date));
  const hasValidDate = isValid(taskDate);
  const isOverdue = hasValidDate && !isCompleted && isPast(taskDate);
  return (
    <div
      onClick={onSelect}
      className="rounded-[12px] p-[18px] border cursor-pointer transition-all"
      style={{
        background: "#1A1A24",
        borderColor: isSelected ? "#6C63FF" : "#2E2E3E",
        borderLeftWidth: "3px",
        borderLeftColor: priorityConfig.color,
        boxShadow: isSelected ? "0 0 0 3px rgba(108, 99, 255, 0.1)" : "none",
      }}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete();
          }}
          className="mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0"
          style={{
            borderColor: isCompleted ? "#22C55E" : "#2E2E3E",
            background: isCompleted ? "#22C55E" : "transparent",
          }}
        >
          {isCompleted && (
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: isCompleted ? "#7A7A95" : "#F0F0F5",
                textDecoration: isCompleted ? "line-through" : "none",
              }}
            >
              {task.intitule}
            </h3>
            <span
              className="px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap"
              style={{
                background: `${priorityConfig.color}20`,
                color: priorityConfig.color,
              }}
            >
              {priorityConfig.label}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Calendar
              className="w-3 h-3"
              style={{ color: isOverdue ? "#EF4444" : "#7A7A95" }}
            />
            <span
              style={{
                fontSize: "12px",
                color: isOverdue ? "#EF4444" : "#7A7A95",
              }}
            >
              {hasValidDate ? format(taskDate, "dd/MM/yyyy") : "Date invalide"}
              {isOverdue && " - En retard"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export { TaskCard };
