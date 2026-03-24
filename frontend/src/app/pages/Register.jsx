import { useState } from "react";
import { useNavigate } from "react-router";
import { User, Mail, Lock } from "lucide-react";
import { AuthCard } from "../components/AuthCard";
import { InputField } from "../components/InputField";
import { Button } from "../components/Button";
function Register() {
   const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  
const handleSubmit = async (e)=>{
  e.preventDefault();
  
   try {
    const res = await fetch("http://127.0.0.1:8000/api/register",{
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    });
    const data = await res.json();

    if (res.ok) {
      // 🔹 Stocke le token JWT reçu
      localStorage.setItem("token", data.access_token);

      alert("Inscription réussie !");
      navigate("/login"); // redirige vers une page protégée
    } else {
      console.log(data);
      alert(data?.message || "Erreur lors de l'inscription");
    }
  } catch (error) {
    console.error("Erreur de connexion au serveur:", error);
    alert("Erreur de connexion au serveur");
  }
}

return (
    <AuthCard
      title="Créer un compte"
      subtitle="Commencez à organiser vos tâches dès aujourd'hui"
      footer={
        <>
          Vous avez déjà un compte ?{" "}
          <a
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
            style={{ color: "#6C63FF", fontWeight: 500 }}
          >
            Se connecter
          </a>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputField
          icon={<User className="w-5 h-5" />}
          placeholder="Nom"
          value={formData.nom}
          onChange={(e) =>
            setFormData({ ...formData, nom: e.target.value })
          }
          required
        />
        <InputField
          icon={<User className="w-5 h-5" />}
          placeholder="Prenom"
          value={formData.prenom}
          onChange={(e) =>
            setFormData({ ...formData, prenom: e.target.value })
          }
          required
        />
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
        
        <Button type="submit" fullWidth className="mt-2">
          S'inscrire
        </Button>
      </form>
    </AuthCard>
  );
}


export { Register };
