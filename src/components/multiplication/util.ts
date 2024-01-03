export interface Card {
  id: string;
  question: string;
  answer: string;
  repetition: number;
}

export interface Answer {
  answer: string;
  correct: boolean;
}

/**
 * @description Generates 4 answers for a given card and mix right answer with wrong ones
 * Need to generate 4 answers with 1 correct and 3 wrong
 *
 */
export function generateAnswers(card: Card): Answer[] {
  const answers: Answer[] = [];
  const rightAnswer = {
    answer: card.answer,
    correct: true,
  };
  answers.push(rightAnswer);

  const wrongAnswers = generateWrongAnswers(card.answer);
  wrongAnswers.forEach(answer => {
    answers.push({
      answer,
      correct: false,
    });
  });

  return shuffle(answers);
}

/**
 * @description Wrong answers should be positive, the margin between right and wrong answers should be 2, and it should be random
 * @param rightAnswer
 * @returns array of wrong answers
 */
function generateWrongAnswers(rightAnswer: string): string[] {
  const wrongAnswers: string[] = [];

  const answer = parseInt(rightAnswer, 10);

  if (answer < 5) {
    const wrongAnswer1 = answer + 2;
    const wrongAnswer2 = answer + 4;
    const wrongAnswer3 = answer + 6;

    wrongAnswers.push(wrongAnswer1.toString());
    wrongAnswers.push(wrongAnswer2.toString());
    wrongAnswers.push(wrongAnswer3.toString());
    return wrongAnswers;
  }

  if (Math.random() > 0.5) {
    const wrongAnswer1 = answer - 2;
    const wrongAnswer2 = answer + 2;
    const wrongAnswer3 = answer + 4;

    wrongAnswers.push(wrongAnswer1.toString());
    wrongAnswers.push(wrongAnswer2.toString());
    wrongAnswers.push(wrongAnswer3.toString());
  } else {
    const wrongAnswer1 = answer - 4;
    const wrongAnswer2 = answer - 2;
    const wrongAnswer3 = answer + 2;

    wrongAnswers.push(wrongAnswer1.toString());
    wrongAnswers.push(wrongAnswer2.toString());
    wrongAnswers.push(wrongAnswer3.toString());
  }

  return shuffle(wrongAnswers);
}

/**
 * @description Shuffles an array
 * @param array
 * @returns shuffled array
 */
function shuffle<T>(array: T[]): T[] {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = shuffledArray[i];
    shuffledArray[i] = shuffledArray[j];
    shuffledArray[j] = temp;
  }

  return shuffledArray;
}

const fibonacciSequence = [1, 2, 3, 5, 8, 13, 21];
const MAX_REPETITION = fibonacciSequence.length - 1;

/**
 * @description Move a card to a deck based on the repetition number, the position should be based on fibonacci sequence but not more than length of the deck
 */
export function putCardToDeck(card: Card, deck: Card[]): Card[] {
  const position: number = fibonacciSequence[card.repetition];

  // remove card from deck
  deck.shift();

  if (card.repetition === MAX_REPETITION) {
    return deck;
  }

  if (position >= deck.length) {
    deck.push(card);
  } else {
    deck.splice(position, 0, card);
  }

  return deck;
}
