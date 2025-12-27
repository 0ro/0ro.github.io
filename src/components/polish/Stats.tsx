import { useStore } from "./store";
import {
  getMasteryStats,
  countDueDirections,
  getMasteryLabel,
  getDirectionMasteryStats,
  getDirectionMasteryLevel,
} from "./sm2";
import type { StatusChange } from "./types";

export function Stats() {
  const { flashcards, setView } = useStore();

  const overallStats = getMasteryStats(flashcards);
  const plToRuStats = getDirectionMasteryStats(
    flashcards,
    "polish-to-russian"
  );
  const ruToPlStats = getDirectionMasteryStats(
    flashcards,
    "russian-to-polish"
  );
  const dueCount = countDueDirections(flashcards);
  const totalCards = flashcards.length;

  // Calculate total reviews across both directions
  const totalReviews = flashcards.reduce(
    (sum, c) =>
      sum +
      c.polishToRussian.repetitions +
      c.russianToPolish.repetitions,
    0
  );

  // Get recently added words
  const recentWords = [...flashcards]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  // Get words needing most practice (lowest combined repetitions)
  const needsPractice = [...flashcards]
    .filter(
      c =>
        c.polishToRussian.repetitions > 0 ||
        c.russianToPolish.repetitions > 0
    )
    .sort(
      (a, b) =>
        a.polishToRussian.repetitions +
        a.russianToPolish.repetitions -
        (b.polishToRussian.repetitions +
          b.russianToPolish.repetitions)
    )
    .slice(0, 5);

  // Get all status changes with word info, sorted by most recent
  interface StatusChangeWithWord extends StatusChange {
    wordId: string;
    polish: string;
    direction: string;
  }

  const allStatusChanges: StatusChangeWithWord[] = flashcards
    .flatMap(card => [
      ...(card.polishToRussian.statusHistory || []).map(change => ({
        ...change,
        wordId: card.id,
        polish: card.polish,
        direction: "PL to RU",
      })),
      ...(card.russianToPolish.statusHistory || []).map(change => ({
        ...change,
        wordId: card.id,
        polish: card.polish,
        direction: "RU to PL",
      })),
    ])
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
          Back
        </button>
        <h1 className="stats-title">Statistics</h1>
      </div>

      <div className="stats-overview">
        <div className="overview-card">
          <span className="overview-value">{totalCards}</span>
          <span className="overview-label">Total Words</span>
        </div>
        <div className="overview-card">
          <span className="overview-value">{dueCount}</span>
          <span className="overview-label">Due Today</span>
        </div>
        <div className="overview-card">
          <span className="overview-value">{totalReviews}</span>
          <span className="overview-label">Total Reviews</span>
        </div>
        <div className="overview-card">
          <span className="overview-value">
            {overallStats.mastered}
          </span>
          <span className="overview-label">Fully Mastered</span>
        </div>
      </div>

      <div className="mastery-section">
        <h2 className="section-title">Overall Mastery</h2>
        <p className="section-desc">
          Words are fully mastered when both directions reach 6+
          correct answers.
        </p>
        <div className="mastery-bars">
          <div className="mastery-item">
            <div className="mastery-label">
              <span className="mastery-name">New</span>
              <span className="mastery-count">
                {overallStats.newCards}
              </span>
            </div>
            <div className="mastery-bar">
              <div
                className="mastery-fill new"
                style={{
                  width:
                    totalCards > 0
                      ? `${
                          (overallStats.newCards / totalCards) * 100
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
                {overallStats.learning}
              </span>
            </div>
            <div className="mastery-bar">
              <div
                className="mastery-fill learning"
                style={{
                  width:
                    totalCards > 0
                      ? `${
                          (overallStats.learning / totalCards) * 100
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
                {overallStats.reviewing}
              </span>
            </div>
            <div className="mastery-bar">
              <div
                className="mastery-fill reviewing"
                style={{
                  width:
                    totalCards > 0
                      ? `${
                          (overallStats.reviewing / totalCards) * 100
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
                {overallStats.mastered}
              </span>
            </div>
            <div className="mastery-bar">
              <div
                className="mastery-fill mastered"
                style={{
                  width:
                    totalCards > 0
                      ? `${
                          (overallStats.mastered / totalCards) * 100
                        }%`
                      : "0%",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="direction-stats">
        <div className="direction-stat-card">
          <h3 className="direction-stat-title">Polish to Russian</h3>
          <div className="direction-stat-row">
            <span className="direction-stat-label">Mastered</span>
            <span className="direction-stat-value">
              {plToRuStats.mastered} / {totalCards}
            </span>
          </div>
          <div className="direction-stat-row">
            <span className="direction-stat-label">Learning</span>
            <span className="direction-stat-value">
              {plToRuStats.learning + plToRuStats.reviewing}
            </span>
          </div>
          <div className="direction-stat-row">
            <span className="direction-stat-label">New</span>
            <span className="direction-stat-value">
              {plToRuStats.newCards}
            </span>
          </div>
        </div>
        <div className="direction-stat-card">
          <h3 className="direction-stat-title">Russian to Polish</h3>
          <div className="direction-stat-row">
            <span className="direction-stat-label">Mastered</span>
            <span className="direction-stat-value">
              {ruToPlStats.mastered} / {totalCards}
            </span>
          </div>
          <div className="direction-stat-row">
            <span className="direction-stat-label">Learning</span>
            <span className="direction-stat-value">
              {ruToPlStats.learning + ruToPlStats.reviewing}
            </span>
          </div>
          <div className="direction-stat-row">
            <span className="direction-stat-label">New</span>
            <span className="direction-stat-value">
              {ruToPlStats.newCards}
            </span>
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
                <span className="mini-russian">{word.russian}</span>
                <div className="mini-badges">
                  <span
                    className={`mini-badge ${getDirectionMasteryLevel(
                      word,
                      "polish-to-russian"
                    )}`}
                  >
                    PL
                  </span>
                  <span
                    className={`mini-badge ${getDirectionMasteryLevel(
                      word,
                      "russian-to-polish"
                    )}`}
                  >
                    RU
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {needsPractice.length > 0 && (
        <div className="word-list-section">
          <h2 className="section-title">Needs Practice</h2>
          <div className="mini-word-list">
            {needsPractice.map(word => {
              const totalReps =
                word.polishToRussian.repetitions +
                word.russianToPolish.repetitions;
              return (
                <div key={word.id} className="mini-word-item">
                  <span className="mini-polish">{word.polish}</span>
                  <span className="mini-russian">{word.russian}</span>
                  <span className="mini-reps">
                    {totalReps}{" "}
                    {totalReps === 1 ? "review" : "reviews"}
                  </span>
                </div>
              );
            })}
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
                <span className="history-direction">
                  {change.direction}
                </span>
                <div className="history-change">
                  <span className={`level-badge ${change.fromLevel}`}>
                    {getMasteryLabel(change.fromLevel)}
                  </span>
                  <span className="history-arrow">to</span>
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
