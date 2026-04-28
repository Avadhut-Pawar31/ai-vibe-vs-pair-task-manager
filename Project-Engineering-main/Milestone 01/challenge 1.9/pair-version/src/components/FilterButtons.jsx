import React from "react";

export default function FilterButtons({ currentFilter, onChangeFilter }) {
  const buttons = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <div className="filters">
      {buttons.map((b) => (
        <button
          key={b.key}
          className={b.key === currentFilter ? "btn filter active" : "btn filter"}
          onClick={() => onChangeFilter(b.key)}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}
