import React, { useState, useRef } from "react";
import API from "../api";
import ErrorMessage from "./ErrorMessage";

function UploadPanel({ setSessionId }) {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Axios automatically sets Content-Type with boundary for FormData
      // Manually setting it breaks multipart encoding
      const res = await API.post("/upload/file", formData);

      setSessionId(res.data.session_id);
      setSuccess(`File "${file.name}" indexed successfully!`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to upload file"
      );
    } finally {
      setLoading(false);
    }
  };

  const uploadText = async () => {
    if (!text.trim()) {
      setError("Please enter some text");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await API.post("/upload/text", { text });
      setSessionId(res.data.session_id);
      setSuccess("Text indexed successfully!");
      setText("");
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to upload text"
      );
    } finally {
      setLoading(false);
    }
  };

  const uploadArticle = async () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await API.post("/upload/article", { url });
      setSessionId(res.data.session_id);
      setSuccess("Article indexed successfully!");
      setUrl("");
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to upload article"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>📥 Upload Content</h3>

      <ErrorMessage message={error} onDismiss={() => setError("")} />
      {success && <div className="success-message">{success}</div>}

      {/* File Upload */}
      <div
        className={`file-upload-area ${dragActive ? "dragover" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="upload-icon">📄</div>
        <div>
          <strong>Drag & drop a file here</strong>
        </div>
        <div className="upload-text">or click to browse</div>
        <div className="upload-text" style={{ fontSize: "12px", marginTop: "5px" }}>
          Supports: PDF, DOCX, Images (PNG, JPG), Videos (MP4, MOV, MKV)
        </div>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.docx,.png,.jpg,.jpeg,.mp4,.mov,.mkv"
        />
      </div>

      {/* Text Upload */}
      <div style={{ marginTop: "25px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
          Or paste raw text:
        </label>
        <textarea
          placeholder="Paste your text content here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
        />
        <button onClick={uploadText} disabled={loading || !text.trim()}>
          {loading ? <span className="loading"></span> : "📝 Upload Text"}
        </button>
      </div>

      {/* Article URL Upload */}
      <div style={{ marginTop: "25px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
          Or enter article URL:
        </label>
        <input
          type="url"
          placeholder="https://example.com/article"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
        <button onClick={uploadArticle} disabled={loading || !url.trim()}>
          {loading ? <span className="loading"></span> : "🌐 Upload Article"}
        </button>
      </div>
    </div>
  );
}

export default UploadPanel;
