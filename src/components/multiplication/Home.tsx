import { Tables } from "./constants";
import { useStore } from "./store";

export function Home() {
  const store = useStore();
  return (
    <>
      <h1>Select Level</h1>
      <div className="tables">
        {Object.values(Tables).map(table => (
          <button
            key={table}
            onClick={() => {
              console.log("click");
              return store.setLevel(table);
            }}
          >
            {table}
          </button>
        ))}
      </div>
      <div className="progress">
        <h2>Progress Table</h2>
        <div className="progress-table">
          {Array.from({ length: 10 }, (_, i) => i).map(i => {
            return (
              <div key={i} className="progress-row">
                {Array.from({ length: 10 }, (_, j) => j).map(j => {
                  const statistic = store.statistic
                    ? store.statistic[`${i}${j}`]?.local ?? 0
                    : 0;
                  const isCompleted = statistic === 6;
                  return (
                    <div
                      key={j}
                      className={`progress-cell progress-cell-${statistic}`}
                    >
                      {isCompleted ? (
                        <span>✅</span>
                      ) : (
                        (i + 1) * (j + 1)
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
