import React, { useState } from 'react';

export default function TodoForm({ onAdd }) {
    const [title, setTitle] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        const trimmed = title.trim();
        if (!trimmed) return;
        onAdd(trimmed);
        setTitle('');
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-b border-gray-100">
            <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ajouter une tâche…"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
            <button
                type="submit"
                disabled={!title.trim()}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                Ajouter
            </button>
        </form>
    );
}
