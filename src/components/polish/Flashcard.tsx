import type { Flashcard as FlashcardType, Direction } from "./types";

interface FlashcardProps {
  card: FlashcardType;
  direction: Direction;
  isRevealed: boolean;
  onReveal: () => void;
}

export function Flashcard({
  card,
  direction,
  isRevealed,
  onReveal,
}: FlashcardProps) {
  const question =
    direction === "polish-to-russian" ? card.polish : card.russian;
  const answer =
    direction === "polish-to-russian" ? card.russian : card.polish;
  const questionLabel =
    direction === "polish-to-russian" ? "Polish" : "Russian";
  const answerLabel =
    direction === "polish-to-russian" ? "Russian" : "Polish";

  return (
    <div
      className={`flashcard ${isRevealed ? "revealed" : ""}`}
      onClick={!isRevealed ? onReveal : undefined}
    >
      <div className="flashcard-inner">
        {/* Front - Question */}
        <div className="flashcard-front">
          <div className="card-flag">{questionLabel}</div>
          <div className="card-word">{question}</div>
          {!isRevealed && (
            <div className="card-hint">Tap to reveal answer</div>
          )}
        </div>

        {/* Back - Answer */}
        {isRevealed && (
          <div className="flashcard-back">
            <div className="card-divider"></div>
            <div className="card-flag">{answerLabel}</div>
            <div className="card-word answer">{answer}</div>
            {card.context && (
              <div className="card-context">
                <span className="context-label">Context:</span>{" "}
                {card.context}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
