import React from "react";

function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: "summary", label: "📝 Summary", icon: "📝" },
    { id: "flashcards", label: "🎓 Flashcards", icon: "🎓" },
    { id: "search", label: "🔍 Search", icon: "🔍" },
    { id: "chat", label: "💬 Chat", icon: "💬" },
    { id: "video", label: "🎥 Video", icon: "🎥" },
  ];

  return (
    <div className="sidebar">
      <h2>🧠 AI Content Suite</h2>
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={activeTab === item.id ? "active" : ""}
        >
          <span>{item.icon}</span>
          <span>{item.label.replace(item.icon, "").trim()}</span>
        </button>
      ))}
    </div>
  );
}

export default Sidebar;
