import { useStore } from "./store";

export function Help() {
  const { setView } = useStore();

  return (
    <div className="help">
      <div className="help-header">
        <button className="back-btn" onClick={() => setView("home")}>
          Back
        </button>
        <h1 className="help-title">How It Works</h1>
      </div>

      <div className="help-content">
        <section className="help-section">
          <h2 className="help-section-title">Spaced Repetition</h2>
          <p>
            This app uses the SM-2 algorithm, a proven spaced
            repetition system. Words you know well appear less often,
            while difficult words appear more frequently until you
            master them.
          </p>
        </section>

        <section className="help-section">
          <h2 className="help-section-title">Review Schedule</h2>
          <p>
            When you answer correctly, the next review is scheduled:
          </p>
          <ul className="help-list">
            <li>
              <strong>1st correct:</strong> Review in 1 day
            </li>
            <li>
              <strong>2nd correct:</strong> Review in 6 days
            </li>
            <li>
              <strong>3rd+ correct:</strong> Interval multiplied by
              ease factor
            </li>
          </ul>
          <p className="help-note">
            If you answer incorrectly, the word resets and will appear
            again tomorrow.
          </p>
        </section>

        <section className="help-section">
          <h2 className="help-section-title">Mastery Levels</h2>
          <p>Each word progresses through four levels:</p>
          <div className="mastery-levels-help">
            <div className="mastery-level-item">
              <span className="mastery-level-badge new">New</span>
              <span className="mastery-level-desc">
                Never reviewed (0 correct answers)
              </span>
            </div>
            <div className="mastery-level-item">
              <span className="mastery-level-badge learning">
                Learning
              </span>
              <span className="mastery-level-desc">
                1-2 correct answers
              </span>
            </div>
            <div className="mastery-level-item">
              <span className="mastery-level-badge reviewing">
                Reviewing
              </span>
              <span className="mastery-level-desc">
                3-5 correct answers
              </span>
            </div>
            <div className="mastery-level-item">
              <span className="mastery-level-badge mastered">
                Mastered
              </span>
              <span className="mastery-level-desc">
                6+ correct answers
              </span>
            </div>
          </div>
        </section>

        <section className="help-section">
          <h2 className="help-section-title">
            Bidirectional Learning
          </h2>
          <p>
            True vocabulary mastery means knowing a word in both
            directions. This app tracks your progress separately for:
          </p>
          <ul className="help-list">
            <li>
              <strong>Polish to Russian:</strong> See Polish, recall
              Russian
            </li>
            <li>
              <strong>Russian to Polish:</strong> See Russian, recall
              Polish
            </li>
          </ul>
          <p className="help-note">
            A word is only considered fully mastered when you reach 6+
            correct answers in BOTH directions. During practice,
            directions are randomly mixed to strengthen both recall
            paths.
          </p>
        </section>

        <section className="help-section">
          <h2 className="help-section-title">Tips for Success</h2>
          <ul className="help-list">
            <li>Practice daily, even if just for a few minutes</li>
            <li>
              Be honest with your answers - it helps the algorithm
            </li>
            <li>Add context to words to help remember them</li>
            <li>Focus on words due today before adding new ones</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
