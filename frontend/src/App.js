import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import UploadPanel from "./components/UploadPanel";
import SummaryPanel from "./components/SummaryPanel";
import FlashcardsPanel from "./components/FlashcardsPanel";
import SearchPanel from "./components/SearchPanel";
import ChatPanel from "./components/ChatPanel";
import VideoPanel from "./components/VideoPanel";
import "./styles.css";

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <div className="app">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="main">
        <UploadPanel setSessionId={setSessionId} />

        {activeTab === "summary" && sessionId && (
          <SummaryPanel sessionId={sessionId} />
        )}

        {activeTab === "flashcards" && sessionId && (
          <FlashcardsPanel sessionId={sessionId} />
        )}

        {activeTab === "search" && sessionId && (
          <SearchPanel sessionId={sessionId} />
        )}

        {activeTab === "chat" && sessionId && (
          <ChatPanel sessionId={sessionId} />
        )}

        {activeTab === "video" && <VideoPanel />}
      </div>
    </div>
  );
}

export default App;
