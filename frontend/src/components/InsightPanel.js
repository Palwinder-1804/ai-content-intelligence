import React, { useState } from "react";
import API from "../api";
import ErrorMessage from "./ErrorMessage";

function InsightPanel({ sessionId }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadInsights = async () => {
    setLoading(true);
    setError("");
    setInsights([]);

    try {
      const res = await API.get(`/insights/${sessionId}`);
      setInsights(res.data.insights || []);

      if (!res.data.insights || res.data.insights.length === 0) {
        setError("No insights extracted. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Failed to extract insights"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>💡 Insight Extraction</h3>
      <p style={{ color: "#64748b", marginBottom: "20px", fontSize: "14px" }}>
        Extract key takeaways, important points, and actionable insights from your document
      </p>

      <ErrorMessage message={error} onDismiss={() => setError("")} />

      <button onClick={loadInsights} disabled={loading} style={{ marginBottom: "20px" }}>
        {loading ? (
          <>
            <span className="loading"></span> Extracting...
          </>
        ) : (
          "💡 Extract Insights"
        )}
      </button>

      {insights.length > 0 && (
        <div className="search-results">
          <h4 style={{ marginBottom: "15px", color: "#1e293b" }}>
            Key insights:
          </h4>
          {insights.map((insight, i) => (
            <div key={i} className="search-result-item">
              <span className="result-index">{i + 1}</span>
              <span>{insight}</span>
            </div>
          ))}
        </div>
      )}

      {loading && insights.length === 0 && (
        <div className="loading-container">
          <span className="loading"></span>
          <span style={{ marginLeft: "10px", color: "#64748b" }}>
            Extracting insights...
          </span>
        </div>
      )}
    </div>
  );
}

export default InsightPanel;
