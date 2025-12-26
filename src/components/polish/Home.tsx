import { useStore } from "./store";
import { getDueCards } from "./sm2";
import type { Direction } from "./types";
import { useState } from "react";

export function Home() {
  const { flashcards, setView, startSession } = useStore();
  const [selectedDirection, setSelectedDirection] =
    useState<Direction>("polish-to-russian");

  const dueCount = getDueCards(flashcards).length;
  const totalCount = flashcards.length;

  const handleStartLearning = () => {
    if (totalCount > 0) {
      startSession(selectedDirection);
    }
  };

  return (
    <div className="home">
      <div className="home-header">
        <h1 className="home-title">🇵🇱 Polish Flashcards</h1>
        <p className="home-subtitle">
          Learn Polish with spaced repetition
        </p>
      </div>

      <div className="stats-preview">
        <div className="stat-item">
          <span className="stat-value">{totalCount}</span>
          <span className="stat-label">Total Words</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{dueCount}</span>
          <span className="stat-label">Due Today</span>
        </div>
      </div>

      {totalCount > 0 && (
        <div className="direction-selector">
          <label className="direction-label">
            Learning Direction:
          </label>
          <div className="direction-options">
            <button
              className={`direction-btn ${
                selectedDirection === "polish-to-russian"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setSelectedDirection("polish-to-russian")
              }
            >
              🇵🇱 → 🇷🇺
              <span>Polish to Russian</span>
            </button>
            <button
              className={`direction-btn ${
                selectedDirection === "russian-to-polish"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setSelectedDirection("russian-to-polish")
              }
            >
              🇷🇺 → 🇵🇱
              <span>Russian to Polish</span>
            </button>
          </div>
        </div>
      )}

      <div className="home-actions">
        <button
          className="action-btn primary"
          onClick={handleStartLearning}
          disabled={totalCount === 0}
        >
          <span className="btn-icon">📚</span>
          <span className="btn-text">Start Learning</span>
          {dueCount > 0 && (
            <span className="btn-badge">{dueCount} due</span>
          )}
        </button>

        <button
          className="action-btn secondary"
          onClick={() => setView("admin")}
        >
          <span className="btn-icon">➕</span>
          <span className="btn-text">Manage Words</span>
        </button>

        <button
          className="action-btn secondary"
          onClick={() => setView("stats")}
        >
          <span className="btn-icon">📊</span>
          <span className="btn-text">Statistics</span>
        </button>
      </div>

      {totalCount === 0 && (
        <div className="empty-state">
          <p>No words yet! Add some words to get started.</p>
          <button
            className="action-btn primary"
            onClick={() => setView("admin")}
          >
            Add Your First Word
          </button>
        </div>
      )}
    </div>
  );
}
