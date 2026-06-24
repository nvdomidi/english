import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BookOpenCheck,
  Brain,
  CheckCircle2,
  Dumbbell,
  Flame,
  Home,
  Layers3,
  MessagesSquare,
  Moon,
  MoreHorizontal,
  Play,
  RotateCcw,
  Sparkles,
  Sun,
  Trophy,
  Volume2,
  XCircle,
} from 'lucide-react';
import {
  lessons,
  lessonCategories,
  flashcards,
  quizzes,
  sentenceBuilders,
  dictations,
  dialogues,
} from './data/content.js';
import {
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
  updateSettings,
} from './utils/progress.js';
import './styles.css';

const tabs = [
  { id: 'home', label: 'خانه', icon: Home },
  { id: 'lessons', label: 'مسیر یادگیری', icon: BookOpenCheck },
  { id: 'flashcards', label: 'فلش کارت', icon: Layers3 },
  { id: 'quizzes', label: 'آزمون', icon: Brain },
  { id: 'conversation', label: 'مکالمه', icon: MessagesSquare },
  { id: 'practice', label: 'تمرین', icon: Dumbbell },
  { id: 'progress', label: 'پیشرفت', icon: Trophy },
];

// On phones the bottom tab bar shows these primary destinations; the rest live
// behind the "بیشتر" (more) sheet so 7 items don't get crammed into one row.
const primaryTabIds = ['home', 'lessons', 'flashcards', 'conversation'];
const primaryTabs = primaryTabIds.map((id) => tabs.find((tab) => tab.id === id));
const moreTabs = tabs.filter((tab) => !primaryTabIds.includes(tab.id));

// ---- Text to speech -------------------------------------------------------

const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

function speak(text) {
  if (!ttsSupported || !text) return;
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.92;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch {
    // ignore speech errors
  }
}

// Speak several lines back-to-back (used by "play whole dialogue").
function speakSequence(texts) {
  if (!ttsSupported || !texts.length) return;
  try {
    window.speechSynthesis.cancel();
    texts.forEach((text) => {
      if (!text) return;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    });
  } catch {
    // ignore speech errors
  }
}

function SpeakButton({ text, label = 'شنیدن تلفظ' }) {
  if (!ttsSupported) return null;
  return (
    <button
      aria-label={label}
      className="speak-button"
      onClick={() => speak(text)}
      title={label}
      type="button"
    >
      <Volume2 size={16} />
    </button>
  );
}

