import React, { useState, useRef } from "react";
import API from "../api";
import ErrorMessage from "./ErrorMessage";

const INPUT_TYPES = [
  { id: "file", label: "File", icon: "📄" },
  { id: "text", label: "Text", icon: "📝" },
  { id: "url", label: "Article URL", icon: "🔗" },
];

function UploadPanel({ setSessionId }) {
  const [inputType, setInputType] = useState("text");
  const [showAddMenu, setShowAddMenu] = useState(false);
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
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) await uploadFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = async (e) => {
    if (e.target.files?.[0]) await uploadFile(e.target.files[0]);
  };

  const uploadFile = async (file) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await API.post("/upload/file", formData);
      setSessionId(res.data.session_id);
      setSuccess(`File "${file.name}" indexed successfully.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to upload file");
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
      setSuccess("Text indexed successfully.");
      setText("");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to upload text");
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
      setSuccess("Article indexed successfully.");
      setUrl("");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to fetch article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card card-upload">
      <div className="upload-header">
        <h3>Add content</h3>
        <div className="upload-type-tabs">
          <button
            type="button"
            className="btn-add-type"
            onClick={() => setShowAddMenu(!showAddMenu)}
            title="Add or switch input type"
            aria-expanded={showAddMenu}
          >
            <span className="btn-add-icon">+</span>
            <span className="btn-add-label">Input type</span>
          </button>
          {showAddMenu && (
            <div className="upload-type-menu">
              {INPUT_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={inputType === t.id ? "active" : ""}
                  onClick={() => {
                    setInputType(t.id);
                    setShowAddMenu(false);
                  }}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          )}
          <div className="upload-type-badge">
            {INPUT_TYPES.find((t) => t.id === inputType)?.icon} {INPUT_TYPES.find((t) => t.id === inputType)?.label}
          </div>
        </div>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError("")} />
      {success && <div className="success-message">{success}</div>}

      {inputType === "file" && (
        <div
          className={`file-upload-area ${dragActive ? "dragover" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-icon">📄</div>
          <strong>Drag & drop a file</strong>
          <span className="upload-text">or click to browse</span>
          <span className="upload-hint">PDF, DOCX, PNG, JPG, MP4, MOV, MKV</span>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.docx,.png,.jpg,.jpeg,.mp4,.mov,.mkv"
          />
        </div>
      )}

      {inputType === "text" && (
        <div className="upload-text-block">
          <label>Paste or type your content</label>
          <textarea
            placeholder="Paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
          />
          <button onClick={uploadText} disabled={loading || !text.trim()} className="btn-primary">
            {loading ? <span className="loading"></span> : "Index text"}
          </button>
        </div>
      )}

      {inputType === "url" && (
        <div className="upload-url-block">
          <label>Article or page URL</label>
          <input
            type="url"
            placeholder="https://example.com/article"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
          <button onClick={uploadArticle} disabled={loading || !url.trim()} className="btn-primary">
            {loading ? <span className="loading"></span> : "Fetch & index"}
          </button>
        </div>
      )}
    </div>
  );
}

export default UploadPanel;
