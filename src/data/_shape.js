// Shared seed -> object transforms so every content module (verbs, grammar,
// vocabulary, ...) builds the exact same shapes the app and tests expect.

export const makeQuiz = ([id, topic, promptFa, choices, correct, explanationFa]) => ({
  id,
  topic,
  promptFa,
  choices,
  correct,
  explanationFa,
});

// [id, topic, mode, promptFa, promptEn, answer, answerFa, hintFa, exampleEn, exampleFa]
//   mode 'type'   -> learner types one English word (answer is that word)
//   mode 'recall' -> learner self-grades a meaning (answer is null)
export const makeCard = ([id, topic, mode, promptFa, promptEn, answer, answerFa, hintFa, exampleEn, exampleFa]) => ({
  id,
  topic,
  mode,
  promptFa,
  promptEn,
  answer,
  answerFa: `${answerFa} - ${hintFa}`,
  answerShortFa: answerFa,
  hintFa,
  exampleEn,
  exampleFa,
});

export const makeBuilder = ([id, topic, tokens, fa]) => ({
  id,
  topic,
  tokens,
  answer: tokens.join(' '),
  fa,
});

export const makeDictation = ([id, topic, en, fa]) => ({ id, topic, en, fa });
