import React, { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

export default function App() {
    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTodos();
    }, []);

    async function fetchTodos() {
        try {
            const res = await fetch('/api/todos');
            if (!res.ok) throw new Error('Failed to fetch todos');
            const data = await res.json();
            setTodos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function addTodo(title) {
        const res = await fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ title }),
        });
        if (!res.ok) return;
        const todo = await res.json();
        setTodos(prev => [todo, ...prev]);
    }

    async function toggleTodo(id, completed) {
        const res = await fetch(`/api/todos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ completed }),
        });
        if (!res.ok) return;
        const updated = await res.json();
        setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
    }

    async function updateTodo(id, title) {
        const res = await fetch(`/api/todos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ title }),
        });
        if (!res.ok) return;
        const updated = await res.json();
        setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
    }

    async function deleteTodo(id) {
        const res = await fetch(`/api/todos/${id}`, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json' },
        });
        if (!res.ok) return;
        setTodos(prev => prev.filter(t => t.id !== id));
    }

    const filteredTodos = todos.filter(t => {
        if (filter === 'active') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
    });

    const remaining = todos.filter(t => !t.completed).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-start justify-center pt-16 px-4">
            <div className="w-full max-w-md">
                <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8 tracking-tight">
                    ✅ Todo App
                </h1>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <TodoForm onAdd={addTodo} />

                    {loading && (
                        <p className="text-center text-gray-400 py-8">Chargement…</p>
                    )}
                    {error && (
                        <p className="text-center text-red-500 py-4 px-6">{error}</p>
                    )}

                    {!loading && !error && (
                        <>
                            <div className="flex border-b border-gray-100">
                                {['all', 'active', 'completed'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${
                                            filter === f
                                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                                : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                    >
                                        {f === 'all' ? 'Tous' : f === 'active' ? 'Actifs' : 'Terminés'}
                                    </button>
                                ))}
                            </div>

                            <TodoList
                                todos={filteredTodos}
                                onToggle={toggleTodo}
                                onUpdate={updateTodo}
                                onDelete={deleteTodo}
                            />

                            <div className="flex items-center justify-between px-6 py-3 bg-gray-50 text-xs text-gray-400">
                                <span>{remaining} tâche{remaining !== 1 ? 's' : ''} restante{remaining !== 1 ? 's' : ''}</span>
                                {todos.some(t => t.completed) && (
                                    <button
                                        onClick={async () => {
                                            const done = todos.filter(t => t.completed);
                                            await Promise.all(done.map(t => deleteTodo(t.id)));
                                        }}
                                        className="text-red-400 hover:text-red-600 transition-colors"
                                    >
                                        Supprimer terminées
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
