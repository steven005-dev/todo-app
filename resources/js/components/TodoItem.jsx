import React, { useState } from 'react';

export default function TodoItem({ todo, onToggle, onUpdate, onDelete }) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(todo.title);

    function handleEdit() {
        setDraft(todo.title);
        setEditing(true);
    }

    function handleSave() {
        const trimmed = draft.trim();
        if (trimmed && trimmed !== todo.title) {
            onUpdate(todo.id, trimmed);
        }
        setEditing(false);
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') setEditing(false);
    }

    return (
        <li className="flex items-center gap-3 px-4 py-3 group hover:bg-gray-50 transition-colors">
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id, !todo.completed)}
                className="w-5 h-5 accent-indigo-600 cursor-pointer flex-shrink-0"
            />

            {editing ? (
                <input
                    autoFocus
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className="flex-1 text-sm px-2 py-1 rounded border border-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
            ) : (
                <span
                    onDoubleClick={handleEdit}
                    className={`flex-1 text-sm cursor-pointer select-none ${
                        todo.completed ? 'line-through text-gray-300' : 'text-gray-700'
                    }`}
                    title="Double-cliquer pour modifier"
                >
                    {todo.title}
                </span>
            )}

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!editing && (
                    <button
                        onClick={handleEdit}
                        className="text-gray-300 hover:text-indigo-500 text-xs p-1 transition-colors"
                        title="Modifier"
                    >
                        ✏️
                    </button>
                )}
                <button
                    onClick={() => onDelete(todo.id)}
                    className="text-gray-300 hover:text-red-500 text-xs p-1 transition-colors"
                    title="Supprimer"
                >
                    🗑️
                </button>
            </div>
        </li>
    );
}
