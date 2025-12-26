import { useStore } from "./store";
import { getMasteryStats, getDueCards, getMasteryLabel } from "./sm2";
import type { StatusChange, MasteryLevel } from "./types";

export function Stats() {
  const { flashcards, setView } = useStore();

  const masteryStats = getMasteryStats(flashcards);
  const dueCards = getDueCards(flashcards);
  const totalCards = flashcards.length;

  // Calculate average ease factor
  const avgEaseFactor =
    totalCards > 0
      ? flashcards.reduce((sum, c) => sum + c.easeFactor, 0) /
        totalCards
      : 0;

  // Calculate total reviews
  const totalReviews = flashcards.reduce(
    (sum, c) => sum + c.repetitions,
    0
  );

  // Get recently added words
  const recentWords = [...flashcards]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  // Get words needing most practice (lowest repetitions, excluding new)
  const needsPractice = [...flashcards]
    .filter(c => c.repetitions > 0)
    .sort((a, b) => a.repetitions - b.repetitions)
    .slice(0, 5);

  // Get all status changes with word info, sorted by most recent
  interface StatusChangeWithWord extends StatusChange {
    wordId: string;
    polish: string;
  }

  const allStatusChanges: StatusChangeWithWord[] = flashcards
    .flatMap(card =>
      (card.statusHistory || []).map(change => ({
        ...change,
        wordId: card.id,
        polish: card.polish,
      }))
    )
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 20);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - timestamp;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="stats">
      <div className="stats-header">
        <button className="back-btn" onClick={() => setView("home")}>
          ← Back
        </button>
        <h1 className="stats-title">Statistics</h1>
      </div>

      <div className="stats-overview">
        <div className="overview-card">
          <span className="overview-value">{totalCards}</span>
          <span className="overview-label">Total Words</span>
        </div>
        <div className="overview-card">
          <span className="overview-value">{dueCards.length}</span>
          <span className="overview-label">Due Today</span>
        </div>
        <div className="overview-card">
          <span className="overview-value">{totalReviews}</span>
          <span className="overview-label">Total Reviews</span>
        </div>
        <div className="overview-card">
          <span className="overview-value">
            {avgEaseFactor.toFixed(2)}
          </span>
          <span className="overview-label">Avg. Ease</span>
        </div>
      </div>

      <div className="mastery-section">
        <h2 className="section-title">Mastery Levels</h2>
        <div className="mastery-bars">
          <div className="mastery-item">
            <div className="mastery-label">
              <span className="mastery-name">New</span>
              <span className="mastery-count">
                {masteryStats.newCards}
              </span>
            </div>
            <div className="mastery-bar">
              <div
                className="mastery-fill new"
                style={{
                  width:
                    totalCards > 0
                      ? `${
                          (masteryStats.newCards / totalCards) * 100
                        }%`
                      : "0%",
                }}
              />
            </div>
          </div>
          <div className="mastery-item">
            <div className="mastery-label">
              <span className="mastery-name">Learning</span>
              <span className="mastery-count">
                {masteryStats.learning}
              </span>
            </div>
            <div className="mastery-bar">
              <div
                className="mastery-fill learning"
                style={{
                  width:
                    totalCards > 0
                      ? `${
                          (masteryStats.learning / totalCards) * 100
                        }%`
                      : "0%",
                }}
              />
            </div>
          </div>
          <div className="mastery-item">
            <div className="mastery-label">
              <span className="mastery-name">Reviewing</span>
              <span className="mastery-count">
                {masteryStats.reviewing}
              </span>
            </div>
            <div className="mastery-bar">
              <div
                className="mastery-fill reviewing"
                style={{
                  width:
                    totalCards > 0
                      ? `${
                          (masteryStats.reviewing / totalCards) * 100
                        }%`
                      : "0%",
                }}
              />
            </div>
          </div>
          <div className="mastery-item">
            <div className="mastery-label">
              <span className="mastery-name">Mastered</span>
              <span className="mastery-count">
                {masteryStats.mastered}
              </span>
            </div>
            <div className="mastery-bar">
              <div
                className="mastery-fill mastered"
                style={{
                  width:
                    totalCards > 0
                      ? `${
                          (masteryStats.mastered / totalCards) * 100
                        }%`
                      : "0%",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {recentWords.length > 0 && (
        <div className="word-list-section">
          <h2 className="section-title">Recently Added</h2>
          <div className="mini-word-list">
            {recentWords.map(word => (
              <div key={word.id} className="mini-word-item">
                <span className="mini-polish">{word.polish}</span>
                <span className="mini-separator">→</span>
                <span className="mini-russian">{word.russian}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {needsPractice.length > 0 && (
        <div className="word-list-section">
          <h2 className="section-title">Needs Practice</h2>
          <div className="mini-word-list">
            {needsPractice.map(word => (
              <div key={word.id} className="mini-word-item">
                <span className="mini-polish">{word.polish}</span>
                <span className="mini-separator">→</span>
                <span className="mini-russian">{word.russian}</span>
                <span className="mini-reps">
                  {word.repetitions} reviews
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {allStatusChanges.length > 0 && (
        <div className="history-section">
          <h2 className="section-title">Progress History</h2>
          <div className="history-list">
            {allStatusChanges.map((change, index) => (
              <div
                key={`${change.wordId}-${change.timestamp}-${index}`}
                className="history-item"
              >
                <span className="history-date">
                  {formatDate(change.timestamp)}
                </span>
                <span className="history-word">{change.polish}</span>
                <div className="history-change">
                  <span className={`level-badge ${change.fromLevel}`}>
                    {getMasteryLabel(change.fromLevel)}
                  </span>
                  <span className="history-arrow">→</span>
                  <span className={`level-badge ${change.toLevel}`}>
                    {getMasteryLabel(change.toLevel)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalCards === 0 && (
        <div className="empty-stats">
          <p>No words yet. Add some words to see your statistics!</p>
          <button
            className="action-btn primary"
            onClick={() => setView("admin")}
          >
            Add Words
          </button>
        </div>
      )}
    </div>
  );
}
