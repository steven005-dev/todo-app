# Todo App — Laravel 12 + React

Une application de liste de tâches (todo list) construite avec **Laravel 12** pour le backend et **React** pour le frontend, utilisant **Vite** et **Tailwind CSS**.

## Fonctionnalités

- ✅ Créer une tâche
- ✏️ Modifier le titre d'une tâche (double-clic sur la tâche)
- ☑️ Marquer une tâche comme terminée
- 🗑️ Supprimer une tâche
- 🔍 Filtrer les tâches : Toutes / Actives / Terminées
- 🧹 Supprimer toutes les tâches terminées en un clic

## Stack technique

| Couche     | Technologie              |
|------------|--------------------------|
| Backend    | Laravel 12 (PHP 8.3)     |
| Frontend   | React 19 + Vite 8        |
| Style      | Tailwind CSS 4           |
| Base de données | SQLite (dev) / MySQL (prod) |
| API        | REST JSON (`/api/todos`) |

## Installation

### Prérequis

- PHP >= 8.2
- Composer
- Node.js >= 18
- npm

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/steven005-dev/todo-app.git
cd todo-app

# 2. Installer les dépendances PHP
composer install

# 3. Copier le fichier d'environnement
cp .env.example .env

# 4. Générer la clé d'application
php artisan key:generate

# 5. Configurer la base de données (SQLite par défaut)
touch database/database.sqlite

# 6. Exécuter les migrations
php artisan migrate

# 7. Installer les dépendances Node
npm install

# 8. Compiler les assets (développement)
npm run dev

# 9. Démarrer le serveur Laravel (dans un autre terminal)
php artisan serve
```

Accéder à l'application : **http://localhost:8000**

## API REST

| Méthode | Endpoint            | Description              |
|---------|---------------------|--------------------------|
| GET     | `/api/todos`        | Lister toutes les tâches |
| POST    | `/api/todos`        | Créer une nouvelle tâche |
| PUT     | `/api/todos/{id}`   | Modifier une tâche       |
| DELETE  | `/api/todos/{id}`   | Supprimer une tâche      |

## Tests

```bash
php artisan test
```

## Build de production

```bash
npm run build
```
