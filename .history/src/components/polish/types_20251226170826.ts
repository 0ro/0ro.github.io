// Flashcard data model
export interface Flashcard {
  id: string;
  polish: string; // Polish word
  russian: string; // Russian translation
  context?: string; // Additional context/examples
  createdAt: number;
  // SM-2 algorithm fields
  easeFactor: number; // Default 2.5, minimum 1.3
  interval: number; // Days until next review
  repetitions: number; // Successful repetitions count
  nextReviewDate: number; // Timestamp for next review
  lastReviewDate?: number; // Last review timestamp
}

// SM-2 quality ratings
export type Quality = 0 | 1 | 2 | 3 | 4 | 5;

// Learning direction
export type Direction = "polish-to-russian" | "russian-to-polish";

// App views
export type View = "home" | "admin" | "learn" | "stats";

// Learning session state
export interface LearningSession {
  direction: Direction;
  currentCardIndex: number;
  isAnswerRevealed: boolean;
  sessionCards: Flashcard[];
  correctCount: number;
  incorrectCount: number;
}

// Store state
export interface PolishStore {
  // Data
  flashcards: Flashcard[];
  currentView: View;

  // Learning session
  session: LearningSession | null;

  // Navigation
  setView: (view: View) => void;

  // Flashcard management
  addFlashcard: (
    polish: string,
    russian: string,
    context?: string
  ) => void;
  updateFlashcard: (
    id: string,
    updates: Partial<
      Pick<Flashcard, "polish" | "russian" | "context">
    >
  ) => void;
  deleteFlashcard: (id: string) => void;

  // Learning session
  startSession: (direction: Direction) => void;
  endSession: () => void;
  revealAnswer: () => void;
  rateCard: (quality: Quality) => void;

  // Import/Export
  exportData: () => string;
  importData: (json: string) => boolean;
}