// ---- App ------------------------------------------------------------------

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [moreOpen, setMoreOpen] = useState(false);
  const [progress, setProgress] = useState(getInitialProgress);

  // Navigate and always close the mobile "more" sheet.
  const goTo = (tabId) => {
    setActiveTab(tabId);
    setMoreOpen(false);
  };

  const updateProgress = (updater) => {
    setProgress((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater;
      return addActivity(next);
    });
  };

  const stats = useMemo(() => getStats(progress), [progress]);
  const theme = progress.settings.theme;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () =>
    setProgress((current) => updateSettings(current, { theme: current.settings.theme === 'dark' ? 'light' : 'dark' }));

  const activeLabel = tabs.find((tab) => tab.id === activeTab)?.label || '';

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="ناوبری اصلی">
        <div className="brand">
          <div className="brand-mark">ف</div>
          <div>
            <strong>فعلستان</strong>
            <span>انگلیسی با توضیح فارسی</span>
          </div>
        </div>
        <nav className="nav-list">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                className={activeTab === tab.id ? 'nav-item active' : 'nav-item'}
                key={tab.id}
                onClick={() => goTo(tab.id)}
                type="button"
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
        <button className="theme-toggle" onClick={toggleTheme} type="button">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          {theme === 'dark' ? 'حالت روشن' : 'حالت تیره'}
        </button>
        <div className="side-score">
          <Flame size={18} />
          <span>{stats.streak} روز پیاپی</span>
          <strong>{progress.points} امتیاز</strong>
          <DailyGoalBar daily={progress.daily} goal={progress.settings.dailyGoal} />
        </div>
      </aside>

      {/* Mobile-only top app bar: brand + points/streak + theme toggle. */}
      <header className="topbar" aria-label="نوار بالا">
        <div className="topbar-brand">
          <div className="brand-mark small">ف</div>
          <strong>{activeLabel}</strong>
        </div>
        <div className="topbar-meta">
          <span className="topbar-score">
            <Flame size={15} /> {stats.streak}
            <strong>{progress.points}</strong>
          </span>
          <button className="topbar-theme" onClick={toggleTheme} type="button" aria-label="تغییر حالت رنگ">
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </header>

      <main className="main-content">
        {activeTab === 'home' && <HomeView progress={progress} stats={stats} setActiveTab={goTo} />}
        {activeTab === 'lessons' && <LessonsView progress={progress} updateProgress={updateProgress} />}
        {activeTab === 'flashcards' && <FlashcardsView progress={progress} updateProgress={updateProgress} />}
        {activeTab === 'quizzes' && <QuizzesView progress={progress} updateProgress={updateProgress} />}
        {activeTab === 'conversation' && <ConversationView progress={progress} updateProgress={updateProgress} />}
        {activeTab === 'practice' && <PracticeView progress={progress} updateProgress={updateProgress} />}
        {activeTab === 'progress' && (
          <ProgressView
            progress={progress}
            stats={stats}
            onReset={() => {
              if (window.confirm('همه امتیازها و پیشرفت پاک شود؟')) {
                setProgress(resetProgress());
              }
            }}
          />
        )}
      </main>

      {/* Mobile-only bottom tab bar. */}
      <nav className="bottom-nav" aria-label="ناوبری پایین">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              className={activeTab === tab.id ? 'bottom-nav-item active' : 'bottom-nav-item'}
              key={tab.id}
              onClick={() => goTo(tab.id)}
              type="button"
            >
              <Icon size={22} />
              <span>{tab.label}</span>
            </button>
          );
        })}
        <button
          className={
            moreOpen || moreTabs.some((tab) => tab.id === activeTab)
              ? 'bottom-nav-item active'
              : 'bottom-nav-item'
          }
          onClick={() => setMoreOpen((open) => !open)}
          type="button"
          aria-expanded={moreOpen}
        >
          <MoreHorizontal size={22} />
          <span>بیشتر</span>
        </button>
      </nav>

      {/* "More" bottom sheet for the secondary destinations. */}
      {moreOpen && (
        <div className="more-sheet-backdrop" onClick={() => setMoreOpen(false)}>
          <div className="more-sheet" onClick={(event) => event.stopPropagation()} role="menu">
            <div className="more-sheet-handle" />
            {moreTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  className={activeTab === tab.id ? 'more-sheet-item active' : 'more-sheet-item'}
                  key={tab.id}
                  onClick={() => goTo(tab.id)}
                  type="button"
                  role="menuitem"
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function DailyGoalBar({ daily, goal }) {
  const today = new Date().toISOString().slice(0, 10);
  const count = daily.date === today ? daily.count : 0;
  const pct = Math.min(100, Math.round((count / goal) * 100));
  const done = count >= goal;
  return (
    <div className="daily-goal" title={`هدف امروز: ${count} از ${goal}`}>
      <div className="daily-goal-track">
        <div className={done ? 'daily-goal-fill done' : 'daily-goal-fill'} style={{ width: `${pct}%` }} />
      </div>
      <small>{done ? '🎯 هدف امروز کامل شد!' : `هدف امروز: ${count}/${goal}`}</small>
    </div>
  );
}

function HomeView({ progress, stats, setActiveTab }) {
  const nextLesson = lessons.find((lesson) => !progress.completedLessons.includes(lesson.id)) || lessons[0];
  const dueCount = getDueCardIds(progress, flashcards).length;
  const mistakeCount = progress.mistakes.length;
  const dialoguesLeft = dialogues.length - (progress.dialoguesPracticed || []).length;

  return (
    <section className="page">
      <div className="hero">
        <div className="hero-copy">
          <span className="eyebrow">انگلیسی، ساده و مرحله ای</span>
          <h1>فعل، گرامر، واژگان و مکالمه را با توضیح کوتاه فارسی، مثال و تمرین یاد بگیر.</h1>
          <p>
            از جمله های پایه مثل <English text="I am" /> و <English text="I go" /> شروع کن، به
            ساختارهایی مثل <English text="I have been going" /> برس، و با گفت‌وگوهای روزمره مکالمه را تمرین کن.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => setActiveTab('lessons')} type="button">
              شروع مسیر
            </button>
            <button className="ghost-button" onClick={() => setActiveTab('flashcards')} type="button">
              تمرین فلش کارت
            </button>
          </div>
        </div>
        <div className="hero-panel" aria-label="خلاصه پیشرفت">
          <Sparkles size={28} />
          <strong>{progress.points} امتیاز</strong>
          <span>{stats.completedLessons} درس کامل شده</span>
          <span>{stats.streak} روز تمرین پشت سر هم</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <ActionCard
          title="درس بعدی"
          value={nextLesson.titleFa}
          detail={nextLesson.shortGoal}
          cta="برو به درس"
          onClick={() => setActiveTab('lessons')}
        />
        <ActionCard
          title="مرور امروز"
          value={dueCount ? `${dueCount} کارت آماده` : 'فعلا چیزی نمانده'}
          detail="فلش کارت ها بر اساس فاصله‌گذاری هوشمند مرور می‌شوند."
          cta="شروع مرور"
          onClick={() => setActiveTab('flashcards')}
        />
        <ActionCard
          title="مکالمهٔ امروز"
          value={dialoguesLeft ? `${dialoguesLeft} گفت‌وگو` : 'همه را تمرین کردی 👏'}
          detail="گفت‌وگوهای واقعی روزمره را بخوان، گوش بده و تکرار کن."
          cta="شروع مکالمه"
          onClick={() => setActiveTab('conversation')}
        />
        <ActionCard
          title="رفع اشتباه ها"
          value={mistakeCount ? `${mistakeCount} مورد` : 'اشتباهی نداری 👏'}
          detail="سؤال ها و کارت هایی که اشتباه زدی، اینجا برای تمرین جمع می‌شوند."
          cta="تمرین اشتباه ها"
          onClick={() => setActiveTab('practice')}
        />
      </div>
    </section>
  );
}

function LessonsView({ progress, updateProgress }) {
  const [category, setCategory] = useState(lessonCategories[0].id);
  const visibleLessons = lessons.filter((lesson) => lesson.category === category);
  const [selectedId, setSelectedId] = useState(visibleLessons[0].id);

  // Keep a valid selection when switching category.
  const pickCategory = (id) => {
    setCategory(id);
    const first = lessons.find((lesson) => lesson.category === id);
    if (first) setSelectedId(first.id);
  };

  const selectedLesson = lessons.find((lesson) => lesson.id === selectedId);
  const lessonQuestions = quizzes.filter((quiz) => selectedLesson.quizQuestionIds.includes(quiz.id));
  const doneInCategory = visibleLessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).length;

  return (
    <section className="page two-column">
      <div className="lesson-list">
        <div className="section-heading">
          <span>مسیر پیشنهادی</span>
          <h2>از ساده تا پیشرفته</h2>
        </div>
        <div className="chip-row category-chips">
          {lessonCategories.map((cat) => (
            <button
              className={category === cat.id ? 'chip active' : 'chip'}
              key={cat.id}
              onClick={() => pickCategory(cat.id)}
              type="button"
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
        <small className="lesson-list-progress">
          {doneInCategory} از {visibleLessons.length} درس این بخش کامل شده
        </small>
        <div className="lesson-rows">
          {visibleLessons.map((lesson, index) => {
            const done = progress.completedLessons.includes(lesson.id);
            return (
              <button
                className={lesson.id === selectedId ? 'lesson-row active' : 'lesson-row'}
                key={lesson.id}
                onClick={() => setSelectedId(lesson.id)}
                type="button"
              >
                <span className={done ? 'lesson-number done' : 'lesson-number'}>{done ? '✓' : index + 1}</span>
                <span>
                  <strong>{lesson.titleFa}</strong>
                  <small>{lesson.level}</small>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <article className="lesson-detail">
        <div className="section-heading">
          <span>{selectedLesson.level}</span>
          <h2>{selectedLesson.titleFa}</h2>
          <p>{selectedLesson.explanationFa}</p>
        </div>

        <div className="pattern-grid">
          {selectedLesson.patterns.map((pattern) => (
            <div className="pattern-card" key={pattern.form}>
              <English text={pattern.form} />
              <span>{pattern.meaningFa}</span>
            </div>
          ))}
        </div>

        <h3>مثال ها</h3>
        <div className="examples">
          {selectedLesson.examples.map((example) => (
            <div className="example-row" key={example.en}>
              <div className="example-en">
                <English text={example.en} />
                <SpeakButton text={example.en} />
              </div>
              <span>{example.fa}</span>
              {example.note && <small>{example.note}</small>}
            </div>
          ))}
        </div>

        <MiniQuiz
          key={selectedLesson.id}
          heading="تمرین این درس"
          questions={lessonQuestions}
          onAnswer={(questionId, correct) =>
            updateProgress((current) => recordQuizAnswer(current, questionId, correct))
          }
          onFinish={(score, total) => {
            updateProgress((current) => {
              const afterQuiz = recordQuiz(current, `lesson-${selectedLesson.id}`, score, total);
              return score === total ? completeLesson(afterQuiz, selectedLesson.id) : afterQuiz;
            });
          }}
        />

        <button
          className="primary-button"
          onClick={() => updateProgress((current) => completeLesson(current, selectedLesson.id))}
          type="button"
        >
          این درس را کامل کردم
        </button>
      </article>
    </section>
  );
}

// ---- Flashcards with SRS + typed recall -----------------------------------

function normalize(value) {
  return (value || '')
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:]/g, '')
    .replace(/\s+/g, ' ');
}

function FlashcardsView({ progress, updateProgress }) {
  // Order: due cards first, then by weakest (lowest box). Frozen per mount.
  const orderedCards = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return [...flashcards].sort((a, b) => {
      const sa = progress.flashcards[a.id];
      const sb = progress.flashcards[b.id];
      const dueA = !sa || !sa.due || sa.due <= today ? 0 : 1;
      const dueB = !sb || !sb.due || sb.due <= today ? 0 : 1;
      if (dueA !== dueB) return dueA - dueB;
      return (sa?.box || 0) - (sb?.box || 0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [typed, setTyped] = useState('');
  const [checked, setChecked] = useState(null); // null | true | false
  const inputRef = useRef(null);
  const card = orderedCards[index % orderedCards.length];

  const goNext = (known) => {
    updateProgress((current) => recordFlashcard(current, card.id, known));
    setRevealed(false);
    setTyped('');
    setChecked(null);
    setIndex((current) => (current + 1) % orderedCards.length);
  };

  const checkTyped = () => {
    if (checked !== null) return;
    const correct = normalize(typed) === normalize(card.answer);
    setChecked(correct);
    setRevealed(true);
  };

  useEffect(() => {
    if (card?.mode === 'type' && inputRef.current) inputRef.current.focus();
  }, [index, card]);

  // Keyboard shortcuts (ignored while typing in the answer box).
  useEffect(() => {
    const handler = (event) => {
      const typingHere = event.target === inputRef.current;
      if (card?.mode === 'recall') {
        if (event.code === 'Space') {
          event.preventDefault();
          if (!revealed) setRevealed(true);
        } else if (revealed && (event.key === '1' || event.key.toLowerCase() === 'k')) {
          goNext(true);
        } else if (revealed && (event.key === '2' || event.key.toLowerCase() === 'j')) {
          goNext(false);
        }
      } else if (card?.mode === 'type' && !typingHere) {
        if (checked !== null && event.key === 'Enter') goNext(checked);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const dueIds = getDueCardIds(progress, flashcards);

  return (
    <section className="page practice-page">
      <div className="section-heading">
        <span>تمرین با تکرارِ فاصله‌دار</span>
        <h2>فلش کارت فعل ها</h2>
        <p>
          {dueIds.length
            ? `${dueIds.length} کارت برای مرورِ امروز آماده است. اول جواب را حدس بزن، بعد ببین.`
            : 'همهٔ کارت‌ها برای امروز مرور شده‌اند؛ می‌توانی برای تمرین بیشتر ادامه دهی.'}
        </p>
      </div>

      <div className="flashcard">
        <div className="card-top">
          <span className="card-topic">{card.topic}</span>
          <span className="card-counter">{(index % orderedCards.length) + 1} / {orderedCards.length}</span>
        </div>
        <h3>{card.promptFa}</h3>
        <div className="example-en">
          <English text={card.promptEn} />
          <SpeakButton text={card.exampleEn} />
        </div>

        {card.mode === 'type' && (
          <div className="type-area">
            <input
              ref={inputRef}
              className={
                checked === null ? 'type-input' : checked ? 'type-input correct' : 'type-input incorrect'
              }
              dir="ltr"
              disabled={checked !== null}
              onChange={(event) => setTyped(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && checked === null) checkTyped();
              }}
              placeholder="اینجا تایپ کن…"
              value={typed}
            />
            {checked !== null && (
              <div className={checked ? 'type-result ok' : 'type-result bad'}>
                {checked ? (
                  <><CheckCircle2 size={18} /> درست بود!</>
                ) : (
                  <><XCircle size={18} /> جواب درست: <strong dir="ltr">{card.answer}</strong></>
                )}
              </div>
            )}
          </div>
        )}

        {revealed && (
          <div className="flash-answer">
            <strong>{card.answerShortFa}</strong>
            <small>{card.hintFa}</small>
            <div className="example-en">
              <English text={card.exampleEn} />
              <SpeakButton text={card.exampleEn} />
            </div>
            <span>{card.exampleFa}</span>
          </div>
        )}
      </div>

      <div className="action-row">
        {card.mode === 'type' ? (
          checked === null ? (
            <button className="primary-button" onClick={checkTyped} type="button">
              بررسی جواب
            </button>
          ) : (
            <button className="primary-button" onClick={() => goNext(checked)} type="button">
              کارت بعدی
            </button>
          )
        ) : !revealed ? (
          <button className="primary-button" onClick={() => setRevealed(true)} type="button">
            جواب را ببین <kbd>Space</kbd>
          </button>
        ) : (
          <>
            <button className="success-button" onClick={() => goNext(true)} type="button">
              بلدم <kbd>1</kbd>
            </button>
            <button className="warn-button" onClick={() => goNext(false)} type="button">
              دوباره می خواهم <kbd>2</kbd>
            </button>
          </>
        )}
      </div>
    </section>
  );
}

function QuizzesView({ progress, updateProgress }) {
  const [topic, setTopic] = useState('all');
  const filtered = topic === 'all' ? quizzes : quizzes.filter((quiz) => quiz.topic === topic);
  const topics = ['all', ...new Set(quizzes.map((quiz) => quiz.topic))];

  return (
    <section className="page practice-page">
      <div className="section-heading">
        <span>امتیاز و مرور</span>
        <h2>آزمون فعل ها</h2>
        <p>یک موضوع را انتخاب کن و سؤال‌ها را یکی‌یکی با بازخورد فوری جواب بده.</p>
      </div>
      <div className="chip-row">
        {topics.map((item) => (
          <button className={topic === item ? 'chip active' : 'chip'} key={item} onClick={() => setTopic(item)} type="button">
            {item === 'all' ? 'همه' : item}
          </button>
        ))}
      </div>
      <MiniQuiz
        key={topic}
        questions={filtered.slice(0, 12)}
        onAnswer={(questionId, correct) =>
          updateProgress((current) => recordQuizAnswer(current, questionId, correct))
        }
        onFinish={(score, total) => updateProgress((current) => recordQuiz(current, `topic-${topic}`, score, total))}
      />
    </section>
  );
}

// ---- Conversation: real dialogues with TTS --------------------------------

function ConversationView({ progress, updateProgress }) {
  const [index, setIndex] = useState(0);
  const dialogue = dialogues[index % dialogues.length];
  const practiced = progress.dialoguesPracticed || [];
  const doneCount = practiced.length;

  const goNext = () => setIndex((current) => (current + 1) % dialogues.length);

  const markPracticed = () => {
    updateProgress((current) => {
      const list = current.dialoguesPracticed || [];
      const seen = list.includes(dialogue.id);
      const base = awardPoints(current, seen ? 2 : 8);
      return seen ? base : { ...base, dialoguesPracticed: [...list, dialogue.id] };
    });
    goNext();
  };

  return (
    <section className="page practice-page conversation-page">
      <div className="section-heading">
        <span>مکالمهٔ واقعی</span>
        <h2>گفت‌وگوهای روزمره</h2>
        <p>هر گفت‌وگو را بخوان، گوش بده و بلندبلند تکرار کن. روی هر جمله بزن تا تلفظش را بشنوی، یا کل گفت‌وگو را پخش کن.</p>
      </div>

      <div className="chip-row">
        {dialogues.map((item, i) => (
          <button
            className={i === index % dialogues.length ? 'chip active' : 'chip'}
            key={item.id}
            onClick={() => setIndex(i)}
            type="button"
          >
            {practiced.includes(item.id) ? '✓ ' : ''}{item.titleFa}
          </button>
        ))}
      </div>

      <div className="exercise-card conversation-card">
        <div className="card-top">
          <span className="card-topic">{dialogue.level}</span>
          <button
            className="ghost-button small play-all"
            onClick={() => speakSequence(dialogue.lines.map((line) => line.en))}
            type="button"
          >
            <Play size={14} /> پخش کامل گفت‌وگو
          </button>
        </div>
        <p className="exercise-prompt">{dialogue.scenarioFa}</p>

        <div className="dialogue">
          {dialogue.lines.map((line, i) => (
            <div className={i % 2 === 0 ? 'bubble-row start' : 'bubble-row end'} key={i}>
              <div className="bubble">
                <span className="bubble-speaker">{line.speaker}</span>
                <div className="example-en">
                  <English text={line.en} />
                  <SpeakButton text={line.en} />
                </div>
                <span className="bubble-fa">{line.fa}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="phrase-box">
          <h3>عبارت‌های کلیدی</h3>
          {dialogue.phrases.map((phrase, i) => (
            <div className="phrase-row" key={i}>
              <div className="example-en">
                <English text={phrase.en} />
                <SpeakButton text={phrase.en} />
              </div>
              <span>{phrase.fa}</span>
            </div>
          ))}
        </div>

        <div className="action-row">
          <button className="primary-button" onClick={markPracticed} type="button">
            این گفت‌وگو را تمرین کردم
          </button>
        </div>
      </div>

      <small className="conversation-progress">{doneCount} از {dialogues.length} گفت‌وگو تمرین شده</small>
    </section>
  );
}

// ---- Practice hub: sentence building, dictation, mistakes review ----------

function PracticeView({ progress, updateProgress }) {
  const [mode, setMode] = useState('builder');
  const modes = [
    { id: 'builder', label: 'جمله‌سازی' },
    { id: 'dictation', label: 'دیکته شنیداری' },
    { id: 'mistakes', label: `رفع اشتباه‌ها${progress.mistakes.length ? ` (${progress.mistakes.length})` : ''}` },
  ];

  return (
    <section className="page practice-page">
      <div className="section-heading">
        <span>تمرین فعال</span>
        <h2>مهارت‌سازی</h2>
        <p>این تمرین‌ها به‌جای شناختن، تولید و یادآوری فعال را تقویت می‌کنند.</p>
      </div>
      <div className="chip-row">
        {modes.map((item) => (
          <button className={mode === item.id ? 'chip active' : 'chip'} key={item.id} onClick={() => setMode(item.id)} type="button">
            {item.label}
          </button>
        ))}
      </div>
      {mode === 'builder' && <SentenceBuilder updateProgress={updateProgress} />}
      {mode === 'dictation' && <Dictation updateProgress={updateProgress} />}
      {mode === 'mistakes' && <MistakesReview progress={progress} updateProgress={updateProgress} />}
    </section>
  );
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function SentenceBuilder({ updateProgress }) {
  const [index, setIndex] = useState(0);
  const item = sentenceBuilders[index % sentenceBuilders.length];
  const [pool, setPool] = useState(() => shuffle(item.tokens.map((word, i) => ({ word, key: i }))));
  const [built, setBuilt] = useState([]);
  const [result, setResult] = useState(null); // null | true | false

  const reset = (nextItem) => {
    setPool(shuffle(nextItem.tokens.map((word, i) => ({ word, key: i }))));
    setBuilt([]);
    setResult(null);
  };

  const place = (token) => {
    if (result !== null) return;
    setBuilt((current) => [...current, token]);
    setPool((current) => current.filter((t) => t.key !== token.key));
  };

  const unplace = (token) => {
    if (result !== null) return;
    setBuilt((current) => current.filter((t) => t.key !== token.key));
    setPool((current) => [...current, token]);
  };

  const check = () => {
    const answer = built.map((t) => t.word).join(' ');
    const correct = answer === item.answer;
    setResult(correct);
    updateProgress((current) => awardPoints(current, correct ? 4 : 1));
  };

  const next = () => {
    const nextItem = sentenceBuilders[(index + 1) % sentenceBuilders.length];
    setIndex((current) => current + 1);
    reset(nextItem);
  };

  return (
    <div className="exercise-card">
      <div className="card-top">
        <span className="card-topic">{item.topic}</span>
        <span className="card-counter">{(index % sentenceBuilders.length) + 1} / {sentenceBuilders.length}</span>
      </div>
      <p className="exercise-prompt">این جمله را با چیدن کلمه‌ها بساز:</p>
      <strong className="builder-target">{item.fa}</strong>

      <div className={result === null ? 'builder-line' : result ? 'builder-line correct' : 'builder-line incorrect'} dir="ltr">
        {built.length ? (
          built.map((token) => (
            <button className="token placed" key={token.key} onClick={() => unplace(token)} type="button">
              {token.word}
            </button>
          ))
        ) : (
          <span className="builder-placeholder">کلمه‌ها را اینجا بچین…</span>
        )}
      </div>

      <div className="token-pool" dir="ltr">
        {pool.map((token) => (
          <button className="token" key={token.key} onClick={() => place(token)} type="button">
            {token.word}
          </button>
        ))}
      </div>

      {result !== null && (
        <div className={result ? 'type-result ok' : 'type-result bad'}>
          {result ? (
            <><CheckCircle2 size={18} /> آفرین! درست بود.</>
          ) : (
            <span className="example-en"><XCircle size={18} /> جواب درست: <English text={item.answer} /> <SpeakButton text={item.answer} /></span>
          )}
        </div>
      )}

      <div className="action-row">
        {result === null ? (
          <button className="primary-button" disabled={pool.length > 0} onClick={check} type="button">
            بررسی جمله
          </button>
        ) : (
          <button className="primary-button" onClick={next} type="button">
            جملهٔ بعدی
          </button>
        )}
      </div>
    </div>
  );
}

function Dictation({ updateProgress }) {
  const [index, setIndex] = useState(0);
  const item = dictations[index % dictations.length];
  const [typed, setTyped] = useState('');
  const [checked, setChecked] = useState(null);

  useEffect(() => {
    // Auto-play the sentence when a new one appears.
    speak(item.en);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const check = () => {
    if (checked !== null) return;
    const correct = normalize(typed) === normalize(item.en);
    setChecked(correct);
    updateProgress((current) => awardPoints(current, correct ? 5 : 1));
  };

  const next = () => {
    setIndex((current) => current + 1);
    setTyped('');
    setChecked(null);
  };

  return (
    <div className="exercise-card">
      <div className="card-top">
        <span className="card-topic">{item.topic}</span>
        <span className="card-counter">{(index % dictations.length) + 1} / {dictations.length}</span>
      </div>
      <p className="exercise-prompt">به جمله گوش بده و دقیقاً همان را به انگلیسی بنویس:</p>
      {!ttsSupported && <small className="warn-note">مرورگر تو پخش صدا را پشتیبانی نمی‌کند.</small>}
      <button className="big-speak" onClick={() => speak(item.en)} type="button">
        <Volume2 size={22} /> پخش دوباره
      </button>

      <input
        className={checked === null ? 'type-input wide' : checked ? 'type-input wide correct' : 'type-input wide incorrect'}
        dir="ltr"
        disabled={checked !== null}
        onChange={(event) => setTyped(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && checked === null) check();
        }}
        placeholder="What did you hear?"
        value={typed}
      />

      {checked !== null && (
        <div className={checked ? 'type-result ok' : 'type-result bad'}>
          {checked ? (
            <><CheckCircle2 size={18} /> عالی بود!</>
          ) : (
            <span className="example-en"><XCircle size={18} /> درستش: <English text={item.en} /></span>
          )}
          <span className="dictation-fa">{item.fa}</span>
        </div>
      )}

      <div className="action-row">
        {checked === null ? (
          <button className="primary-button" onClick={check} type="button">
            بررسی
          </button>
        ) : (
          <button className="primary-button" onClick={next} type="button">
            جملهٔ بعدی
          </button>
        )}
      </div>
    </div>
  );
}

function MistakesReview({ progress, updateProgress }) {
  const quizMistakes = progress.mistakes.filter((m) => m.kind === 'quiz');
  const cardMistakes = progress.mistakes.filter((m) => m.kind === 'flashcard');
  const questions = quizMistakes
    .map((m) => quizzes.find((q) => q.id === m.refId))
    .filter(Boolean);
  const cards = cardMistakes
    .map((m) => flashcards.find((c) => c.id === m.refId))
    .filter(Boolean);

  if (!questions.length && !cards.length) {
    return (
      <div className="exercise-card empty-state">
        <CheckCircle2 size={40} />
        <h3>هیچ اشتباهی برای مرور نداری!</h3>
        <p>هر سؤال یا کارتی که اشتباه بزنی، خودکار اینجا جمع می‌شود تا هدفمند تمرینش کنی.</p>
      </div>
    );
  }

  return (
    <div className="mistakes-wrap">
      {cards.length > 0 && (
        <div className="exercise-card">
          <h3>کارت‌های سخت ({cards.length})</h3>
          <p className="exercise-prompt">این‌ها را اشتباه زده‌ای؛ یک بار دیگر مرورشان کن.</p>
          <div className="mistake-list">
            {cards.map((card) => (
              <div className="mistake-row" key={card.id}>
                <div className="example-en">
                  <English text={card.exampleEn} />
                  <SpeakButton text={card.exampleEn} />
                </div>
                <span>{card.exampleFa}</span>
                <button
                  className="ghost-button small"
                  onClick={() => updateProgress((current) => recordFlashcard(current, card.id, true))}
                  type="button"
                >
                  بلد شدم
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {questions.length > 0 && (
        <MiniQuiz
          key={questions.map((q) => q.id).join('-')}
          heading={`سؤال‌های اشتباه (${questions.length})`}
          questions={questions}
          onAnswer={(questionId, correct) =>
            updateProgress((current) => recordQuizAnswer(current, questionId, correct))
          }
          onFinish={(score, total) => updateProgress((current) => recordQuiz(current, 'review-mistakes', score, total))}
        />
      )}
    </div>
  );
}

// ---- Progress -------------------------------------------------------------

function masteryByTopic(progress) {
  const maxBox = SRS_INTERVALS.length - 1;
  const byTopic = {};
  flashcards.forEach((card) => {
    if (!byTopic[card.topic]) byTopic[card.topic] = { total: 0, score: 0 };
    const state = progress.flashcards[card.id];
    byTopic[card.topic].total += 1;
    byTopic[card.topic].score += state ? Math.min(state.box, maxBox) / maxBox : 0;
  });
  return Object.entries(byTopic).map(([topic, { total, score }]) => ({
    topic,
    pct: Math.round((score / total) * 100),
  }));
}

function ProgressView({ progress, stats, onReset }) {
  const totalReviews = Object.values(progress.flashcards).reduce((sum, c) => sum + (c.seen || 0), 0);
  const badges = [
    progress.points >= 20 && 'شروع قوی',
    stats.streak >= 3 && '۳ روز پشت سر هم',
    stats.streak >= 7 && 'یک هفتهٔ کامل',
    progress.completedLessons.includes('be-present') && 'استاد to be',
    stats.completedLessons >= 6 && 'نیمه راه',
    stats.completedLessons >= lessons.length && 'فاتح مسیر',
    totalReviews >= 30 && 'مرورگر سخت‌کوش',
    progress.points >= 200 && 'دویست امتیازی',
  ].filter(Boolean);

  const mastery = masteryByTopic(progress);

  return (
    <section className="page">
      <div className="section-heading">
        <span>همه چیز محلی ذخیره می شود</span>
        <h2>پیشرفت من</h2>
      </div>
      <div className="dashboard-grid">
        <InfoCard title="امتیاز کل" value={progress.points} detail="از درس، آزمون، فلش کارت و تمرین" />
        <InfoCard title="روزهای پیاپی" value={`${stats.streak} روز`} detail="روزهایی که تمرین کرده ای" />
        <InfoCard title="درس های کامل" value={`${stats.completedLessons}/${lessons.length}`} detail="مسیر مرحله ای" />
      </div>

      <div className="progress-panel">
        <h3>تسلط بر موضوع‌ها</h3>
        <div className="mastery-list">
          {mastery.map((row) => (
            <div className="mastery-row" key={row.topic}>
              <span className="mastery-label">{row.topic}</span>
              <div className="mastery-track">
                <div className="mastery-fill" style={{ width: `${row.pct}%` }} />
              </div>
              <span className="mastery-pct">{row.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="progress-panel">
        <h3>نشان ها</h3>
        <div className="badge-row">
          {badges.length ? badges.map((badge) => <span className="badge" key={badge}>{badge}</span>) : <span>هنوز نشانی نگرفته ای.</span>}
        </div>
      </div>

      <div className="progress-panel">
        <h3>آخرین آزمون ها</h3>
        {progress.quizAttempts.length ? (
          progress.quizAttempts.slice(-6).reverse().map((attempt, i) => (
            <div className="history-row" key={`${attempt.id}-${attempt.date}-${i}`}>
              <span>{attempt.id}</span>
              <strong>{attempt.score}/{attempt.total}</strong>
            </div>
          ))
        ) : (
          <p>هنوز آزمونی ثبت نشده است.</p>
        )}
      </div>
      <button className="ghost-button danger" onClick={onReset} type="button">
        <RotateCcw size={16} />
        پاک کردن پیشرفت
      </button>
    </section>
  );
}

// ---- Paginated quiz with instant feedback ---------------------------------

function MiniQuiz({ questions, onFinish, onAnswer, heading = 'تمرین کوتاه' }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // Keyboard: 1/2/3 pick a choice, Enter/Space advance.
  const stateRef = useRef();
  useEffect(() => {
    const handler = (event) => {
      const s = stateRef.current;
      if (!s || s.finished || !s.question) return;
      if (event.target.tagName === 'INPUT') return;
      if (!s.answered && ['1', '2', '3', '4'].includes(event.key)) {
        const idx = Number(event.key) - 1;
        if (idx < s.question.choices.length) s.choose(idx);
      } else if (s.answered && (event.key === 'Enter' || event.code === 'Space')) {
        event.preventDefault();
        s.next();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!questions.length) {
    return (
      <div className="quiz-box">
        <h3>{heading}</h3>
        <p>برای این بخش سؤالی موجود نیست.</p>
      </div>
    );
  }

  const question = questions[step];
  const answered = selected !== null;
  const isLast = step === questions.length - 1;

  const choose = (choice) => {
    if (answered) return;
    const correct = choice === question.correct;
    setSelected(choice);
    if (correct) setScore((current) => current + 1);
    if (onAnswer) onAnswer(question.id, correct);
  };

  const next = () => {
    if (!answered) return;
    if (isLast) {
      setFinished(true);
      if (onFinish) onFinish(score, questions.length);
    } else {
      setStep((current) => current + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setStep(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="quiz-box">
        <h3>{heading}</h3>
        <div className="quiz-result">
          <strong>{score} از {questions.length}</strong>
          <span>{pct >= 80 ? 'عالی بود! 🎉' : pct >= 50 ? 'خوب بود، با مرور بهتر می‌شوی.' : 'اشکالی ندارد، دوباره تمرین کن.'}</span>
          <button className="primary-button" onClick={restart} type="button">
            تمرین دوباره
          </button>
        </div>
      </div>
    );
  }

  stateRef.current = { question, answered, finished, choose, next };

  return (
    <div className="quiz-box">
      <div className="quiz-progress-head">
        <h3>{heading}</h3>
        <span className="card-counter">سؤال {step + 1} از {questions.length}</span>
      </div>
      <div className="quiz-progress-track">
        <div className="quiz-progress-fill" style={{ width: `${((step + (answered ? 1 : 0)) / questions.length) * 100}%` }} />
      </div>

      <div className="question">
        <p>{question.promptFa}</p>
        <div className="choice-grid">
          {question.choices.map((choice, choiceIndex) => {
            const className = [
              'choice',
              selected === choiceIndex && !answered ? 'selected' : '',
              answered && question.correct === choiceIndex ? 'correct' : '',
              answered && selected === choiceIndex && question.correct !== choiceIndex ? 'incorrect' : '',
            ].join(' ');
            return (
              <button
                className={className}
                disabled={answered}
                key={choice}
                onClick={() => choose(choiceIndex)}
                type="button"
              >
                <span className="choice-key">{choiceIndex + 1}</span>
                <span className="choice-text" dir="auto">{choice}</span>
              </button>
            );
          })}
        </div>
        {answered && (
          <div className={selected === question.correct ? 'feedback ok' : 'feedback bad'}>
            {selected === question.correct ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            <span>{question.explanationFa}</span>
          </div>
        )}
      </div>

      <button className="primary-button" disabled={!answered} onClick={next} type="button">
        {isLast ? 'دیدن نتیجه' : 'سؤال بعدی'}
      </button>
    </div>
  );
}

// ---- Small shared pieces --------------------------------------------------

function ActionCard({ title, value, detail, cta, onClick }) {
  return (
    <div className="info-card action-card">
      <span>{title}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
      <button className="ghost-button small" onClick={onClick} type="button">
        {cta}
      </button>
    </div>
  );
}

function InfoCard({ title, value, detail }) {
  return (
    <div className="info-card">
      <span>{title}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </div>
  );
}

function English({ text }) {
  return (
    <bdi className="english" dir="ltr">
      {text}
    </bdi>
  );
}

function getStats(progress) {
  return {
    completedLessons: progress.completedLessons.length,
    streak: progress.streak.current,
  };
}

createRoot(document.getElementById('root')).render(<App />);
