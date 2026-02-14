import React from "react";

const navItems = [
  { id: "summary", label: "Summary" },
  { id: "flashcards", label: "Flashcards" },
  { id: "insights", label: "Insights" },
  { id: "chat", label: "Chatbot" },
  { id: "video", label: "Video" },
];

function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <span className="navbar-logo">AI</span>
          <span className="navbar-title">Content Suite</span>
        </div>
        <ul className="navbar-links">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={activeTab === item.id ? "active" : ""}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
