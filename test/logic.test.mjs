import test from 'node:test';
import assert from 'node:assert/strict';

// Minimal localStorage shim so progress.js (which persists to window.localStorage)
// runs in Node exactly as it does in the browser.
const store = new Map();
globalThis.window = {
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, v),
    removeItem: (k) => store.delete(k),
  },
};

const {
  addActivity,
  awardPoints,
  completeLesson,
  getDueCardIds,
  getInitialProgress,
  recordFlashcard,
  recordQuiz,
  recordQuizAnswer,
  resetProgress,
  SRS_INTERVALS,
  todayStr,
} = await import('../src/utils/progress.js');

const { lessons, quizzes, flashcards, sentenceBuilders, dictations, dialogues, lessonCategories } =
  await import('../src/data/content.js');

const base = () => resetProgress();
const dayOffset = (n) => todayStr(new Date(Date.now() + n * 86400000));

// ---- Streak ---------------------------------------------------------------

test('addActivity starts a streak at 1', () => {
  const p = addActivity(base());
  assert.equal(p.streak.current, 1);
  assert.equal(p.streak.lastActiveDate, todayStr());
});

test('addActivity does not double-count the same day', () => {
  let p = addActivity(base());
  p = addActivity(p);
  assert.equal(p.streak.current, 1);
});

test('addActivity continues streak on consecutive day, resets after a gap', () => {
  const cont = addActivity({ ...base(), streak: { current: 3, lastActiveDate: dayOffset(-1) } });
  assert.equal(cont.streak.current, 4);
  const reset = addActivity({ ...base(), streak: { current: 9, lastActiveDate: dayOffset(-3) } });
  assert.equal(reset.streak.current, 1);
});

// ---- Lessons --------------------------------------------------------------

test('completeLesson awards points once and dedupes', () => {
  let p = completeLesson(base(), 'be-present');
  assert.equal(p.points, 12);
  assert.deepEqual(p.completedLessons, ['be-present']);
  p = completeLesson(p, 'be-present');
  assert.equal(p.points, 12);
  assert.equal(p.completedLessons.length, 1);
});

// ---- Flashcard SRS --------------------------------------------------------

test('recordFlashcard known promotes the box and schedules a future due date', () => {
  const p = recordFlashcard(base(), 'c1', true);
  assert.equal(p.flashcards.c1.box, 1);
  assert.equal(p.flashcards.c1.known, 1);
  assert.equal(p.flashcards.c1.due, dayOffset(SRS_INTERVALS[1]));
  assert.equal(p.points, 3);
});

test('recordFlashcard unknown resets the box to 0 and records a mistake', () => {
  let p = recordFlashcard(base(), 'c1', true);
  p = recordFlashcard(p, 'c1', false);
  assert.equal(p.flashcards.c1.box, 0);
  assert.equal(p.flashcards.c1.needsReview, 1);
  assert.ok(p.mistakes.some((m) => m.kind === 'flashcard' && m.refId === 'c1'));
});

test('recordFlashcard known clears a prior flashcard mistake', () => {
  let p = recordFlashcard(base(), 'c2', false);
  assert.ok(p.mistakes.length === 1);
  p = recordFlashcard(p, 'c2', true);
  assert.equal(p.mistakes.length, 0);
});

test('box never exceeds the last interval', () => {
  let p = base();
  for (let i = 0; i < 20; i += 1) p = recordFlashcard(p, 'c3', true);
  assert.equal(p.flashcards.c3.box, SRS_INTERVALS.length - 1);
});

test('getDueCardIds: new cards are due, future-scheduled cards are not', () => {
  const p = recordFlashcard(base(), 'c1', true); // c1 scheduled in the future
  const due = getDueCardIds(p, flashcards);
  assert.ok(!due.includes('c1'));
  assert.ok(due.includes('c2')); // untouched -> due
  assert.equal(due.length, flashcards.length - 1);
});

// ---- Quizzes & mistakes ---------------------------------------------------

test('recordQuiz adds points, history, and counts toward the daily goal', () => {
  const p = recordQuiz(base(), 'topic-all', 3, 5);
  assert.equal(p.points, 15);
  assert.equal(p.quizAttempts.length, 1);
  assert.equal(p.daily.count, 5);
});

test('recordQuizAnswer tracks then clears mistakes', () => {
  let p = recordQuizAnswer(base(), 'q1', false);
  assert.ok(p.mistakes.some((m) => m.kind === 'quiz' && m.refId === 'q1'));
  p = recordQuizAnswer(p, 'q1', true);
  assert.ok(!p.mistakes.some((m) => m.refId === 'q1'));
});

test('awardPoints increases points and daily count', () => {
  const p = awardPoints(base(), 5);
  assert.equal(p.points, 5);
  assert.equal(p.daily.count, 1);
});

test('getInitialProgress merges saved data with new default fields', () => {
  resetProgress();
  window.localStorage.setItem('verb_app_progress_v1', JSON.stringify({ points: 50 }));
  const p = getInitialProgress();
  assert.equal(p.points, 50);
  assert.ok(p.settings && p.settings.theme === 'light');
  assert.ok(Array.isArray(p.mistakes));
  resetProgress();
});

