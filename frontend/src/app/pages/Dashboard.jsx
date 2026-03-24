import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  LogOut,
  List,
  Clock,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Logo } from "../components/Logo";
import { StatCard } from "../components/StatCard";
import { TaskCard } from "../components/TaskCard";
import { Button } from "../components/Button";
import { InputField } from "../components/InputField";
import { toast } from "sonner";
function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [formData, setFormData] = useState({
    intitule: "",
    date: "",
    priorite: "moyenne",
  });

  const isTaskCompleted = (task) =>
    task?.statut === "terminee" || task?.statut === "terminée";
  
  const getTasks = async () => {
    try {
      const token = localStorage.getItem("token"); // récupérer le token

      if (!token) return; // pas de token, ne fait rien

      const res = await fetch("http://127.0.0.1:8000/api/taches", {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, // 🔥 token JWT
        },
      });

      const data = await res.json();

      if (res.ok) {
        setTasks(data.taches ?? []); // stocke les tâches dans le state
      } else {
        console.log(data);
        alert(data?.message || "Erreur lors du chargement des tâches");
      }
    } catch (error) {
      console.error("Erreur serveur:", error);
      alert("Erreur de connexion au serveur");
    }
  };

   // 🔹 useEffect pour charger automatiquement les tâches au chargement
  useEffect(() => {
    getTasks();
  }, []); // [] => ne s'exécute qu'une fois au montage


  const handleLogout = () => { 
  localStorage.removeItem("token");
  navigate("/login");
};

  //debut ajouter une tâche
  const handleAddTask = async (e) => {
    e.preventDefault();
    try{
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/taches/add",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}` // 🔥 AJOUT IMPORTANT
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok){
        toast.success("Tâche ajoutée avec succès");
        setFormData({ intitule: "", date: "", priorite: "moyenne" });
        await getTasks();
      }
      else {
        console.log(data);
        alert(data?.message || "Erreur lors de l'ajout de la tâche")
        console.log(localStorage.getItem("token"));
      }

    }
    catch (error){
      console.error("Erreur de connexion au serveur:", error);
      alert("Erreur de connexion au serveur");
    }  
    
  };
  //fin ajouter une tâche

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!selectedTaskId) return;
    try {
      const token = localStorage.getItem("token");
      const selectedTask = tasks.find((task) => task.id === selectedTaskId);

      const res = await fetch(`http://127.0.0.1:8000/api/taches/update/${selectedTaskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          intitule: formData.intitule,
          date: formData.date,
          priorite: formData.priorite,
          statut: selectedTask?.statut ?? "en cours",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Tâche modifiée avec succès");
        setSelectedTaskId(null);
        setFormData({ intitule: "", date: "", priorite: "moyenne" });
        await getTasks();
      } else {
        console.log(data);
        alert(data?.message || "Erreur lors de la modification de la tâche");
      }
    } catch (error) {
      console.error("Erreur serveur:", error);
      alert("Erreur de connexion au serveur");
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTaskId) {
      toast.error("Veuillez s\xE9lectionner une t\xE2che");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://127.0.0.1:8000/api/taches/delete/${selectedTaskId}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Tâche supprimée");
        setSelectedTaskId(null);
        setFormData({ intitule: "", date: "", priorite: "moyenne" });
        await getTasks();
      } else {
        console.log(data);
        alert(data?.message || "Erreur lors de la suppression de la tâche");
      }
    } catch (error) {
      console.error("Erreur serveur:", error);
      alert("Erreur de connexion au serveur");
    }
  };

  const handleSelectTask = (task) => {
    setSelectedTaskId(task.id);

    const rawDate = String(task.date ?? "");
    const normalizedDate = rawDate.includes("T") ? rawDate.split("T")[0] : rawDate;

    setFormData({
      intitule: task.intitule ?? "",
      date: normalizedDate,
      priorite: task.priorite ?? "moyenne",
    });
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const task = tasks.find((item) => item.id === taskId);
      if (!task) return;

      const nextStatut = isTaskCompleted(task) ? "en cours" : "terminée";

      const res = await fetch(`http://127.0.0.1:8000/api/taches/update/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ statut: nextStatut }),
      });

      const data = await res.json();

      if (res.ok) {
        await getTasks();
      } else {
        console.log(data);
        alert(data?.message || "Erreur lors du changement de statut");
      }
    } catch (error) {
      console.error("Erreur serveur:", error);
      alert("Erreur de connexion au serveur");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !isTaskCompleted(task);
    if (filter === "completed") return isTaskCompleted(task);
    return true;
  });

  const stats = {
    total: tasks.length,
    active: tasks.filter((t) => !isTaskCompleted(t)).length,
    completed: tasks.filter((t) => isTaskCompleted(t)).length,
  };

  // debut get user from token
 useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://127.0.0.1:8000/api/me", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
        } else {
          console.error(data);
        }
      } catch (error) {
        console.error("Erreur :", error);
      }
    };

    getUser(); // 🔥 appelé automatiquement
  }, []); // 🔥 tableau vide = s’exécute une seule fois



