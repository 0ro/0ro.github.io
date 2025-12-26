import type { Flashcard, Quality, MasteryLevel } from "./types";

/**
 * SM-2 Spaced Repetition Algorithm
 *
 * Based on the SuperMemo 2 algorithm, widely used in Anki and other flashcard apps.
 *
 * Quality ratings:
 * 0 - Complete blackout, no recall
 * 1 - Incorrect, but upon seeing answer, remembered
 * 2 - Incorrect, but answer seemed easy to recall
 * 3 - Correct with serious difficulty
 * 4 - Correct after hesitation
 * 5 - Perfect recall
 *
 * Simplified for thumbs up/down:
 * - Thumbs down (fail): quality = 1
 * - Thumbs up (pass): quality = 4
 */

const MIN_EASE_FACTOR = 1.3;
const DEFAULT_EASE_FACTOR = 2.5;

interface SM2Result {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: number;
}

/**
 * Calculate new SM-2 values after a review
 */
export function calculateSM2(
  card: Flashcard,
  quality: Quality
): SM2Result {
  const now = Date.now();
  let { easeFactor, interval, repetitions } = card;

  // Quality < 3 means incorrect answer - reset repetitions
  if (quality < 3) {
    repetitions = 0;
    interval = 1; // Review again tomorrow
  } else {
    // Correct answer - calculate new interval
    if (repetitions === 0) {
      interval = 1; // First successful review: 1 day
    } else if (repetitions === 1) {
      interval = 6; // Second successful review: 6 days
    } else {
      // Subsequent reviews: multiply by ease factor
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor based on quality
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const newEaseFactor =
    easeFactor +
    (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  easeFactor = Math.max(MIN_EASE_FACTOR, newEaseFactor);

  // Calculate next review date
  const nextReviewDate = now + interval * 24 * 60 * 60 * 1000;

  return {
    easeFactor,
    interval,
    repetitions,
    nextReviewDate,
  };
}

/**
 * Create a new flashcard with default SM-2 values
 */
export function createFlashcard(
  polish: string,
  russian: string,
  context?: string
): Flashcard {
  const now = Date.now();
  return {
    id: generateId(),
    polish: polish.trim(),
    russian: russian.trim(),
    context: context?.trim(),
    createdAt: now,
    easeFactor: DEFAULT_EASE_FACTOR,
    interval: 0,
    repetitions: 0,
    nextReviewDate: now, // Due immediately for new cards
  };
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}

/**
 * Check if a card is due for review
 */
export function isDue(card: Flashcard): boolean {
  return card.nextReviewDate <= Date.now();
}

/**
 * Sort cards for learning session
 * Priority: due cards first (oldest first), then new cards
 */
export function sortCardsForLearning(
  cards: Flashcard[]
): Flashcard[] {
  const now = Date.now();

  return [...cards].sort((a, b) => {
    const aIsDue = a.nextReviewDate <= now;
    const bIsDue = b.nextReviewDate <= now;
    const aIsNew = a.repetitions === 0;
    const bIsNew = b.repetitions === 0;

    // Due cards come first
    if (aIsDue && !bIsDue) return -1;
    if (!aIsDue && bIsDue) return 1;

    // Among due cards, older review dates first
    if (aIsDue && bIsDue) {
      return a.nextReviewDate - b.nextReviewDate;
    }

    // New cards come before cards scheduled for future
    if (aIsNew && !bIsNew) return -1;
    if (!aIsNew && bIsNew) return 1;

    // Otherwise, sort by creation date
    return a.createdAt - b.createdAt;
  });
}

/**
 * Get cards that are due for review today
 */
export function getDueCards(cards: Flashcard[]): Flashcard[] {
  return cards.filter(isDue);
}

/**
 * Get statistics about card mastery levels
 */
export function getMasteryStats(cards: Flashcard[]): {
  newCards: number;
  learning: number; // 1-2 repetitions
  reviewing: number; // 3-5 repetitions
  mastered: number; // 6+ repetitions
} {
  return cards.reduce(
    (acc, card) => {
      if (card.repetitions === 0) {
        acc.newCards++;
      } else if (card.repetitions <= 2) {
        acc.learning++;
      } else if (card.repetitions <= 5) {
        acc.reviewing++;
      } else {
        acc.mastered++;
      }
      return acc;
    },
    { newCards: 0, learning: 0, reviewing: 0, mastered: 0 }
  );
}

/**
 * Map thumbs up/down to SM-2 quality
 */
export function thumbsToQuality(isCorrect: boolean): Quality {
  return isCorrect ? 4 : 1;
}
