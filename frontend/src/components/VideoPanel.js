import React, { useState } from "react";
import API from "../api";
import ErrorMessage from "./ErrorMessage";

function VideoPanel() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const summarizeVideo = async (e) => {
    e?.preventDefault();
    if (!url.trim() || loading) return;

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const res = await API.post("/video/summarize", { url: url.trim() });
      setSummary(res.data.summary || "");
      
      if (!res.data.summary) {
        setError("No summary generated. Please check the URL.");
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Failed to summarize video"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      summarizeVideo();
    }
  };

  return (
    <div className="card">
      <h3>🎥 YouTube Video Summarizer</h3>
      <p style={{ color: "#64748b", marginBottom: "20px", fontSize: "14px" }}>
        Enter a YouTube URL to get an AI-generated summary of the video content
      </p>

      <ErrorMessage message={error} onDismiss={() => setError("")} />

      <form onSubmit={summarizeVideo} className="video-input-container">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="https://www.youtube.com/watch?v=..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !url.trim()}>
          {loading ? <span className="loading"></span> : "📝 Summarize"}
        </button>
      </form>

      {summary && (
        <div className="video-summary">
          <h4 style={{ marginBottom: "15px", color: "#1e293b" }}>
            Video Summary:
          </h4>
          <div>{summary}</div>
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <span className="loading"></span>
          <span style={{ marginLeft: "10px", color: "#64748b" }}>
            Processing video... This may take a while.
          </span>
        </div>
      )}
    </div>
  );
}

export default VideoPanel;
