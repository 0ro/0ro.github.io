import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type {
  Flashcard,
  PolishStore,
  View,
  Direction,
  Quality,
  SessionCard,
  DirectionProgress,
} from "./types";
import {
  createFlashcard,
  calculateSM2,
  sortCardsForLearning,
  getDueDirections,
  getMasteryLevel,
  getDirectionProgress,
  createDefaultProgress,
} from "./sm2";

const MAX_SESSION_CARDS = 20; // Max cards per learning session

/**
 * Randomly pick a direction, preferring due directions
 */
function pickDirection(card: Flashcard): Direction {
  const dueDirections = getDueDirections(card);

  if (dueDirections.length === 1) {
    // Only one direction is due, use it
    return dueDirections[0];
  } else if (dueDirections.length === 2) {
    // Both directions due, pick randomly
    return Math.random() < 0.5
      ? "polish-to-russian"
      : "russian-to-polish";
  } else {
    // Neither is due, pick randomly (for new cards or future reviews)
    return Math.random() < 0.5
      ? "polish-to-russian"
      : "russian-to-polish";
  }
}

/**
 * Migrate old flashcard format to new bidirectional format
 */
function migrateFlashcard(card: any): Flashcard {
  // Check if card has old format (flat SM-2 fields without direction objects)
  if (card.easeFactor !== undefined && !card.polishToRussian) {
    const progress: DirectionProgress = {
      easeFactor: card.easeFactor ?? 2.5,
      interval: card.interval ?? 0,
      repetitions: card.repetitions ?? 0,
      nextReviewDate: card.nextReviewDate ?? Date.now(),
      lastReviewDate: card.lastReviewDate,
      statusHistory: card.statusHistory,
    };

    return {
      id: card.id,
      polish: card.polish,
      russian: card.russian,
      context: card.context,
      createdAt: card.createdAt,
      // Copy existing progress to BOTH directions
      polishToRussian: { ...progress },
      russianToPolish: { ...progress },
    };
  }

  // Card is already in new format or needs minimal fixes
  return {
    ...card,
    polishToRussian: card.polishToRussian ?? createDefaultProgress(),
    russianToPolish: card.russianToPolish ?? createDefaultProgress(),
  };
}

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

      // Learning session - now with random direction per card
      startSession: () => {
        const { flashcards } = get();

        if (flashcards.length === 0) return;

        // Sort cards for learning
        const sortedCards = sortCardsForLearning(flashcards);

        // Take up to MAX_SESSION_CARDS
        const selectedCards = sortedCards.slice(0, MAX_SESSION_CARDS);

        if (selectedCards.length === 0) return;

        // Assign a random direction to each card, preferring due directions
        const sessionCards: SessionCard[] = selectedCards.map(
          card => ({
            card,
            direction: pickDirection(card),
          })
        );

        set(state => {
          state.currentView = "learn";
          state.session = {
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
          const sessionCard = sessionCards[currentCardIndex];

          if (!sessionCard) return;

          const { card, direction } = sessionCard;

          // Find the card in the main flashcards array
          const cardIndex = state.flashcards.findIndex(
            c => c.id === card.id
          );

          if (cardIndex !== -1) {
            const flashcard = state.flashcards[cardIndex];

            // Get the current direction progress
            const currentProgress = getDirectionProgress(
              flashcard,
              direction
            );
            const oldLevel = getMasteryLevel(
              currentProgress.repetitions
            );

            // Calculate new progress for this direction
            const newProgress = calculateSM2(
              currentProgress,
              quality
            );
            const newLevel = getMasteryLevel(newProgress.repetitions);

            // Track status change if level changed
            const statusHistory = [
              ...(currentProgress.statusHistory || []),
            ];
            if (oldLevel !== newLevel) {
              statusHistory.push({
                timestamp: Date.now(),
                fromLevel: oldLevel,
                toLevel: newLevel,
              });
            }

            // Update the specific direction's progress
            if (direction === "polish-to-russian") {
              state.flashcards[cardIndex].polishToRussian = {
                ...newProgress,
                statusHistory,
              };
            } else {
              state.flashcards[cardIndex].russianToPolish = {
                ...newProgress,
                statusHistory,
              };
            }
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
        return JSON.stringify({ flashcards, version: 2 }, null, 2);
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
              const newCards = data.flashcards
                .filter((c: Flashcard) => !existingIds.has(c.id))
                .map(migrateFlashcard);
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
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version === 1 || version === 0) {
          // Migrate from v1 (single direction) to v2 (bidirectional)
          const migratedFlashcards = (
            persistedState.flashcards || []
          ).map(migrateFlashcard);
          return { flashcards: migratedFlashcards };
        }
        return persistedState;
      },
      partialize: state => ({
        flashcards: state.flashcards,
      }),
    }
  )
);
