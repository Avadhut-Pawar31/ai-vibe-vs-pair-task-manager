import React, { useState } from "react";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import FilterButtons from "./components/FilterButtons";
import "./index.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all"); // all | active | completed

  const addTask = (title) => {
    if (!title.trim()) return;
    const newTask = {
      id: Date.now(),
      title: title.trim(),
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <div className="app-container">
      <header>
        <h1>Personal Task Manager</h1>
        <p className="subtitle">Simple tasks, built with React and useState</p>
      </header>

      <main>
        <TaskInput onAdd={addTask} />
        <FilterButtons currentFilter={filter} onChangeFilter={setFilter} />
        <TaskList tasks={filteredTasks} onToggleComplete={toggleComplete} />
      </main>

      <footer className="footer-note">
        <small>Pair-version assignment — beginner friendly</small>
      </footer>
    </div>
  );
}