// debut get user initials
 const getInitials = () => {
  if (!user) return "U";

  const prenom = user.prenom || "";
  const nom = user.nom || "";

  return (prenom.charAt(0) + nom.charAt(0)).toUpperCase();
};
  
  //debut from date to string
  return (
    <div className="min-h-screen" style={{ background: "#0F0F13" }}>
      {/* Header */}
      <header
        className="h-16 border-b flex items-center justify-between px-8"
        style={{ background: "#1A1A24", borderColor: "#2E2E3E" }}
      >
        <Logo />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "#6C63FF", color: "white", fontWeight: 600 }}
            >
              {getInitials()}
            </div>
            <span style={{ color: "#F0F0F5" }}>
                {user?.prenom} {user?.nom}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-[#EF4444]/10"
            style={{ color: "#EF4444" }}
          >
            <LogOut className="w-4 h-4" />
            <span style={{ fontSize: "14px" }}>Déconnexion</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-10">
        {/* Page Title */}
        <div className="mb-8">
          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "28px",
              fontWeight: 700,
              color: "#F0F0F5",
            }}
          >
            Mes tâches
          </h1>
          <p style={{ fontSize: "14px", color: "#7A7A95", marginTop: "4px" }}>
            Gérez vos tâches au même endroit.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-4 mb-10 overflow-x-auto">
          <StatCard
            icon={<List className="w-6 h-6" />}
            label="Total"
            value={stats.total}
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            label="En cours"
            value={stats.active}
            iconColor="#F59E0B"
          />
          <StatCard
            icon={<CheckCircle className="w-6 h-6" />}
            label="Terminées"
            value={stats.completed}
            iconColor="#22C55E"
          />
        </div>

        {/* Form + Task List */}
        <div className="grid lg:grid-cols-[380px_1fr] gap-6">
          {/* Form Column */}
          <div
            className="rounded-[12px] p-7 border h-fit"
            style={{ background: "#1A1A24", borderColor: "#2E2E3E" }}
          >
            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "16px",
                fontWeight: 600,
                color: "#F0F0F5",
                marginBottom: "20px",
              }}
            >
              Ajouter / Modifier une tâche
            </h2>

            <form
              onSubmit={selectedTaskId ? handleUpdateTask : handleAddTask}
              className="flex flex-col gap-4"
            >
              <InputField
                placeholder="Intitulé de la tâche"
                value={formData.intitule}
                onChange={(e) =>
                  setFormData({ ...formData,intitule : e.target.value })
                }
                required
              />

              <InputField
                type="date"
                icon={<CalendarIcon className="w-5 h-5" />}
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />

              <div className="flex flex-col gap-2">
                <label style={{ fontSize: "12px", color: "#F0F0F5" }}>
                  Priorité
                </label>
                <select
                  value={formData.priorite}
                  onChange={(e) =>
                    setFormData({ ...formData, priorite: e.target.value })
                  }
                  className="h-12 rounded-[10px] border px-4 cursor-pointer"
                  style={{
                    background: "#1A1A24",
                    borderColor: "#2E2E3E",
                    color: "#F0F0F5",
                  }}
                >
                  <option value="faible">🟢 Basse</option>
                  <option value="moyenne">🟡 Moyenne</option>
                  <option value="haute">🔴 Haute</option>
                </select>
              </div>

              <div className="flex gap-3 mt-2">
                <Button
                  type="submit"
                  icon={
                    selectedTaskId ? (
                      <Edit className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )
                  }
                  className="flex-1"
                >
                  {selectedTaskId ? "Modifier" : "Ajouter"}
                </Button>
                {selectedTaskId && (
                  <Button
                    type="button"
                    variant="outline-violet"
                    onClick={() => {
                      setSelectedTaskId(null);
                      setFormData({
                        intitule: "",
                        date: "",
                        priorite: "moyenne",
                      });
                    }}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                )}
              </div>

              {selectedTaskId && (
                <Button
                  type="button"
                  variant="outline-red"
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={handleDeleteTask}
                  fullWidth
                >
                  Supprimer
                </Button>
              )}
            </form>
          </div>

          {/* Task List Column */}
          <div>
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {[
                { key: "all", label: "Toutes" },
                { key: "active", label: "En cours" },
                { key: "completed", label: "Termin\xE9es" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className="px-6 py-2 rounded-full transition-all whitespace-nowrap"
                  style={{
                    background: filter === tab.key ? "#6C63FF" : "#1A1A24",
                    color: filter === tab.key ? "white" : "#7A7A95",
                    fontWeight: 500,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tasks List */}
            <div className="flex flex-col gap-3">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-20">
                  <CheckCircle
                    className="w-20 h-20 mx-auto mb-4"
                    style={{ color: "#2E2E3E", opacity: 0.2 }}
                  />
                  <p style={{ fontSize: "16px", color: "#7A7A95" }}>
                    Aucune tâche pour l'instant
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#7A7A95",
                      marginTop: "8px",
                    }}
                  >
                    Ajoutez votre première tâche à gauche ✨
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isSelected={task.id === selectedTaskId}
                    onSelect={() => handleSelectTask(task)}
                    onToggleComplete={() => handleToggleComplete(task.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
export { Dashboard };
