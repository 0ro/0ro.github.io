import { useState } from "react";
import { useStore } from "./store";
import { generateAnswers } from "./util";

export function Level() {
  const level = useStore(state => state.level);
  const card = useStore(state => state.cards[0]);
  const statistic = useStore(state => state.statistic);
  const updateStatistic = useStore(state => state.updateStatistic);
  const setLevel = useStore(state => state.setLevel);
  const [result, setResult] = useState<{
    status: "wrong" | "right";
    rightAnswer: string;
  } | null>(null);

  function back() {
    setLevel(null);
  }

  const answers = card ? generateAnswers(card) : [];

  const isLevelCompleted = card === undefined;

  const levelNumber = parseInt(level?.split("x")[1] ?? "1", 10) - 1;

  return (
    <>
      <button className="back" onClick={back}>
        {"< "}Back
      </button>
      <h1>Level {level}</h1>
      {isLevelCompleted ? (
        <h2>Level Completed!</h2>
      ) : result ? (
        <div className={`result result-${result.status}`}>
          {result.status === "wrong" ? (
            <>
              <h2>Wrong!</h2>
              <div className="right-answer">
                Right answer is <strong>{result.rightAnswer}</strong>
              </div>
            </>
          ) : (
            <h2>Right!</h2>
          )}
        </div>
      ) : (
        <div className="card">
          <div className="question">{card.question}</div>
          <div className="answers">
            {answers.map(answer => (
              <button
                key={answer.answer}
                className="answer"
                onClick={() => {
                  setResult({
                    status: answer.correct ? "right" : "wrong",
                    rightAnswer: card.answer,
                  });
                  updateStatistic(card, answer.correct);
                  setTimeout(
                    () => {
                      setResult(null);
                    },
                    answer.correct ? 1000 : 4000
                  );
                }}
              >
                {answer.answer}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="level-progress">
        {Array.from({ length: 10 }, (_, i) => i).map(i => {
          const stat = statistic?.[`${levelNumber}${i}`]?.local ?? 0;
          return (
            <div
              key={i}
              className={`level-progress-cell level-progress-cell-${stat}`}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
    </>
  );
}
