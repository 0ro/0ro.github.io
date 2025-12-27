import { useStore } from "./store";
import { countDueDirections } from "./sm2";

export function Home() {
  const { flashcards, setView, startSession } = useStore();

  const dueCount = countDueDirections(flashcards);
  const totalCount = flashcards.length;

  const handleStartLearning = () => {
    if (totalCount > 0) {
      startSession();
    }
  };

  return (
    <div className="home">
      <div className="home-header">
        <h1 className="home-title">Flashcards</h1>
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

      <div className="home-actions">
        <button
          className="action-btn primary"
          onClick={handleStartLearning}
          disabled={totalCount === 0}
        >
          <span className="btn-text">Start Learning</span>
          {dueCount > 0 && (
            <span className="btn-badge">{dueCount} due</span>
          )}
        </button>

        <button
          className="action-btn secondary"
          onClick={() => setView("admin")}
        >
          <span className="btn-text">Manage Words</span>
        </button>

        <button
          className="action-btn secondary"
          onClick={() => setView("stats")}
        >
          <span className="btn-text">Statistics</span>
        </button>

        <button
          className="action-btn secondary"
          onClick={() => setView("help")}
        >
          <span className="btn-text">How It Works</span>
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
