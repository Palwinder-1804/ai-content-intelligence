import React, { useState } from "react";
import API from "../api";
import ErrorMessage from "./ErrorMessage";

function SearchPanel({ sessionId }) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [contexts, setContexts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async (e) => {
    e?.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setError("");
    setAnswer("");
    setContexts([]);

    try {
      const res = await API.post(`/search/${sessionId}`, {
        query: query.trim(),
      });

      const apiAnswer = res.data.answer || "";
      const apiContexts = res.data.contexts || [];

      setAnswer(apiAnswer);
      setContexts(apiContexts);

      if (!apiAnswer && apiContexts.length === 0) {
        setError("No relevant information found for this query.");
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Failed to search"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  return (
    <div className="card">
      <h3>🔍 Semantic Search</h3>
      <p style={{ color: "#64748b", marginBottom: "20px", fontSize: "14px" }}>
        Ask for a specific point and get a focused answer from your document
      </p>

      <ErrorMessage message={error} onDismiss={() => setError("")} />

      <form
        onSubmit={search}
        style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g. What are the main risks?  /  Give me the summary of section 3"
          disabled={loading}
          style={{ flex: 1, margin: 0 }}
        />
        <button type="submit" disabled={loading || !query.trim()}>
          {loading ? <span className="loading"></span> : "🔍 Search"}
        </button>
      </form>

      {answer && (
        <div className="summary-content">
          <h4 style={{ marginBottom: "10px", color: "#1e293b" }}>
            Answer to your question:
          </h4>
          <div>{answer}</div>
        </div>
      )}

      {contexts.length > 0 && (
        <div className="search-results">
          <h4 style={{ marginBottom: "15px", color: "#1e293b" }}>
            Relevant excerpts used for this answer:
          </h4>
          {contexts.map((result, i) => (
            <div key={i} className="search-result-item">
              <span className="result-index">{i + 1}</span>
              <span>{result}</span>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <span className="loading"></span>
          <span style={{ marginLeft: "10px", color: "#64748b" }}>
            Searching and generating answer...
          </span>
        </div>
      )}
    </div>
  );
}

export default SearchPanel;
