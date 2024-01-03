import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Tables, tables } from "./constants";
import { immer } from "zustand/middleware/immer";
import { type Card, putCardToDeck } from "./util";

export type Store = {
  level: Tables | null;
  statistic: Record<
    string,
    {
      local: number; // NOTE: store local progress for today
      global: number; // NOTE: store global progress
    }
  > | null;
  updateStatistic: (card: Card, correct: boolean) => void;
  setLevel: (table: Tables | null) => void;
  cards: Card[];
};

export const useStore = create(
  persist(
    immer<Store>(set => ({
      level: null,
      statistic: null,
      cards: [],
      updateStatistic: (card: Card, correct: boolean) => {
        set(prevState => {
          if (prevState.statistic === null) {
            prevState.statistic = {};
          }
          prevState.statistic[card.id] = {
            local: correct
              ? (prevState.statistic[card.id]?.local ?? 0) + 1
              : 0,
            global: 0,
          };
          prevState.cards = putCardToDeck(
            {
              ...card,
              repetition: prevState.statistic[card.id]?.local ?? 0,
            },
            prevState.cards
          );
        });
      },
      setLevel: (table: Tables | null) => {
        console.log("setLevel", table);
        set(prevState => {
          prevState.level = table;
          if (table === null) {
            prevState.cards = [];
          } else {
            // NOTE: initialize cards
            prevState.cards = tables[table]
              .map(card => {
                return {
                  id: card.id,
                  question: card.question,
                  answer: card.answer,
                  repetition:
                    prevState.statistic?.[card.id]?.local ?? 0,
                };
              })
              .filter(card => {
                return card.repetition < 6;
              })
              .sort((a, b) => {
                if (a.repetition > b.repetition) {
                  return 1;
                } else if (a.repetition < b.repetition) {
                  return -1;
                } else {
                  return (
                    parseInt(a.answer, 10) - parseInt(b.answer, 10)
                  );
                }
              });
          }
        });
      },
    })),
    {
      name: "table",
      version: 1,
      partialize: state => {
        return {
          statistic: state.statistic,
        };
      },
    }
  )
);