// ---- Content integrity ----------------------------------------------------

test('every lesson quizQuestionId resolves to a real quiz', () => {
  const ids = new Set(quizzes.map((q) => q.id));
  lessons.forEach((lesson) => {
    lesson.quizQuestionIds.forEach((qid) => assert.ok(ids.has(qid), `missing quiz ${qid}`));
  });
});

test('every quiz correct index is within its choices', () => {
  quizzes.forEach((q) => {
    assert.ok(q.correct >= 0 && q.correct < q.choices.length, `bad correct for ${q.id}`);
    assert.ok(q.explanationFa && q.promptFa, `missing text for ${q.id}`);
  });
});

test('quiz questions are different from the lesson example sentences', () => {
  lessons.forEach((lesson) => {
    const exampleSentences = new Set(lesson.examples.map((e) => e.en));
    const lessonQuizzes = quizzes.filter((q) => lesson.quizQuestionIds.includes(q.id));
    lessonQuizzes.forEach((q) => {
      assert.ok(
        !exampleSentences.has(q.promptFa),
        `${q.id} reuses an example sentence verbatim`,
      );
    });
  });
});

test('flashcards have unambiguous modes: type cards have an answer, recall cards do not', () => {
  flashcards.forEach((card) => {
    assert.ok(['type', 'recall'].includes(card.mode), `bad mode for ${card.id}`);
    if (card.mode === 'type') {
      assert.ok(card.answer && card.answer.trim().length > 0, `type card ${card.id} needs an answer`);
      // A typed answer should be one token, the blank that's filled in.
      assert.ok(!/\s/.test(card.answer.trim()), `type card ${card.id} should be a single word`);
    } else {
      assert.equal(card.answer, null, `recall card ${card.id} should not have a typed answer`);
    }
  });
});

test('sentence-builder answers equal their token order and have a translation', () => {
  sentenceBuilders.forEach((item) => {
    assert.equal(item.answer, item.tokens.join(' '));
    assert.ok(item.fa && item.tokens.length >= 3, `weak builder ${item.id}`);
  });
});

test('dictations carry English audio text and a Persian meaning', () => {
  dictations.forEach((item) => {
    assert.ok(item.en && item.fa, `incomplete dictation ${item.id}`);
  });
});

test('all ids are unique within each collection', () => {
  const unique = (arr) => new Set(arr).size === arr.length;
  assert.ok(unique(quizzes.map((q) => q.id)), 'duplicate quiz id');
  assert.ok(unique(flashcards.map((c) => c.id)), 'duplicate flashcard id');
  assert.ok(unique(lessons.map((l) => l.id)), 'duplicate lesson id');
  assert.ok(unique(sentenceBuilders.map((s) => s.id)), 'duplicate builder id');
  assert.ok(unique(dictations.map((d) => d.id)), 'duplicate dictation id');
  assert.ok(unique(dialogues.map((d) => d.id)), 'duplicate dialogue id');
});

// ---- Expanded multi-category content --------------------------------------

test('every lesson has a category known to lessonCategories', () => {
  const known = new Set(lessonCategories.map((c) => c.id));
  lessons.forEach((lesson) => {
    assert.ok(lesson.category, `lesson ${lesson.id} has no category`);
    assert.ok(known.has(lesson.category), `lesson ${lesson.id} has unknown category ${lesson.category}`);
  });
});

test('each lesson category contains at least one lesson', () => {
  lessonCategories.forEach((cat) => {
    assert.ok(
      lessons.some((lesson) => lesson.category === cat.id),
      `category ${cat.id} has no lessons`,
    );
  });
});

test('the content set really expanded (10x scale guardrail)', () => {
  // Baseline v1 was 11 lessons / 60 quizzes / 40 cards. Guard against regressions.
  assert.ok(lessons.length >= 50, `expected >=50 lessons, got ${lessons.length}`);
  assert.ok(quizzes.length >= 250, `expected >=250 quizzes, got ${quizzes.length}`);
  assert.ok(flashcards.length >= 100, `expected >=100 flashcards, got ${flashcards.length}`);
  assert.ok(dialogues.length >= 15, `expected >=15 dialogues, got ${dialogues.length}`);
});

test('every dialogue has a scenario, alternating-ready lines, and key phrases', () => {
  dialogues.forEach((d) => {
    assert.ok(d.titleFa && d.scenarioFa, `dialogue ${d.id} missing title/scenario`);
    assert.equal(d.category, 'conversation', `dialogue ${d.id} wrong category`);
    assert.ok(d.lines.length >= 4, `dialogue ${d.id} too short`);
    d.lines.forEach((line) => {
      assert.ok(line.speaker && line.en && line.fa, `dialogue ${d.id} has an incomplete line`);
    });
    assert.ok(d.phrases.length >= 1, `dialogue ${d.id} has no key phrases`);
    d.phrases.forEach((p) => assert.ok(p.en && p.fa, `dialogue ${d.id} has an incomplete phrase`));
  });
});
