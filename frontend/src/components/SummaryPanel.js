import React, { useState, useEffect } from "react";
import API from "../api";
import ErrorMessage from "./ErrorMessage";

function SummaryPanel({ sessionId }) {
  const [summary, setSummary] = useState("");
  const [styles, setStyles] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState("executive");
  const [lengthOption, setLengthOption] = useState("short"); // short, medium, long, custom
  const [customWords, setCustomWords] = useState(100);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/summary/styles")
      .then((res) => {
        setStyles(res.data.available_styles || []);
        if (res.data.available_styles && res.data.available_styles.length > 0) {
          setSelectedStyle(res.data.available_styles[0]);
        }
      })
      .catch((err) => {
        setError("Failed to load summary styles");
        console.error(err);
      });
  }, []);

  const getMaxWords = () => {
    switch (lengthOption) {
      case "short":
        return 50;
      case "medium":
        return 150;
      case "long":
        return 300;
      case "custom":
        return customWords;
      default:
        return 100;
    }
  };

  const generateSummary = async () => {
    setLoading(true);
    setError("");
    setSummary("");
    setIsExpanded(false);

    try {
      const maxWords = getMaxWords();
      const res = await API.post(`/summarize/${sessionId}`, {
        style: selectedStyle,
        max_words: maxWords,
      });
      setSummary(res.data.summary || "");
      
      if (!res.data.summary) {
        setError("No summary generated. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Failed to generate summary"
      );
    } finally {
      setLoading(false);
    }
  };

  const wordCount = summary ? summary.split(/\s+/).length : 0;
  const shouldTruncate = wordCount > 100 && !isExpanded;
  const displaySummary = shouldTruncate 
    ? summary.split(/\s+/).slice(0, 100).join(" ") + "..."
    : summary;

  return (
    <div className="card">
      <h3>🧠 Generate Summary</h3>
      <p style={{ color: "#64748b", marginBottom: "20px", fontSize: "14px" }}>
        Generate a concise summary of your document in different styles and lengths
      </p>

      <ErrorMessage message={error} onDismiss={() => setError("")} />

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
          Select Summary Style:
        </label>
        <select
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value)}
          disabled={loading || styles.length === 0}
        >
          {styles.map((style) => (
            <option key={style} value={style}>
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
          Summary Length:
        </label>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
            <input
              type="radio"
              value="short"
              checked={lengthOption === "short"}
              onChange={(e) => setLengthOption(e.target.value)}
              disabled={loading}
            />
            <span>Short (~50 words)</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
            <input
              type="radio"
              value="medium"
              checked={lengthOption === "medium"}
              onChange={(e) => setLengthOption(e.target.value)}
              disabled={loading}
            />
            <span>Medium (~150 words)</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
            <input
              type="radio"
              value="long"
              checked={lengthOption === "long"}
              onChange={(e) => setLengthOption(e.target.value)}
              disabled={loading}
            />
            <span>Long (~300 words)</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
            <input
              type="radio"
              value="custom"
              checked={lengthOption === "custom"}
              onChange={(e) => setLengthOption(e.target.value)}
              disabled={loading}
            />
            <span>Custom:</span>
            <input
              type="number"
              min="20"
              max="500"
              value={customWords}
              onChange={(e) => setCustomWords(parseInt(e.target.value) || 100)}
              disabled={loading || lengthOption !== "custom"}
              style={{ width: "80px", padding: "6px", marginLeft: "5px" }}
            />
            <span>words</span>
          </label>
        </div>
      </div>

      <button onClick={generateSummary} disabled={loading || styles.length === 0}>
        {loading ? (
          <>
            <span className="loading"></span> Generating...
          </>
        ) : (
          "📝 Generate Summary"
        )}
      </button>

      {summary && (
        <div className="summary-content">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <h4 style={{ margin: 0, color: "#1e293b" }}>
              Summary ({selectedStyle}, {wordCount} words):
            </h4>
            {wordCount > 100 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  background: "rgba(102, 126, 234, 0.1)",
                  color: "#667eea",
                  border: "1px solid rgba(102, 126, 234, 0.3)",
                }}
              >
                {isExpanded ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
          <div style={{ 
            lineHeight: "1.8",
            color: "#334155",
            whiteSpace: "pre-wrap",
            fontSize: "15px",
          }}>
            {displaySummary}
          </div>
        </div>
      )}

      {loading && !summary && (
        <div className="loading-container">
          <span className="loading"></span>
          <span style={{ marginLeft: "10px", color: "#64748b" }}>
            Generating summary...
          </span>
        </div>
      )}
    </div>
  );
}

export default SummaryPanel;
