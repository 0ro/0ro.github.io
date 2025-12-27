import type {
  Flashcard,
  Quality,
  MasteryLevel,
  DirectionProgress,
  Direction,
} from "./types";

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

/**
 * Create default direction progress
 */
export function createDefaultProgress(): DirectionProgress {
  return {
    easeFactor: DEFAULT_EASE_FACTOR,
    interval: 0,
    repetitions: 0,
    nextReviewDate: Date.now(), // Due immediately for new cards
  };
}

/**
 * Calculate new SM-2 values after a review
 */
export function calculateSM2(
  progress: DirectionProgress,
  quality: Quality
): DirectionProgress {
  const now = Date.now();
  let { easeFactor, interval, repetitions } = progress;

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
    ...progress,
    easeFactor,
    interval,
    repetitions,
    nextReviewDate,
    lastReviewDate: now,
  };
}

/**
 * Create a new flashcard with default SM-2 values for both directions
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
    polishToRussian: createDefaultProgress(),
    russianToPolish: createDefaultProgress(),
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
 * Get progress for a specific direction
 */
export function getDirectionProgress(
  card: Flashcard,
  direction: Direction
): DirectionProgress {
  return direction === "polish-to-russian"
    ? card.polishToRussian
    : card.russianToPolish;
}

/**
 * Check if a direction is due for review
 */
export function isDirectionDue(
  card: Flashcard,
  direction: Direction
): boolean {
  const progress = getDirectionProgress(card, direction);
  return progress.nextReviewDate <= Date.now();
}

/**
 * Check if any direction of a card is due for review
 */
export function isCardDue(card: Flashcard): boolean {
  return (
    isDirectionDue(card, "polish-to-russian") ||
    isDirectionDue(card, "russian-to-polish")
  );
}

/**
 * Get which directions are due for a card
 */
export function getDueDirections(card: Flashcard): Direction[] {
  const directions: Direction[] = [];
  if (isDirectionDue(card, "polish-to-russian")) {
    directions.push("polish-to-russian");
  }
  if (isDirectionDue(card, "russian-to-polish")) {
    directions.push("russian-to-polish");
  }
  return directions;
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
    const aIsDue = isCardDue(a);
    const bIsDue = isCardDue(b);
    const aIsNew =
      a.polishToRussian.repetitions === 0 &&
      a.russianToPolish.repetitions === 0;
    const bIsNew =
      b.polishToRussian.repetitions === 0 &&
      b.russianToPolish.repetitions === 0;

    // Due cards come first
    if (aIsDue && !bIsDue) return -1;
    if (!aIsDue && bIsDue) return 1;

    // Among due cards, older review dates first
    if (aIsDue && bIsDue) {
      const aMinDate = Math.min(
        a.polishToRussian.nextReviewDate,
        a.russianToPolish.nextReviewDate
      );
      const bMinDate = Math.min(
        b.polishToRussian.nextReviewDate,
        b.russianToPolish.nextReviewDate
      );
      return aMinDate - bMinDate;
    }

    // New cards come before cards scheduled for future
    if (aIsNew && !bIsNew) return -1;
    if (!aIsNew && bIsNew) return 1;

    // Otherwise, sort by creation date
    return a.createdAt - b.createdAt;
  });
}

/**
 * Get cards that have at least one direction due for review
 */
export function getDueCards(cards: Flashcard[]): Flashcard[] {
  return cards.filter(isCardDue);
}

/**
 * Count total due directions across all cards
 */
export function countDueDirections(cards: Flashcard[]): number {
  return cards.reduce((count, card) => {
    return count + getDueDirections(card).length;
  }, 0);
}

/**
 * Get mastery level from repetitions count
 */
export function getMasteryLevel(repetitions: number): MasteryLevel {
  if (repetitions === 0) return "new";
  if (repetitions <= 2) return "learning";
  if (repetitions <= 5) return "reviewing";
  return "mastered";
}

/**
 * Get mastery level for a specific direction
 */
export function getDirectionMasteryLevel(
  card: Flashcard,
  direction: Direction
): MasteryLevel {
  const progress = getDirectionProgress(card, direction);
  return getMasteryLevel(progress.repetitions);
}

/**
 * Get overall mastery level (minimum of both directions)
 * A word is only fully mastered when BOTH directions are mastered
 */
export function getOverallMasteryLevel(
  card: Flashcard
): MasteryLevel {
  const plToRuLevel = getMasteryLevel(
    card.polishToRussian.repetitions
  );
  const ruToPlLevel = getMasteryLevel(
    card.russianToPolish.repetitions
  );

  const levels: MasteryLevel[] = [
    "new",
    "learning",
    "reviewing",
    "mastered",
  ];
  const plToRuIndex = levels.indexOf(plToRuLevel);
  const ruToPlIndex = levels.indexOf(ruToPlLevel);

  // Return the lower of the two levels
  return levels[Math.min(plToRuIndex, ruToPlIndex)];
}

/**
 * Get statistics about card mastery levels (based on overall mastery)
 */
export function getMasteryStats(cards: Flashcard[]): {
  newCards: number;
  learning: number;
  reviewing: number;
  mastered: number;
} {
  return cards.reduce(
    (acc, card) => {
      const level = getOverallMasteryLevel(card);
      switch (level) {
        case "new":
          acc.newCards++;
          break;
        case "learning":
          acc.learning++;
          break;
        case "reviewing":
          acc.reviewing++;
          break;
        case "mastered":
          acc.mastered++;
          break;
      }
      return acc;
    },
    { newCards: 0, learning: 0, reviewing: 0, mastered: 0 }
  );
}

/**
 * Get direction-specific mastery stats
 */
export function getDirectionMasteryStats(
  cards: Flashcard[],
  direction: Direction
): {
  newCards: number;
  learning: number;
  reviewing: number;
  mastered: number;
} {
  return cards.reduce(
    (acc, card) => {
      const progress = getDirectionProgress(card, direction);
      const level = getMasteryLevel(progress.repetitions);
      switch (level) {
        case "new":
          acc.newCards++;
          break;
        case "learning":
          acc.learning++;
          break;
        case "reviewing":
          acc.reviewing++;
          break;
        case "mastered":
          acc.mastered++;
          break;
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

/**
 * Get human-readable mastery level label
 */
export function getMasteryLabel(level: MasteryLevel): string {
  switch (level) {
    case "new":
      return "New";
    case "learning":
      return "Learning";
    case "reviewing":
      return "Reviewing";
    case "mastered":
      return "Mastered";
  }
}
