import React, { useState } from "react";

export default function TaskInput({ onAdd }) {
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    onAdd(title);
    setTitle("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="task-input">
      <input
        type="text"
        placeholder="Enter task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Task title"
      />
      <button onClick={handleAdd} className="btn primary">
        Add Task
      </button>
    </div>
  );
}
