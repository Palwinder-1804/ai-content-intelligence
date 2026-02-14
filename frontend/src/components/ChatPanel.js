import React, { useState, useEffect, useRef } from "react";
import API from "../api";
import ErrorMessage from "./ErrorMessage";

function ChatPanel({ sessionId }) {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!query.trim() || loading) return;

    const userMessage = query.trim();
    setQuery("");
    setError("");
    setLoading(true);

    // Add user message immediately
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);

    try {
      const res = await API.post(`/chat/${sessionId}`, { query: userMessage });

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: res.data.answer },
      ]);
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Failed to send message"
      );
      // Remove user message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="card">
      <h3>💬 Chat</h3>
      <p style={{ color: "#64748b", marginBottom: "12px", fontSize: "14px" }}>
        Search your document or ask anything—answers use your content when relevant, or general knowledge otherwise.
      </p>

      <ErrorMessage message={error} onDismiss={() => setError("")} />

      <div className="chat-box">
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "#64748b", padding: "40px" }}>
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>💬</div>
            <div>Ask about your document or any general question</div>
            <div style={{ fontSize: "14px", marginTop: "10px" }}>
              e.g. &quot;What does section 3 say?&quot; or &quot;Explain machine learning basics&quot;
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`message ${m.role}`}>
              <strong>{m.role === "user" ? "You" : "AI Assistant"}</strong>
              <div style={{ marginTop: "5px" }}>{m.text}</div>
            </div>
          ))
        )}
        {loading && (
          <div className="message ai">
            <strong>AI Assistant</strong>
            <div style={{ marginTop: "5px" }}>
              <span className="loading"></span> Thinking...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={sendMessage} className="chat-input-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your question here... (Press Enter to send)"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !query.trim()}>
          {loading ? <span className="loading"></span> : "Send"}
        </button>
      </form>
    </div>
  );
}

export default ChatPanel;
