import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock } from "lucide-react";
import { AuthCard } from "../components/AuthCard";
import { InputField } from "../components/InputField";
import { Button } from "../components/Button";
function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (res.ok) {
        // 🔹 Stocker le token pour les prochaines requêtes
        localStorage.setItem("token", data.access_token);

        alert("Connexion réussie !");
        navigate("/dashboard"); // ou une page protégée
      } else {
        alert(data.message || "Erreur lors de la connexion");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion au serveur");
    }
};
  return (
    <AuthCard
      title="Bon retour 👋"
      subtitle="Connectez-vous pour accéder à vos tâches"
      footer={
        <>
          Pas encore de compte ?{" "}
          <a
            href="/register"
            onClick={(e) => {
              e.preventDefault();
              navigate("/register");
            }}
            style={{ color: "#6C63FF", fontWeight: 500 }}
          >
            S'inscrire
          </a>
        </>
      }
    >
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <InputField
          icon={<Mail className="w-5 h-5" />}
          type="email"
          placeholder="Adresse email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <InputField
          icon={<Lock className="w-5 h-5" />}
          isPassword
          placeholder="Mot de passe"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <div className="text-right">
          <a href="#" style={{ fontSize: "12px", color: "#6C63FF" }}>
            Mot de passe oublié ?
          </a>
        </div>
        <Button type="submit" fullWidth>
          Se connecter
        </Button>
      </form>
    </AuthCard>
  );
}
export { Login };
