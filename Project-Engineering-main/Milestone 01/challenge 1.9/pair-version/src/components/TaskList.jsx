import React from "react";

export default function TaskList({ tasks, onToggleComplete }) {
  if (tasks.length === 0) {
    return <p className="empty">No tasks to show.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className="task-item">
          <label className="task-label">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
            />
            <span className={task.completed ? "task-title completed" : "task-title"}>
              {task.title}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}
