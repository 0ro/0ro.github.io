import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type {
  Flashcard,
  PolishStore,
  View,
  Direction,
  Quality,
} from "./types";
import {
  createFlashcard,
  calculateSM2,
  sortCardsForLearning,
  getDueCards,
  getMasteryLevel,
} from "./sm2";

const MAX_SESSION_CARDS = 20; // Max cards per learning session

export const useStore = create(
  persist(
    immer<PolishStore>((set, get) => ({
      // Initial state
      flashcards: [],
      currentView: "home",
      session: null,

      // Navigation
      setView: (view: View) => {
        set(state => {
          state.currentView = view;
          if (view !== "learn") {
            state.session = null;
          }
        });
      },

      // Flashcard management
      addFlashcard: (
        polish: string,
        russian: string,
        context?: string
      ) => {
        set(state => {
          const newCard = createFlashcard(polish, russian, context);
          state.flashcards.push(newCard);
        });
      },

      updateFlashcard: (id: string, updates) => {
        set(state => {
          const index = state.flashcards.findIndex(c => c.id === id);
          if (index !== -1) {
            if (updates.polish !== undefined) {
              state.flashcards[index].polish = updates.polish.trim();
            }
            if (updates.russian !== undefined) {
              state.flashcards[index].russian =
                updates.russian.trim();
            }
            if (updates.context !== undefined) {
              state.flashcards[index].context =
                updates.context.trim() || undefined;
            }
          }
        });
      },

      deleteFlashcard: (id: string) => {
        set(state => {
          state.flashcards = state.flashcards.filter(
            c => c.id !== id
          );
        });
      },

      // Learning session
      startSession: (direction: Direction) => {
        const { flashcards } = get();

        if (flashcards.length === 0) return;

        // Get due cards first, then new/future cards
        const dueCards = getDueCards(flashcards);
        const sortedCards = sortCardsForLearning(flashcards);

        // Take up to MAX_SESSION_CARDS, prioritizing due cards
        const sessionCards = sortedCards.slice(0, MAX_SESSION_CARDS);

        if (sessionCards.length === 0) return;

        set(state => {
          state.currentView = "learn";
          state.session = {
            direction,
            currentCardIndex: 0,
            isAnswerRevealed: false,
            sessionCards: sessionCards,
            correctCount: 0,
            incorrectCount: 0,
          };
        });
      },

      endSession: () => {
        set(state => {
          state.session = null;
          state.currentView = "home";
        });
      },

      revealAnswer: () => {
        set(state => {
          if (state.session) {
            state.session.isAnswerRevealed = true;
          }
        });
      },

      rateCard: (quality: Quality) => {
        set(state => {
          if (!state.session) return;

          const { currentCardIndex, sessionCards } = state.session;
          const currentCard = sessionCards[currentCardIndex];

          if (!currentCard) return;

          // Update the card with SM-2 algorithm
          const sm2Result = calculateSM2(currentCard, quality);
          const cardIndex = state.flashcards.findIndex(
            c => c.id === currentCard.id
          );

          if (cardIndex !== -1) {
            state.flashcards[cardIndex] = {
              ...state.flashcards[cardIndex],
              ...sm2Result,
              lastReviewDate: Date.now(),
            };
          }

          // Update session stats
          if (quality >= 3) {
            state.session.correctCount++;
          } else {
            state.session.incorrectCount++;
          }

          // Move to next card or end session
          if (currentCardIndex < sessionCards.length - 1) {
            state.session.currentCardIndex++;
            state.session.isAnswerRevealed = false;
          } else {
            // Session complete - stay on learn view to show results
            state.session.isAnswerRevealed = false;
            state.session.currentCardIndex = -1; // Indicates session complete
          }
        });
      },

      // Import/Export
      exportData: () => {
        const { flashcards } = get();
        return JSON.stringify({ flashcards, version: 1 }, null, 2);
      },

      importData: (json: string) => {
        try {
          const data = JSON.parse(json);
          if (data.flashcards && Array.isArray(data.flashcards)) {
            set(state => {
              // Merge imported cards, avoiding duplicates by id
              const existingIds = new Set(
                state.flashcards.map(c => c.id)
              );
              const newCards = data.flashcards.filter(
                (c: Flashcard) => !existingIds.has(c.id)
              );
              state.flashcards.push(...newCards);
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
    })),
    {
      name: "polish-flashcards",
      version: 1,
      partialize: state => ({
        flashcards: state.flashcards,
      }),
    }
  )
);
