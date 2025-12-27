// Mastery level type
export type MasteryLevel =
  | "new"
  | "learning"
  | "reviewing"
  | "mastered";

// Status change event
export interface StatusChange {
  timestamp: number;
  fromLevel: MasteryLevel;
  toLevel: MasteryLevel;
}

// Direction-specific progress tracking
export interface DirectionProgress {
  easeFactor: number; // Default 2.5, minimum 1.3
  interval: number; // Days until next review
  repetitions: number; // Successful repetitions count
  nextReviewDate: number; // Timestamp for next review
  lastReviewDate?: number; // Last review timestamp
  statusHistory?: StatusChange[];
}

// Flashcard data model with bidirectional progress
export interface Flashcard {
  id: string;
  polish: string; // Polish word
  russian: string; // Russian translation
  context?: string; // Additional context/examples
  createdAt: number;
  // Separate progress for each direction
  polishToRussian: DirectionProgress;
  russianToPolish: DirectionProgress;
}

// SM-2 quality ratings
export type Quality = 0 | 1 | 2 | 3 | 4 | 5;

// Learning direction
export type Direction = "polish-to-russian" | "russian-to-polish";

// App views
export type View = "home" | "admin" | "learn" | "stats" | "help";

// Session card with assigned direction
export interface SessionCard {
  card: Flashcard;
  direction: Direction;
}

// Learning session state
export interface LearningSession {
  currentCardIndex: number;
  isAnswerRevealed: boolean;
  sessionCards: SessionCard[];
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
  startSession: () => void;
  endSession: () => void;
  revealAnswer: () => void;
  rateCard: (quality: Quality) => void;

  // Import/Export
  exportData: () => string;
  importData: (json: string) => boolean;
}
