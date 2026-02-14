import React, { useState } from "react";
import API from "../api";
import ErrorMessage from "./ErrorMessage";

function FlashcardsPanel({ sessionId }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadFlashcards = async () => {
    setLoading(true);
    setError("");
    setCards([]);

    try {
      const res = await API.get(`/flashcards/${sessionId}`);
      setCards(res.data.flashcards || []);
      
      if (!res.data.flashcards || res.data.flashcards.length === 0) {
        setError("No flashcards generated. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Failed to generate flashcards"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>🎓 Flashcards Generator</h3>
      <p style={{ color: "#64748b", marginBottom: "20px", fontSize: "14px" }}>
        Generate study flashcards from your document content
      </p>

      <ErrorMessage message={error} onDismiss={() => setError("")} />

      <button onClick={loadFlashcards} disabled={loading}>
        {loading ? (
          <>
            <span className="loading"></span> Generating...
          </>
        ) : (
          "🎓 Generate Flashcards"
        )}
      </button>

      {cards.length > 0 && (
        <div className="flashcards-grid">
          {cards.map((card, i) => (
            <div key={i} className="flashcard">
              <div className="question">
                <strong>Q{i + 1}:</strong> {card.question || "Question"}
              </div>
              <div className="divider"></div>
              <div className="answer">
                <strong>A:</strong> {card.answer || "Answer"}
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && cards.length === 0 && (
        <div className="loading-container">
          <span className="loading"></span>
          <span style={{ marginLeft: "10px", color: "#64748b" }}>
            Generating flashcards...
          </span>
        </div>
      )}
    </div>
  );
}

export default FlashcardsPanel;
