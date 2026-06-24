const progressKey = 'verb_app_progress_v1';

// Leitner spaced-repetition intervals (in days) for boxes 0..5.
// Box 0 = due again immediately/today; higher boxes wait longer.
export const SRS_INTERVALS = [0, 1, 2, 4, 7, 16];

const emptyProgress = {
  points: 0,
  completedLessons: [],
  flashcards: {},
  quizAttempts: [],
  dialoguesPracticed: [], // ids of conversation dialogues the learner finished
  mistakes: [], // [{ kind: 'quiz' | 'flashcard', refId }]
  daily: { date: null, count: 0 },
  settings: { theme: 'light', dailyGoal: 20 },
  streak: {
    current: 0,
    lastActiveDate: null,
  },
};

export function todayStr(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function getInitialProgress() {
  try {
    const saved = window.localStorage.getItem(progressKey);
    if (!saved) return emptyProgress;
    const parsed = JSON.parse(saved);
    // Merge so older saved data still loads after new fields are added.
    return {
      ...emptyProgress,
      ...parsed,
      daily: { ...emptyProgress.daily, ...(parsed.daily || {}) },
      settings: { ...emptyProgress.settings, ...(parsed.settings || {}) },
      streak: { ...emptyProgress.streak, ...(parsed.streak || {}) },
      mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes : [],
    };
  } catch {
    return emptyProgress;
  }
}

export function saveProgress(progress) {
  try {
    window.localStorage.setItem(progressKey, JSON.stringify(progress));
  } catch {
    // ignore storage errors (private mode, quota, etc.)
  }
  return progress;
}

export function addActivity(progress) {
  const today = todayStr();
  const last = progress.streak.lastActiveDate;

  if (last === today) {
    return saveProgress(progress);
  }

  const yesterday = todayStr(new Date(Date.now() - 86400000));
  const nextStreak = last === yesterday ? progress.streak.current + 1 : 1;

  return saveProgress({
    ...progress,
    streak: {
      current: nextStreak,
      lastActiveDate: today,
    },
  });
}

// Count one unit of practice toward today's goal.
function bumpDaily(progress, amount = 1) {
  const today = todayStr();
  const daily = progress.daily.date === today
    ? { date: today, count: progress.daily.count + amount }
    : { date: today, count: amount };
  return { ...progress, daily };
}

export function completeLesson(progress, lessonId) {
  if (progress.completedLessons.includes(lessonId)) {
    return saveProgress(progress);
  }

  return saveProgress({
    ...progress,
    points: progress.points + 12,
    completedLessons: [...progress.completedLessons, lessonId],
  });
}

// --- Spaced repetition for flashcards -------------------------------------

function defaultCardState() {
  return { seen: 0, known: 0, needsReview: 0, box: 0, due: todayStr() };
}

export function recordFlashcard(progress, cardId, known) {
  const current = { ...defaultCardState(), ...(progress.flashcards[cardId] || {}) };
  const nextBox = known ? Math.min(current.box + 1, SRS_INTERVALS.length - 1) : 0;
  const interval = SRS_INTERVALS[nextBox];
  const due = todayStr(new Date(Date.now() + interval * 86400000));

  let next = bumpDaily({
    ...progress,
    points: progress.points + (known ? 3 : 1),
    flashcards: {
      ...progress.flashcards,
      [cardId]: {
        seen: current.seen + 1,
        known: current.known + (known ? 1 : 0),
        needsReview: current.needsReview + (known ? 0 : 1),
        box: nextBox,
        due,
        lastReviewed: todayStr(),
      },
    },
  });

  next = known
    ? clearMistake(next, 'flashcard', cardId)
    : addMistake(next, 'flashcard', cardId);

  return saveProgress(next);
}

// Cards are "due" when their scheduled day has arrived (or they're brand new).
export function getDueCardIds(progress, allCards) {
  const today = todayStr();
  return allCards
    .filter((card) => {
      const state = progress.flashcards[card.id];
      return !state || !state.due || state.due <= today;
    })
    .map((card) => card.id);
}

// --- Quizzes & mistakes ----------------------------------------------------

export function recordQuiz(progress, id, score, total) {
  return saveProgress(
    bumpDaily(
      {
        ...progress,
        points: progress.points + score * 5,
        quizAttempts: [
          ...progress.quizAttempts,
          { id, score, total, date: new Date().toISOString() },
        ],
      },
      total,
    ),
  );
}

export function addMistake(progress, kind, refId) {
  const exists = progress.mistakes.some((m) => m.kind === kind && m.refId === refId);
  if (exists) return progress;
  return { ...progress, mistakes: [...progress.mistakes, { kind, refId }] };
}

export function clearMistake(progress, kind, refId) {
  return {
    ...progress,
    mistakes: progress.mistakes.filter((m) => !(m.kind === kind && m.refId === refId)),
  };
}

// Record a single quiz answer immediately (used by the per-question quiz flow)
// so wrong answers feed the "weak items" review deck right away.
export function recordQuizAnswer(progress, questionId, correct) {
  const next = correct
    ? clearMistake(progress, 'quiz', questionId)
    : addMistake(progress, 'quiz', questionId);
  return saveProgress(next);
}

export function awardPoints(progress, amount, { daily = true } = {}) {
  const base = { ...progress, points: progress.points + amount };
  return saveProgress(daily ? bumpDaily(base) : base);
}

// --- Settings --------------------------------------------------------------

export function updateSettings(progress, patch) {
  return saveProgress({ ...progress, settings: { ...progress.settings, ...patch } });
}

export function resetProgress() {
  try {
    window.localStorage.removeItem(progressKey);
  } catch {
    // ignore
  }
  return emptyProgress;
}
