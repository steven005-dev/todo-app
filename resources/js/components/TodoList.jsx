import React from 'react';
import TodoItem from './TodoItem';

export default function TodoList({ todos, onToggle, onUpdate, onDelete }) {
    if (todos.length === 0) {
        return (
            <div className="py-12 text-center text-gray-300 text-sm select-none">
                Aucune tâche ici 🎉
            </div>
        );
    }

    return (
        <ul className="divide-y divide-gray-50 max-h-[480px] overflow-y-auto">
            {todos.map(todo => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
}
