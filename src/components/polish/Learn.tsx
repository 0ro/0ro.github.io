import { useStore } from "./store";
import { Flashcard } from "./Flashcard";
import { thumbsToQuality } from "./sm2";

export function Learn() {
  const { session, revealAnswer, rateCard, endSession, setView } =
    useStore();

  if (!session) {
    return (
      <div className="learn">
        <div className="learn-error">
          <p>No active learning session.</p>
          <button
            className="action-btn primary"
            onClick={() => setView("home")}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const {
    currentCardIndex,
    sessionCards,
    isAnswerRevealed,
    correctCount,
    incorrectCount,
  } = session;

  // Session complete
  if (currentCardIndex === -1) {
    const total = correctCount + incorrectCount;
    const percentage =
      total > 0 ? Math.round((correctCount / total) * 100) : 0;

    return (
      <div className="learn">
        <div className="session-complete">
          <h1 className="complete-title">Session Complete</h1>
          <div className="session-stats">
            <div className="stat-circle">
              <span className="stat-percentage">{percentage}%</span>
              <span className="stat-label">Accuracy</span>
            </div>
          </div>
          <div className="session-details">
            <div className="detail-item correct">
              <span className="detail-icon">Correct</span>
              <span className="detail-value">{correctCount}</span>
            </div>
            <div className="detail-item incorrect">
              <span className="detail-icon">Incorrect</span>
              <span className="detail-value">{incorrectCount}</span>
            </div>
          </div>
          <button className="action-btn primary" onClick={endSession}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentSessionCard = sessionCards[currentCardIndex];
  const { card: currentCard, direction } = currentSessionCard;
  const progress =
    ((currentCardIndex + 1) / sessionCards.length) * 100;

  return (
    <div className="learn">
      <div className="learn-header">
        <button className="back-btn" onClick={endSession}>
          End Session
        </button>
        <div className="progress-info">
          {currentCardIndex + 1} / {sessionCards.length}
        </div>
        <div className="direction-badge">
          {direction === "polish-to-russian"
            ? "PL to RU"
            : "RU to PL"}
        </div>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="card-container">
        <Flashcard
          card={currentCard}
          direction={direction}
          isRevealed={isAnswerRevealed}
          onReveal={revealAnswer}
        />
      </div>

      {isAnswerRevealed && (
        <div className="rating-section">
          <p className="rating-prompt">Did you know this word?</p>
          <div className="rating-buttons">
            <button
              className="rating-btn incorrect"
              onClick={() => rateCard(thumbsToQuality(false))}
            >
              <span className="rating-icon">X</span>
              <span className="rating-text">Didn't know</span>
            </button>
            <button
              className="rating-btn correct"
              onClick={() => rateCard(thumbsToQuality(true))}
            >
              <span className="rating-icon">O</span>
              <span className="rating-text">Knew it</span>
            </button>
          </div>
        </div>
      )}

      {!isAnswerRevealed && (
        <div className="reveal-hint">
          <p>Think of the answer, then tap the card to reveal</p>
        </div>
      )}
    </div>
  );
}
