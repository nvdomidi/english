# فعلستان — Expansion Plan (10x Content)

## Goal

Grow the app to **at least 10x** its current learning content while keeping the
exact same simple, Persian-first, easy-to-understand UI and the same data model.
Add many more English-verb lessons first, then extend into **grammar**,
**vocabulary**, and **conversation** (conversation is a priority for users).

## Current baseline (v1)

| Collection        | Count |
|-------------------|-------|
| Lessons           | 11    |
| Quiz questions    | 60    |
| Flashcards        | 40    |
| Sentence builders | 12    |
| Dictations        | 12    |
| Dialogues         | 0     |

All verbs-only. One flat lesson list.

## Target (v2)

| Collection        | Target | Multiple |
|-------------------|--------|----------|
| Lessons           | 60+    | ~5.5x    |
| Quiz questions    | 300+   | ~5x      |
| Flashcards        | 220+   | ~5.5x    |
| Sentence builders | 60+    | ~5x      |
| Dictations        | 60+    | ~5x      |
| Dialogues (new)   | 16+    | new      |

Counting every authored learning unit (lessons + questions + cards + builders +
dictations + dialogue lines + key phrases), the total crosses **10x** the v1
content.

## Categories

Lessons gain a `category` field so the same lesson UI can group them with simple
filter chips (هیچ new screen needed — same cards, same flow):

1. **`verbs` (افعال)** — extend the core tense/modal path:
   will-future, present-perfect-continuous, past-perfect, used-to,
   would-like / would, have-to / need-to, may / might / could,
   there is / there are, imperatives, gerund vs infinitive,
   passive voice intro, question tags / short answers.
2. **`grammar` (گرامر)** — articles, plurals, this/that, subject & object
   pronouns, possessives, prepositions of place, prepositions of time,
   comparatives & superlatives, adverbs, some/any/much/many, quantifiers,
   conjunctions, question words, zero/first/second conditionals, relative clauses.
3. **`vocabulary` (واژگان)** — themed word sets: numbers, days & months, telling
   time, family, colors, food & drink, body, clothes, house, jobs, weather,
   animals, transport, places in town, opposites, feelings, money & shopping.
4. **`conversation` (مکالمه)** — new screen + new data type (`dialogues`):
   greetings & introductions, café/restaurant, shopping, directions, doctor,
   phone call, hotel, small talk, making plans, airport, job interview, bank,
   asking for help, appointments, thanking & apologizing, daily routine.

## Architecture changes (minimal, non-breaking)

- New data modules under `src/data/`:
  - `_shape.js` — shared seed→object transforms (quiz, card, builder, dictation).
  - `grammar.js`, `vocabulary.js`, `verbs-extra.js` — each exports shaped
    `lessons / quizzes / flashcards / sentenceBuilders / dictations`.
  - `conversation.js` — exports `dialogues`.
- `content.js` keeps the original verb content, tags it `category: 'verbs'`, and
  concatenates every module into the same five exported arrays + `dialogues`.
  All existing imports keep working unchanged.
- `main.jsx`:
  - `LessonsView` gets category filter chips (همه / افعال / گرامر / واژگان).
  - New `مکالمه` tab + `ConversationView` rendering chat-bubble dialogues with
    per-line and play-all TTS, plus a key-phrases list.
- `styles.css`: add dialogue/chat-bubble + category-chip styles, reusing tokens.

## Content principles (keep the v1 voice)

- Short, conversational Persian. Minimal grammar jargon.
- Every lesson: `shortGoal`, plain `explanationFa`, 3–4 `patterns`, 4 `examples`,
  5 quiz questions whose sentences differ from the examples (recall, not recognition).
- English always rendered LTR via the `English` component; TTS on every sentence.
- New IDs are namespaced by category to stay globally unique
  (`gq*`/`gc*` grammar, `wq*`/`wc*` vocab, `xq*`/`xc*` verbs-extra, `dlg*` dialogues).

## Test plan

- Keep all 20 existing tests green.
- Extend content-integrity tests to the merged set: id uniqueness across the
  larger arrays, every lesson has a valid `category`, every dialogue has lines
  with `en`/`fa`, lesson `quizQuestionIds` still resolve.
- `npm run build` succeeds.

## Result (delivered)

| Collection        | v1  | v2  |
|-------------------|-----|-----|
| Lessons           | 11  | 72  (verbs 33, grammar 19, vocabulary 20) |
| Quiz questions    | 60  | 480 |
| Flashcards        | 40  | 340 |
| Sentence builders | 12  | 96  |
| Dictations        | 12  | 96  |
| Dialogues (new)   | 0   | 23  (179 lines, 92 key phrases) |

Counting every authored learning unit: **135 → 1355 ≈ 10.0x**. 24/24 tests green,
`npm run build` clean, preview server serves HTTP 200.

Data modules merged in `content.js`: `verbs-extra`, `more-lessons`, `grammar`,
`vocabulary`, `quiz-bank`, `word-bank`, `practice-bank`, `conversation`.
