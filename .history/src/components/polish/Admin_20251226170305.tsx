import { useState } from "react";
import { useStore } from "./store";
import type { Flashcard } from "./types";

export function Admin() {
  const { flashcards, addFlashcard, updateFlashcard, deleteFlashcard, setView, exportData, importData } =
    useStore();

  const [polish, setPolish] = useState("");
  const [russian, setRussian] = useState("");
  const [context, setContext] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [importText, setImportText] = useState("");
  const [showImport, setShowImport] = useState(false);

  const filteredCards = flashcards.filter(
    card =>
      card.polish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.russian.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!polish.trim() || !russian.trim()) return;

    if (editingId) {
      updateFlashcard(editingId, { polish, russian, context });
      setEditingId(null);
    } else {
      addFlashcard(polish, russian, context || undefined);
    }

    setPolish("");
    setRussian("");
    setContext("");
  };

  const handleEdit = (card: Flashcard) => {
    setEditingId(card.id);
    setPolish(card.polish);
    setRussian(card.russian);
    setContext(card.context || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setPolish("");
    setRussian("");
    setContext("");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this word?")) {
      deleteFlashcard(id);
    }
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `polish-flashcards-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (importData(importText)) {
      setImportText("");
      setShowImport(false);
      alert("Import successful!");
    } else {
      alert("Import failed. Please check the JSON format.");
    }
  };

  return (
    <div className="admin">
      <div className="admin-header">
        <button className="back-btn" onClick={() => setView("home")}>
          ← Back
        </button>
        <h1 className="admin-title">Manage Words</h1>
      </div>

      <form className="word-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="polish">🇵🇱 Polish</label>
            <input
              id="polish"
              type="text"
              value={polish}
              onChange={e => setPolish(e.target.value)}
              placeholder="Polish word"
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label htmlFor="russian">🇷🇺 Russian</label>
            <input
              id="russian"
              type="text"
              value={russian}
              onChange={e => setRussian(e.target.value)}
              placeholder="Russian translation"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="context">Context (optional)</label>
          <input
            id="context"
            type="text"
            value={context}
            onChange={e => setContext(e.target.value)}
            placeholder="Example sentence or additional context"
            autoComplete="off"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {editingId ? "Update Word" : "Add Word"}
          </button>
          {editingId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="admin-tools">
        <button className="tool-btn" onClick={handleExport}>
          📤 Export
        </button>
        <button
          className="tool-btn"
          onClick={() => setShowImport(!showImport)}
        >
          📥 Import
        </button>
      </div>

      {showImport && (
        <div className="import-section">
          <textarea
            value={importText}
            onChange={e => setImportText(e.target.value)}
            placeholder="Paste exported JSON here..."
            rows={4}
          />
          <button className="submit-btn" onClick={handleImport}>
            Import Data
          </button>
        </div>
      )}

      <div className="word-list-header">
        <h2>Words ({flashcards.length})</h2>
        <input
          type="text"
          className="search-input"
          placeholder="Search words..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="word-list">
        {filteredCards.length === 0 ? (
          <div className="empty-list">
            {searchQuery ? "No words match your search." : "No words added yet."}
          </div>
        ) : (
          filteredCards.map(card => (
            <div key={card.id} className="word-item">
              <div className="word-content">
                <div className="word-main">
                  <span className="polish-word">🇵🇱 {card.polish}</span>
                  <span className="word-separator">→</span>
                  <span className="russian-word">🇷🇺 {card.russian}</span>
                </div>
                {card.context && (
                  <div className="word-context">{card.context}</div>
                )}
                <div className="word-meta">
                  {card.repetitions > 0 && (
                    <span className="word-reps">
                      {card.repetitions} reviews
                    </span>
                  )}
                </div>
              </div>
              <div className="word-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(card)}
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(card.id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

