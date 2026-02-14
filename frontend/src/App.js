import React, { useState } from "react";
import Navbar from "./components/Navbar";
import UploadPanel from "./components/UploadPanel";
import SummaryPanel from "./components/SummaryPanel";
import FlashcardsPanel from "./components/FlashcardsPanel";
import InsightPanel from "./components/InsightPanel";
import ChatPanel from "./components/ChatPanel";
import VideoPanel from "./components/VideoPanel";
import "./styles.css";

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <div className="app">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="main">
        <UploadPanel setSessionId={setSessionId} />

        {activeTab === "summary" && sessionId && (
          <SummaryPanel sessionId={sessionId} />
        )}

        {activeTab === "flashcards" && sessionId && (
          <FlashcardsPanel sessionId={sessionId} />
        )}

        {activeTab === "insights" && sessionId && (
          <InsightPanel sessionId={sessionId} />
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
