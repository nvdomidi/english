// The original verbs core lives in this file; grammar, vocabulary, extra verb
// lessons, and conversation dialogues come from sibling modules and are merged
// into the same exported arrays below, so every consumer keeps one import path.
import * as verbsExtra from './verbs-extra.js';
import * as moreLessons from './more-lessons.js';
import * as grammar from './grammar.js';
import * as vocabulary from './vocabulary.js';
import * as quizBank from './quiz-bank.js';
import * as wordBank from './word-bank.js';
import * as practiceBank from './practice-bank.js';
export { dialogues } from './conversation.js';

const verbLessons = [
  {
    id: 'be-present',
    level: 'شروع',
    titleFa: 'to be در زمان حال: am / is / are',
    shortGoal: 'گفتن اینکه چیزی یا کسی هست، کجاست، یا چه حالتی دارد.',
    explanationFa:
      'فعل to be یعنی «بودن» یا «هستن» و در زمان حال سه شکل دارد: am، is و are. برای I همیشه am می‌آید، برای he, she, it و هر اسم مفرد is، و برای you, we, they و اسم‌های جمع are. در فارسی فعل «است / هستم» را گاهی حذف می‌کنیم، اما در انگلیسی to be هیچ‌وقت حذف نمی‌شود و باید حتماً در جمله باشد. برای منفی کردن کافی است بعد از فعل not بگذاریم (I am not, she is not). برای سؤالی کردن جای فاعل و فعل را عوض می‌کنیم: Are you ready? از to be برای حالت، شغل، مکان و ویژگی‌ها استفاده می‌شود.',
    patterns: [
      { form: 'I am', meaningFa: 'من هستم' },
      { form: 'he / she / it is', meaningFa: 'او / آن هست' },
      { form: 'you / we / they are', meaningFa: 'تو / ما / آنها هستید / هستند' },
    ],
    examples: [
      { en: 'I am tired.', fa: 'من خسته ام.' },
      { en: 'She is a teacher.', fa: 'او معلم است.' },
      { en: 'They are at home.', fa: 'آنها خانه هستند.' },
      { en: 'This book is useful.', fa: 'این کتاب مفید است.' },
    ],
    quizQuestionIds: ['q1', 'q2', 'q3', 'q4', 'q5'],
  },
  {
    id: 'be-past',
    level: 'شروع',
    titleFa: 'گذشته to be: was / were',
    shortGoal: 'گفتن حالت، مکان یا شغل در گذشته.',
    explanationFa:
      'برای حرف زدن دربارهٔ حالت، مکان یا ویژگی در گذشته از شکل گذشتهٔ to be استفاده می‌کنیم: was و were. برای I, he, she, it و اسم مفرد was می‌آید و برای you, we, they و اسم‌های جمع were. این فعل‌ها خودشان فعل اصلی هستند و به فعل کمکی دیگری نیاز ندارند. منفی آن‌ها wasn’t و weren’t است (I was not / weren’t there) و برای سؤال، فعل را اول جمله می‌آوریم: Were you at home? دقت کن که برای you حتی وقتی به یک نفر اشاره داریم باز هم were درست است، نه was.',
    patterns: [
      { form: 'I / he / she / it was', meaningFa: 'من / او بود(م)' },
      { form: 'you / we / they were', meaningFa: 'تو / ما / آنها بودید / بودند' },
      { form: "wasn't / weren't", meaningFa: 'نبود / نبودند' },
    ],
    examples: [
      { en: 'I was busy yesterday.', fa: 'من دیروز مشغول بودم.' },
      { en: 'We were late.', fa: 'ما دیر کرده بودیم.' },
      { en: 'It was cold last night.', fa: 'دیشب سرد بود.' },
      { en: 'You were right.', fa: 'حق با تو بود.' },
    ],
    quizQuestionIds: ['q6', 'q7', 'q8', 'q9', 'q10'],
  },
  {
    id: 'have',
    level: 'شروع',
    titleFa: 'have / has برای داشتن',
    shortGoal: 'گفتن مالکیت، رابطه، بیماری یا تجربه ساده.',
    explanationFa:
      'فعل have یعنی «داشتن». در زمان حال برای I, you, we, they شکل have و برای he, she, it و اسم مفرد شکل has به کار می‌رود. have فقط برای مالکیت نیست؛ برای رابطه‌ها (She has two brothers)، بیماری‌های ساده (He has a cold)، و کارهای روزمره (have breakfast, have a shower) هم استفاده می‌شود. در انگلیسی روزمره برای منفی و سؤال از do و does کمک می‌گیریم و در این حالت خود فعل به have برمی‌گردد: I don’t have time، Does she have a car?',
    patterns: [
      { form: 'I / you / we / they have', meaningFa: 'من / تو / ما / آنها دارم / داری / داریم / دارند' },
      { form: 'he / she / it has', meaningFa: 'او / آن دارد' },
      { form: "don't / doesn't have", meaningFa: 'ندارم / ندارد' },
    ],
    examples: [
      { en: 'I have a question.', fa: 'من یک سوال دارم.' },
      { en: 'He has two sisters.', fa: 'او دو خواهر دارد.' },
      { en: 'We have time.', fa: 'ما وقت داریم.' },
      { en: 'She has a headache.', fa: 'او سردرد دارد.', note: 'برای بیماری های ساده هم have می آید.' },
    ],
    quizQuestionIds: ['q11', 'q12', 'q13', 'q14', 'q15'],
  },
  {
    id: 'present-simple',
    level: 'پایه',
    titleFa: 'حال ساده: I go / she goes',
    shortGoal: 'عادت ها، کارهای تکراری و حقیقت های معمول.',
    explanationFa:
      'حال ساده برای کارهای تکراری، عادت‌ها، برنامه‌های ثابت و حقیقت‌های همیشگی به کار می‌رود. شکل فعل برای بیشتر فاعل‌ها ساده است، اما برای he, she, it به آخر فعل s (یا es / ies) اضافه می‌شود: I work / she works، I study / she studies، I go / he goes. برای منفی و سؤال از do و does کمک می‌گیریم و در این حالت فعل اصلی دیگر s نمی‌گیرد: She doesn’t work، Does he go? کلمه‌هایی مثل always, usually, often, sometimes, every day نشانهٔ حال ساده هستند.',
    patterns: [
      { form: 'I / you / we / they work', meaningFa: 'کار می کنم / می کنی / می کنیم / می کنند' },
      { form: 'he / she / it works', meaningFa: 'او کار می کند' },
      { form: "doesn't / don't work", meaningFa: 'کار نمی کند / نمی کنند' },
    ],
    examples: [
      { en: 'I go to class every day.', fa: 'من هر روز به کلاس می روم.' },
      { en: 'He drinks tea in the morning.', fa: 'او صبح ها چای می نوشد.' },
      { en: 'They live in Shiraz.', fa: 'آنها در شیراز زندگی می کنند.' },
      { en: 'Water boils at 100 degrees.', fa: 'آب در ۱۰۰ درجه می جوشد.' },
    ],
    quizQuestionIds: ['q16', 'q17', 'q18', 'q19', 'q20'],
  },
  {
    id: 'present-continuous',
    level: 'پایه',
    titleFa: 'حال استمراری: I am going',
    shortGoal: 'کاری که الان یا این روزها در حال انجام است.',
    explanationFa:
      'حال استمراری برای کاری است که همین حالا در حال انجام است یا این روزها ادامه دارد. ساختار آن am / is / are به‌علاوهٔ فعل با ing است: I am working، she is reading، they are playing. هنگام اضافه کردن ing گاهی املای فعل کمی تغییر می‌کند: make → making، run → running، sit → sitting. برای منفی، not را بعد از am / is / are می‌گذاریم و برای سؤال جای فاعل و am / is / are را عوض می‌کنیم: Are you coming? کلمه‌هایی مثل now, right now, at the moment, Listen!, Look! نشانهٔ این زمان‌اند.',
    patterns: [
      { form: 'I am working', meaningFa: 'دارم کار می کنم' },
      { form: 'she is studying', meaningFa: 'او دارد درس می خواند' },
      { form: 'they are waiting', meaningFa: 'آنها منتظرند / دارند صبر می کنند' },
    ],
    examples: [
      { en: 'I am reading now.', fa: 'الان دارم می خوانم.' },
      { en: 'She is learning English.', fa: 'او دارد انگلیسی یاد می گیرد.' },
      { en: 'We are waiting for you.', fa: 'ما منتظر تو هستیم.' },
      { en: 'It is raining.', fa: 'باران می بارد.' },
    ],
    quizQuestionIds: ['q21', 'q22', 'q23', 'q24', 'q25'],
  },
  {
    id: 'past-simple',
    level: 'پایه',
    titleFa: 'گذشته ساده: I went',
    shortGoal: 'کاری که در گذشته تمام شده است.',
    explanationFa:
      'گذشتهٔ ساده برای کاری است که در گذشته اتفاق افتاد و تمام شد. فعل‌های باقاعده با اضافه شدن ed ساخته می‌شوند (work → worked، play → played)، اما فعل‌های بی‌قاعده شکل خاص خودشان را دارند و باید حفظ شوند (go → went، see → saw، buy → bought، have → had). نکتهٔ مهم: برای منفی و سؤال از did کمک می‌گیریم و فعل اصلی به شکل ساده برمی‌گردد: I didn’t go (نه didn’t went)، Did you see it? کلمه‌هایی مثل yesterday, last night, two days ago, in 2010 نشانهٔ گذشته‌اند.',
    patterns: [
      { form: 'I worked', meaningFa: 'من کار کردم' },
      { form: 'I went', meaningFa: 'من رفتم' },
      { form: "I didn't go", meaningFa: 'من نرفتم' },
    ],
    examples: [
      { en: 'I watched a movie last night.', fa: 'دیشب فیلم دیدم.' },
      { en: 'He went home early.', fa: 'او زود به خانه رفت.' },
      { en: 'They visited us yesterday.', fa: 'آنها دیروز به ما سر زدند.' },
      { en: 'She bought a new phone.', fa: 'او یک گوشی جدید خرید.' },
    ],
    quizQuestionIds: ['q26', 'q27', 'q28', 'q29', 'q30'],
  },
  {
    id: 'past-continuous',
    level: 'میانی',
    titleFa: 'گذشته استمراری: I was going',
    shortGoal: 'کاری که در یک لحظه از گذشته در جریان بوده.',
    explanationFa:
      'گذشتهٔ استمراری برای کاری است که در یک لحظهٔ مشخص از گذشته در جریان بوده است. ساختار آن was / were به‌علاوهٔ فعل با ing است: I was cooking، they were studying. این زمان اغلب با گذشتهٔ ساده می‌آید تا نشان دهد کاری در حال انجام بود که کار دیگری وسط آن اتفاق افتاد: I was sleeping when the phone rang (داشتم می‌خوابیدم که تلفن زنگ زد). برای I, he, she, it از was و برای you, we, they از were استفاده می‌کنیم.',
    patterns: [
      { form: 'I / he / she was working', meaningFa: 'داشتم / داشت کار می کرد' },
      { form: 'you / we / they were playing', meaningFa: 'داشتید / داشتند بازی می کردند' },
      { form: 'was ... when ...', meaningFa: 'داشتم ... که ...' },
    ],
    examples: [
      { en: 'I was cooking when you called.', fa: 'وقتی زنگ زدی داشتم آشپزی می کردم.' },
      { en: 'They were studying at 8.', fa: 'آنها ساعت ۸ داشتند درس می خواندند.' },
      { en: 'He was driving home.', fa: 'او داشت به خانه رانندگی می کرد.' },
      { en: 'We were talking about you.', fa: 'داشتیم درباره تو حرف می زدیم.' },
    ],
    quizQuestionIds: ['q31', 'q32', 'q33', 'q34', 'q35'],
  },
  {
    id: 'present-perfect',
    level: 'میانی',
    titleFa: 'حال کامل: have gone / have been',
    shortGoal: 'تجربه یا نتیجه ای که به الان وصل است.',
    explanationFa:
      'حال کامل دربارهٔ کاری در گذشته است که نتیجه یا ارتباطش با همین حالا اهمیت دارد، یا زمان دقیقش مهم نیست. ساختار آن have / has به‌علاوهٔ قسمت سوم فعل (past participle) است: I have seen، she has gone، we have been. از این زمان برای تجربه‌ها (I have been to Spain)، کارهای تازه‌تمام‌شده (I have just finished) و کارهایی که از گذشته تا حالا ادامه دارند استفاده می‌کنیم. کلمه‌هایی مثل ever, never, already, yet, just, for, since با این زمان می‌آیند. نکتهٔ کلیدی: اگر زمان دقیق گذشته را بگوییم (مثل yesterday) باید از گذشتهٔ ساده استفاده کنیم، نه حال کامل.',
    patterns: [
      { form: 'I / we have seen', meaningFa: 'دیده ام / دیده ایم' },
      { form: 'he / she has gone', meaningFa: 'او رفته است' },
      { form: 'have / has been', meaningFa: 'بوده ام / بوده است' },
    ],
    examples: [
      { en: 'I have seen this movie.', fa: 'این فیلم را دیده ام.' },
      { en: 'She has gone to work.', fa: 'او سر کار رفته است.' },
      { en: 'We have been here before.', fa: 'ما قبلا اینجا بوده ایم.' },
      { en: 'He has lost his key.', fa: 'او کلیدش را گم کرده است.' },
    ],
    quizQuestionIds: ['q36', 'q37', 'q38', 'q39', 'q40'],
  },
  {
    id: 'future-going-to',
    level: 'میانی',
    titleFa: 'آینده با going to',
    shortGoal: 'برنامه یا تصمیمی که از قبل مشخص است.',
    explanationFa:
      'برای حرف زدن دربارهٔ برنامه‌ها و تصمیم‌هایی که از قبل گرفته‌ایم، یا پیش‌بینی بر اساس نشانه‌های موجود، از ساختار am / is / are going to به‌علاوهٔ فعل ساده استفاده می‌کنیم: I am going to study tonight، Look at the clouds, it is going to rain. تفاوت آن با will این است که going to برنامهٔ قبلی یا نشانهٔ روشن دارد، در حالی که will بیشتر برای تصمیم لحظه‌ای یا حدس به کار می‌رود. به یاد داشته باش که بعد از going to همیشه فعل به شکل ساده می‌آید و قسمت be (am / is / are) باید با فاعل بخواند.',
    patterns: [
      { form: 'I am going to study', meaningFa: 'قرار است درس بخوانم' },
      { form: 'she is going to call', meaningFa: 'قرار است تماس بگیرد' },
      { form: 'they are going to travel', meaningFa: 'قرار است سفر کنند' },
    ],
    examples: [
      { en: 'I am going to start tomorrow.', fa: 'قرار است فردا شروع کنم.' },
      { en: 'We are going to visit my uncle.', fa: 'قرار است به دیدن عمویم برویم.' },
      { en: 'She is going to buy a laptop.', fa: 'او قرار است لپ تاپ بخرد.' },
      { en: 'It is going to rain.', fa: 'احتمالا باران می بارد / قرار است باران ببارد.' },
    ],
    quizQuestionIds: ['q41', 'q42', 'q43', 'q44', 'q45'],
  },
  {
    id: 'modals',
    level: 'میانی',
    titleFa: 'فعل های کمکی: can / should / must',
    shortGoal: 'توانایی، پیشنهاد، اجبار و قانون.',
    explanationFa:
      'فعل‌های کمکی (modals) مثل can, should و must حالت یا نظر گوینده را نشان می‌دهند. can برای توانایی و اجازه (I can swim)، should برای توصیه و پیشنهاد (You should rest)، و must برای اجبار و ضرورت قوی یا قانون (We must go) به کار می‌رود. سه قانون مهم را به یاد بسپار: ۱) بعد از این فعل‌ها همیشه فعل ساده می‌آید (can go، نه can goes و نه can to go). ۲) برای he, she, it هم s نمی‌گیرند (she can، نه she cans). ۳) برای منفی فقط not اضافه می‌کنیم: can’t (cannot)، shouldn’t، mustn’t.',
    patterns: [
      { form: 'I can swim', meaningFa: 'می توانم شنا کنم' },
      { form: 'you should rest', meaningFa: 'بهتر است استراحت کنی' },
      { form: 'we must leave', meaningFa: 'باید برویم' },
    ],
    examples: [
      { en: 'I can help you.', fa: 'می توانم کمکت کنم.' },
      { en: 'You should drink water.', fa: 'بهتر است آب بخوری.' },
      { en: 'We must be quiet.', fa: 'باید ساکت باشیم.' },
      { en: 'She can speak English.', fa: 'او می تواند انگلیسی صحبت کند.' },
    ],
    quizQuestionIds: ['q46', 'q47', 'q48', 'q49', 'q50'],
  },
  {
    id: 'phrasal-verbs',
    level: 'پیشرفته سبک',
    titleFa: 'شروع فعل های عبارتی',
    shortGoal: 'فعل هایی مثل get up و look for که معنی جداگانه دارند.',
    explanationFa:
      'فعل‌های عبارتی (phrasal verbs) از یک فعل به‌علاوهٔ یک کلمهٔ کوچک (مثل up, on, off, for) ساخته می‌شوند و معنی تازه‌ای می‌سازند که گاهی با معنی خودِ فعل فرق دارد. مثلاً look یعنی نگاه کردن، اما look for یعنی دنبال چیزی گشتن؛ get یعنی گرفتن، اما get up یعنی بیدار شدن. چون معنی‌شان همیشه قابل حدس نیست، بهترین راه یاد گرفتن آن‌ها حفظ کردن همراه با یک مثال واقعی است. چند نمونهٔ پرکاربرد: get up، look for، turn on، turn off، give up، pick up.',
    patterns: [
      { form: 'get up', meaningFa: 'بلند شدن از خواب / جا' },
      { form: 'look for', meaningFa: 'دنبال چیزی گشتن' },
      { form: 'turn on / off', meaningFa: 'روشن / خاموش کردن' },
    ],
    examples: [
      { en: 'I get up at 7.', fa: 'من ساعت ۷ بیدار می شوم.' },
      { en: 'She is looking for her bag.', fa: 'او دنبال کیفش می گردد.' },
      { en: 'Please turn on the light.', fa: 'لطفا چراغ را روشن کن.' },
      { en: 'He gave up too early.', fa: 'او خیلی زود تسلیم شد.' },
    ],
    quizQuestionIds: ['q51', 'q52', 'q53', 'q54', 'q55'],
  },
  {
    id: 'mixed-review',
    level: 'مرور',
    titleFa: 'مرور ترکیبی فعل ها',
    shortGoal: 'انتخاب شکل درست فعل در جمله های مختلف.',
    explanationFa:
      'در این بخش چند زمان را کنار هم مرور می‌کنیم تا یاد بگیری در هر جمله کدام شکل فعل درست است. برای انتخاب زمان درست به سه چیز نگاه کن: ۱) قید زمان جمله (every day → حال ساده، now / Listen! → حال استمراری، yesterday / ago → گذشتهٔ ساده، already / just / since → حال کامل). ۲) فاعل جمله (he / she / it در حال ساده s می‌گیرد، و was / were و am / is / are باید با فاعل بخوانند). ۳) معنی کلی جمله. با کمی تمرین، انتخاب زمان درست برایت به یک عادت تبدیل می‌شود.',
    patterns: [
      { form: 'I go / I am going / I went', meaningFa: 'می روم / دارم می روم / رفتم' },
      { form: 'she has / she had / she has been', meaningFa: 'دارد / داشت / بوده است' },
      { form: 'we can go / we are going to go', meaningFa: 'می توانیم برویم / قرار است برویم' },
    ],
    examples: [
      { en: 'I go to work by bus.', fa: 'من با اتوبوس سر کار می روم.' },
      { en: 'I am going to work now.', fa: 'الان دارم سر کار می روم.' },
      { en: 'I went to work late yesterday.', fa: 'دیروز دیر سر کار رفتم.' },
      { en: 'I have been busy this week.', fa: 'این هفته مشغول بوده ام.' },
    ],
    quizQuestionIds: ['q56', 'q57', 'q58', 'q59', 'q60'],
  },
];

// Quiz questions are intentionally DIFFERENT from the lesson examples above,
// so practice tests recall rather than recognition of memorised sentences.
const verbQuizzes = [
  ['q1', 'to be', 'We ___ students.', ['am', 'is', 'are'], 2, 'برای we از are استفاده می کنیم.'],
  ['q2', 'to be', 'My brother ___ a doctor.', ['am', 'is', 'are'], 1, 'brother مفرد است، پس is می آید.'],
  ['q3', 'to be', 'کدام جمله درست است؟', ['I is happy.', 'I am happy.', 'I are happy.'], 1, 'برای I فقط am درست است.'],
  ['q4', 'to be', 'The keys ___ on the table.', ['is', 'am', 'are'], 2, 'keys جمع است، پس are می آید.'],
  ['q5', 'to be', 'منفیِ «this is correct» کدام است؟', ['this not is correct', 'this is not correct', 'this am not correct'], 1, 'not بعد از is می آید.'],
  ['q6', 'was/were', 'They ___ at the party.', ['was', 'were', 'are'], 1, 'برای they در گذشته were می آید.'],
  ['q7', 'was/were', 'My father ___ a teacher in 2005.', ['was', 'were', 'is'], 0, 'father مفرد است، پس was.'],
  ['q8', 'was/were', 'I ___ at home last night.', ['were', 'was', 'am'], 1, 'برای I در گذشته was می آید.'],
  ['q9', 'was/were', 'سؤال درست کدام است؟', ['Was you ready?', 'Were you ready?', 'You were ready?'], 1, 'برای you همیشه were، حتی برای یک نفر.'],
  ['q10', 'was/were', 'The shops ___ closed.', ['was', 'were', 'is'], 1, 'shops جمع است، پس were.'],
  ['q11', 'have/has', 'My friends ___ a new car.', ['has', 'have', 'is'], 1, 'friends جمع است، پس have.'],
  ['q12', 'have/has', 'It ___ four legs.', ['have', 'has', 'are'], 1, 'برای it از has استفاده می کنیم.'],
  ['q13', 'have/has', 'منفیِ روزمرهٔ «I have time»:', ["I don't have time", "I haven't time", 'I not have time'], 0, 'با don’t have ساخته می شود.'],
  ['q14', 'have/has', 'Does she ___ a car?', ['has', 'have', 'having'], 1, 'بعد از does فعل به have برمی گردد.'],
  ['q15', 'have/has', 'You ___ a nice smile.', ['has', 'have', 'is'], 1, 'برای you از have استفاده می کنیم.'],
  ['q16', 'present simple', 'My sister ___ in a bank.', ['work', 'works', 'working'], 1, 'sister مفرد است، پس works.'],
  ['q17', 'present simple', 'We ___ football on Fridays.', ['plays', 'play', 'playing'], 1, 'برای we فعل ساده می آید.'],
  ['q18', 'present simple', 'The sun ___ in the east.', ['rise', 'rises', 'rising'], 1, 'حقیقت همیشگی و sun مفرد، پس rises.'],
  ['q19', 'present simple', 'منفیِ «She likes tea»:', ["She doesn't like tea.", "She doesn't likes tea.", "She don't like tea."], 0, 'بعد از doesn’t فعل ساده و بدون s می آید.'],
  ['q20', 'present simple', '___ he speak English?', ['Do', 'Does', 'Is'], 1, 'برای he در سؤالِ حال ساده از Does استفاده می کنیم.'],
  ['q21', 'present continuous', 'Listen! The baby ___ .', ['cries', 'cry', 'is crying'], 2, 'Listen نشانهٔ همین حالاست، پس is crying.'],
  ['q22', 'present continuous', 'They ___ dinner right now.', ['cook', 'are cooking', 'cooks'], 1, 'right now نشانهٔ حال استمراری است.'],
  ['q23', 'present continuous', 'I ___ TV at the moment.', ['watch', 'am watching', 'watches'], 1, 'at the moment یعنی همین حالا.'],
  ['q24', 'present continuous', 'املای درستِ sit با ing کدام است؟', ['siting', 'sitting', 'siteing'], 1, 'حرف t دوبار می شود: sitting.'],
  ['q25', 'present continuous', 'منفیِ «He is sleeping»:', ["He isn't sleeping.", 'He not sleeping.', "He doesn't sleeping."], 0, 'not بعد از is می آید.'],
  ['q26', 'past simple', 'We ___ a great time at the party.', ['have', 'had', 'has'], 1, 'گذشتهٔ have می شود had.'],
  ['q27', 'past simple', 'گذشتهٔ see کدام است؟', ['seed', 'saw', 'seen'], 1, 'گذشتهٔ سادهٔ see می شود saw.'],
  ['q28', 'past simple', 'منفیِ «I went out»:', ["I didn't go out.", "I didn't went out.", 'I not went out.'], 0, 'بعد از didn’t فعل ساده می آید.'],
  ['q29', 'past simple', 'They ___ a new house last year.', ['buy', 'bought', 'buyed'], 1, 'گذشتهٔ buy می شود bought.'],
  ['q30', 'past simple', '___ you call me?', ['Did', 'Do', 'Was'], 0, 'برای سؤالِ گذشتهٔ ساده از Did استفاده می کنیم.'],
  ['q31', 'past continuous', 'While I ___ , it started to rain.', ['walk', 'was walking', 'walked'], 1, 'کاری که در جریان بود، پس was walking.'],
  ['q32', 'past continuous', 'The children ___ in the garden at noon.', ['was playing', 'were playing', 'play'], 1, 'children جمع است، پس were playing.'],
  ['q33', 'past continuous', 'She ___ a book when I saw her.', ['was reading', 'were reading', 'reads'], 0, 'برای she از was استفاده می کنیم.'],
  ['q34', 'past continuous', 'I ___ TV when the lights went off.', ['watched', 'was watching', 'watch'], 1, 'کاری در جریان بود که اتفاق دیگری افتاد.'],
  ['q35', 'past continuous', 'You ___ shouting.', ['was', 'were', 'is'], 1, 'برای you همیشه were.'],
  ['q36', 'present perfect', 'I ___ never been to Paris.', ['has', 'have', 'was'], 1, 'برای I از have استفاده می کنیم.'],
  ['q37', 'present perfect', 'She ___ just finished her work.', ['have', 'has', 'is'], 1, 'برای she از has استفاده می کنیم.'],
  ['q38', 'present perfect', 'قسمت سومِ write کدام است؟', ['wrote', 'written', 'writed'], 1, 'past participle فعل write می شود written.'],
  ['q39', 'present perfect', 'We have lived here ___ 2010.', ['for', 'since', 'from'], 1, 'برای نقطهٔ شروع زمان از since استفاده می کنیم.'],
  ['q40', 'present perfect', 'کدام جمله درست است؟', ['I have seen him yesterday.', 'I saw him yesterday.', 'I seen him yesterday.'], 1, 'yesterday با گذشتهٔ ساده می آید، نه حال کامل.'],
  ['q41', 'going to', 'They ___ going to watch a film tonight.', ['is', 'am', 'are'], 2, 'برای they از are استفاده می کنیم.'],
  ['q42', 'going to', 'The sky is dark. It ___ to snow.', ['is going', 'going', 'are going'], 0, 'پیش بینی با it is going to.'],
  ['q43', 'going to', 'I am going to ___ a new phone.', ['get', 'gets', 'got'], 0, 'بعد از going to فعل ساده می آید.'],
  ['q44', 'going to', 'منفیِ «She is going to come»:', ["She isn't going to come.", "She doesn't going to come.", 'She not going to come.'], 0, 'not بعد از is می آید.'],
  ['q45', 'going to', 'He ___ going to call you later.', ['is', 'are', 'am'], 0, 'برای he از is استفاده می کنیم.'],
  ['q46', 'modals', 'You look tired. You ___ go to bed.', ['should', 'can', 'must'], 0, 'برای توصیه از should استفاده می کنیم.'],
  ['q47', 'modals', 'Birds ___ fly.', ['cans', 'can', 'can to'], 1, 'can هیچ وقت s یا to نمی گیرد.'],
  ['q48', 'modals', 'It is a rule. You ___ wear a seatbelt.', ['should', 'must', 'can'], 1, 'برای قانون و اجبار از must استفاده می کنیم.'],
  ['q49', 'modals', 'کدام جمله درست است؟', ['She can drives.', 'She can drive.', 'She cans drive.'], 1, 'بعد از can فعل ساده و بدون s می آید.'],
  ['q50', 'modals', 'منفیِ «We must shout» (نباید):', ["We mustn't shout.", "We don't must shout.", 'We must not shouts.'], 0, 'منفیِ must می شود mustn’t.'],
  ['q51', 'phrasal verbs', 'turn off یعنی چه؟', ['روشن کردن', 'خاموش کردن', 'بالا بردن'], 1, 'turn off یعنی خاموش کردن.'],
  ['q52', 'phrasal verbs', 'I need to ___ my friend at the airport. (سوار کردن)', ['pick up', 'give up', 'look for'], 0, 'pick up اینجا یعنی سوار کردن کسی.'],
  ['q53', 'phrasal verbs', 'pick up یعنی:', ['زمین گذاشتن', 'برداشتن / سوار کردن', 'گشتن'], 1, 'pick up یعنی برداشتن یا سوار کردن.'],
  ['q54', 'phrasal verbs', 'Can you ___ the music? It is too loud.', ['turn on', 'turn off', 'get up'], 1, 'صدای بلند را turn off (خاموش) می کنیم.'],
  ['q55', 'phrasal verbs', 'give up یعنی:', ['ادامه دادن', 'تسلیم شدن / رها کردن', 'بلند شدن'], 1, 'give up یعنی تسلیم شدن یا رها کردن.'],
  ['q56', 'mixed review', 'She usually ___ at 6, but today she is sleeping late.', ['wakes up', 'is waking up', 'woke up'], 0, 'usually نشانهٔ حال ساده است.'],
  ['q57', 'mixed review', 'Be quiet! The baby ___ .', ['sleeps', 'is sleeping', 'slept'], 1, 'همین حالا در جریان است، پس حال استمراری.'],
  ['q58', 'mixed review', 'I ___ my homework two hours ago.', ['finish', 'finished', 'have finished'], 1, 'ago نشانهٔ گذشتهٔ ساده است.'],
  ['q59', 'mixed review', "I can't find my phone. I ___ it.", ['lose', 'lost', 'have lost'], 2, 'نتیجه تا الان ادامه دارد، پس حال کامل.'],
  ['q60', 'mixed review', 'Look! They ___ to leave now.', ['are going', 'go', 'went'], 0, 'Look و now نشانهٔ going to / حال استمراری است.'],
].map(([id, topic, promptFa, choices, correct, explanationFa]) => ({
  id,
  topic,
  promptFa,
  choices,
  correct,
  explanationFa,
}));

// Flashcards have an explicit mode so the prompt is never ambiguous:
//   'type'   -> learner types one English word into the blank (graded automatically)
//   'recall' -> learner thinks of the meaning, flips, and self-grades
const cardSeeds = [
  // [id, topic, mode, promptFa, promptEn, answer, answerFa, hintFa, exampleEn, exampleFa]
  ['c1', 'to be', 'type', 'جای خالی را با شکل درست to be پر کن:', 'I ___ ready.', 'am', 'am', 'برای I همیشه am می آید.', 'I am ready.', 'من آماده ام.'],
  ['c2', 'to be', 'type', 'شکل درست to be را بنویس:', 'They ___ here.', 'are', 'are', 'برای they از are استفاده می کنیم.', 'They are here.', 'آنها اینجا هستند.'],
  ['c3', 'to be', 'recall', 'معنی این جمله چیست؟', 'She is kind.', null, 'او مهربان است.', 'is برای حالت و ویژگی هم می آید.', 'She is kind.', 'او مهربان است.'],
  ['c4', 'was/were', 'type', 'شکل گذشتهٔ to be را بنویس:', 'I ___ tired yesterday.', 'was', 'was', 'برای I در گذشته was می آید.', 'I was tired yesterday.', 'دیروز خسته بودم.'],
  ['c5', 'was/were', 'type', 'شکل گذشتهٔ to be را بنویس:', 'We ___ happy.', 'were', 'were', 'برای we از were استفاده می کنیم.', 'We were happy.', 'ما خوشحال بودیم.'],
  ['c6', 'have/has', 'type', 'شکل درست have را بنویس:', 'She ___ a plan.', 'has', 'has', 'برای she از has استفاده می کنیم.', 'She has a plan.', 'او برنامه دارد.'],
  ['c7', 'have/has', 'recall', 'معنی این جمله چیست؟', 'I have a cold.', null, 'سرما خورده ام.', 'have برای بعضی بیماری ها هم استفاده می شود.', 'I have a cold.', 'سرما خورده ام.'],
  ['c8', 'present simple', 'type', 'فعل را به شکل درستِ حال ساده بنویس (drink):', 'I ___ coffee every morning.', 'drink', 'drink', 'برای I فعل ساده می آید.', 'I drink coffee every morning.', 'هر صبح قهوه می نوشم.'],
  ['c9', 'present simple', 'type', 'فعل را برای he درست کن (run):', 'He ___ fast.', 'runs', 'runs', 'برای he فعل s می گیرد.', 'He runs fast.', 'او سریع می دود.'],
  ['c10', 'present simple', 'recall', 'معنی usually چیست؟', 'I usually walk to work.', null, 'معمولاً', 'usually معمولا با حال ساده می آید.', 'I usually walk to work.', 'من معمولا پیاده سر کار می روم.'],
  ['c11', 'present continuous', 'type', 'فعل را به شکل ing بنویس (work):', 'I am ___ now.', 'working', 'working', 'am / is / are + فعل ing.', 'I am working now.', 'الان دارم کار می کنم.'],
  ['c12', 'present continuous', 'type', 'شکل درست to be را بنویس:', 'She ___ cooking.', 'is', 'is', 'برای she از is استفاده می کنیم.', 'She is cooking.', 'او دارد آشپزی می کند.'],
  ['c13', 'present continuous', 'recall', 'معنی این جمله چیست؟', 'They are waiting outside.', null, 'آنها بیرون منتظرند.', 'are waiting یعنی در حال انتظار هستند.', 'They are waiting outside.', 'آنها بیرون منتظرند.'],
  ['c14', 'past simple', 'type', 'گذشتهٔ go را بنویس:', 'I ___ home.', 'went', 'went', 'go فعل بی قاعده است: went.', 'I went home.', 'من به خانه رفتم.'],
  ['c15', 'past simple', 'type', 'گذشتهٔ buy را بنویس:', 'She ___ a book.', 'bought', 'bought', 'buy در گذشته می شود bought.', 'She bought a book.', 'او کتاب خرید.'],
  ['c16', 'past simple', 'recall', 'yesterday نشانهٔ کدام زمان است؟', 'I called him yesterday.', null, 'گذشتهٔ ساده', 'yesterday همیشه با گذشتهٔ ساده می آید.', 'I called him yesterday.', 'دیروز به او زنگ زدم.'],
  ['c17', 'past continuous', 'type', 'شکل گذشتهٔ to be را بنویس (was / were):', 'I ___ studying at 9.', 'was', 'was', 'برای I از was استفاده می کنیم.', 'I was studying at 9.', 'ساعت ۹ داشتم درس می خواندم.'],
  ['c18', 'past continuous', 'type', 'شکل گذشتهٔ to be را بنویس:', 'I ___ sleeping when you called.', 'was', 'was', 'برای I از was استفاده می کنیم.', 'I was sleeping when you called.', 'وقتی زنگ زدی خواب بودم.'],
  ['c19', 'past continuous', 'type', 'شکل گذشتهٔ to be را بنویس:', 'They ___ playing.', 'were', 'were', 'برای they از were استفاده می کنیم.', 'They were playing.', 'آنها داشتند بازی می کردند.'],
  ['c20', 'present perfect', 'type', 'قسمت سومِ فعل را بنویس (finish):', 'I have ___ my work.', 'finished', 'finished', 'have + قسمت سوم فعل.', 'I have finished my work.', 'کارم را تمام کرده ام.'],
  ['c21', 'present perfect', 'recall', 'been در این جمله یعنی چه؟', 'I have been there.', null, 'بوده ام', 'been قسمت سوم be است.', 'I have been there.', 'آنجا بوده ام.'],
  ['c22', 'present perfect', 'recall', 'gone یعنی چه؟', 'She has gone home.', null, 'رفته است', 'gone قسمت سوم go است.', 'She has gone home.', 'او به خانه رفته است.'],
  ['c23', 'going to', 'recall', 'ساختار going to برای چیست؟', 'I am going to study.', null, 'برنامه یا تصمیمِ از پیش گرفته شده', 'going to + فعل ساده برای برنامه ها.', 'I am going to study.', 'قرار است درس بخوانم.'],
  ['c24', 'going to', 'type', 'شکل درست to be را بنویس:', 'It ___ going to rain.', 'is', 'is', 'برای it از is استفاده می کنیم.', 'It is going to rain.', 'قرار است باران ببارد.'],
  ['c25', 'going to', 'type', 'شکل درست to be را بنویس:', 'We ___ going to travel.', 'are', 'are', 'برای we از are استفاده می کنیم.', 'We are going to travel.', 'قرار است سفر کنیم.'],
  ['c26', 'modals', 'recall', 'بعد از can فعل چه شکلی دارد؟', 'She can speak English.', null, 'فعل ساده (بدون s و بدون to)', 'can speak، نه can speaks.', 'She can speak English.', 'او می تواند انگلیسی صحبت کند.'],
  ['c27', 'modals', 'recall', 'should چه حسی دارد؟', 'You should rest.', null, 'توصیه و پیشنهاد (بهتر است)', 'should برای نصیحت و پیشنهاد است.', 'You should rest.', 'بهتر است استراحت کنی.'],
  ['c28', 'modals', 'recall', 'must چه حسی دارد؟', 'We must leave now.', null, 'اجبار و ضرورت (باید)', 'must قوی تر از should است.', 'We must leave now.', 'باید الان برویم.'],
  ['c29', 'phrasal verbs', 'recall', 'get up یعنی چه؟', 'I get up at 7.', null, 'بیدار شدن / از جا بلند شدن', 'با مثال حفظش کن.', 'I get up at 7.', 'ساعت ۷ بیدار می شوم.'],
  ['c30', 'phrasal verbs', 'recall', 'look for یعنی چه؟', 'I am looking for my keys.', null, 'دنبال چیزی گشتن', 'look for با look تنها فرق دارد.', 'I am looking for my keys.', 'دنبال کلیدهایم می گردم.'],
  ['c31', 'phrasal verbs', 'recall', 'turn on یعنی چه؟', 'Turn on the TV.', null, 'روشن کردن (دستگاه یا چراغ)', 'برعکسش turn off است.', 'Turn on the TV.', 'تلویزیون را روشن کن.'],
  ['c32', 'mixed review', 'recall', 'every day معمولاً کدام زمان را می خواهد؟', 'I walk every day.', null, 'حال ساده', 'برای عادت از حال ساده استفاده می کنیم.', 'I walk every day.', 'هر روز پیاده روی می کنم.'],
  ['c33', 'mixed review', 'recall', 'now معمولاً کدام زمان را می خواهد؟', 'I am walking now.', null, 'حال استمراری', 'برای الان از am / is / are + ing استفاده می کنیم.', 'I am walking now.', 'الان دارم راه می روم.'],
  ['c34', 'mixed review', 'recall', 'last night کدام زمان را می خواهد؟', 'I studied last night.', null, 'گذشتهٔ ساده', 'برای زمان تمام شده در گذشته.', 'I studied last night.', 'دیشب درس خواندم.'],
  ['c35', 'mixed review', 'recall', 'have been یعنی چه؟', 'I have been busy this week.', null, 'بوده ام (گذشته ای که به الان وصل است)', 'حال کامل با have been.', 'I have been busy this week.', 'این هفته مشغول بوده ام.'],
  ['c36', 'verbs', 'recall', 'اصطلاحِ make a mistake یعنی چه؟', 'I made a mistake.', null, 'اشتباه کردن', 'make + mistake یک ترکیب ثابت است.', 'I made a mistake.', 'اشتباه کردم.'],
  ['c37', 'verbs', 'recall', 'take a bus یعنی چه؟', 'I take the bus to work.', null, 'سوار اتوبوس شدن', 'take با وسایل نقلیه یعنی سوار شدن.', 'I take the bus to work.', 'با اتوبوس سر کار می روم.'],
  ['c38', 'verbs', 'recall', 'get better یعنی چه؟', 'I am getting better.', null, 'بهتر شدن', 'get + صفت یعنی «شدن».', 'I am getting better.', 'دارم بهتر می شوم.'],
  ['c39', 'verbs', 'recall', 'چرا homework با do می آید نه make؟', 'I do my homework every night.', null, 'انجام دادن (do homework درست است)', 'homework همیشه با do می آید.', 'I do my homework every night.', 'هر شب تکالیفم را انجام می دهم.'],
  ['c40', 'verbs', 'recall', 'say و tell چه فرقی دارند؟', 'Please tell me the truth.', null, 'tell معمولاً به یک شخص گفته می شود، say نه', 'tell me، اما say something.', 'Please tell me the truth.', 'لطفا حقیقت را به من بگو.'],
];

const verbFlashcards = cardSeeds.map(
  ([id, topic, mode, promptFa, promptEn, answer, answerFa, hintFa, exampleEn, exampleFa]) => ({
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
  }),
);

// Sentence-building exercise: learner taps the words to rebuild the sentence.
const verbSentenceBuilders = [
  ['sb1', 'to be', ['She', 'is', 'a', 'good', 'teacher'], 'او معلم خوبی است.'],
  ['sb2', 'was/were', ['We', 'were', 'at', 'the', 'park'], 'ما در پارک بودیم.'],
  ['sb3', 'have/has', ['He', 'has', 'a', 'new', 'bike'], 'او یک دوچرخهٔ نو دارد.'],
  ['sb4', 'present simple', ['I', 'drink', 'coffee', 'every', 'morning'], 'هر صبح قهوه می نوشم.'],
  ['sb5', 'present continuous', ['They', 'are', 'playing', 'football', 'now'], 'آنها الان فوتبال بازی می کنند.'],
  ['sb6', 'past simple', ['She', 'bought', 'a', 'new', 'dress'], 'او یک لباس نو خرید.'],
  ['sb7', 'past continuous', ['I', 'was', 'reading', 'a', 'book'], 'داشتم کتاب می خواندم.'],
  ['sb8', 'present perfect', ['I', 'have', 'finished', 'my', 'homework'], 'تکالیفم را تمام کرده ام.'],
  ['sb9', 'going to', ['We', 'are', 'going', 'to', 'travel'], 'قرار است سفر کنیم.'],
  ['sb10', 'modals', ['You', 'should', 'drink', 'more', 'water'], 'بهتر است آب بیشتری بخوری.'],
  ['sb11', 'phrasal verbs', ['Please', 'turn', 'off', 'the', 'light'], 'لطفا چراغ را خاموش کن.'],
  ['sb12', 'mixed review', ['He', 'goes', 'to', 'school', 'by', 'bus'], 'او با اتوبوس به مدرسه می رود.'],
].map(([id, topic, tokens, fa]) => ({ id, topic, tokens, answer: tokens.join(' '), fa }));

// Listening dictation: TTS reads the sentence, learner types what they hear.
const verbDictations = [
  ['d1', 'to be', 'I am happy today.', 'امروز خوشحالم.'],
  ['d2', 'to be', 'She is my best friend.', 'او بهترین دوست من است.'],
  ['d3', 'was/were', 'We were very tired.', 'ما خیلی خسته بودیم.'],
  ['d4', 'have/has', 'He has two cats.', 'او دو گربه دارد.'],
  ['d5', 'present simple', 'I go to work by bus.', 'با اتوبوس سر کار می روم.'],
  ['d6', 'present continuous', 'They are watching a movie.', 'آنها دارند فیلم می بینند.'],
  ['d7', 'past simple', 'I bought some bread.', 'مقداری نان خریدم.'],
  ['d8', 'past continuous', 'She was cooking dinner.', 'او داشت شام می پخت.'],
  ['d9', 'present perfect', 'I have seen this film.', 'این فیلم را دیده ام.'],
  ['d10', 'going to', 'It is going to rain.', 'قرار است باران ببارد.'],
  ['d11', 'modals', 'You should rest now.', 'بهتر است حالا استراحت کنی.'],
  ['d12', 'phrasal verbs', 'Please turn on the light.', 'لطفا چراغ را روشن کن.'],
].map(([id, topic, en, fa]) => ({ id, topic, en, fa }));

// ---- Merge every module into the shared exported collections ---------------
// The verbs core has no explicit category, so tag it here; sibling modules
// already carry their own `category` on each lesson.

export const lessons = [
  ...verbLessons.map((lesson) => ({ category: 'verbs', ...lesson })),
  ...verbsExtra.lessons,
  ...moreLessons.lessons,
  ...grammar.lessons,
  ...vocabulary.lessons,
];

export const quizzes = [
  ...verbQuizzes,
  ...verbsExtra.quizzes,
  ...moreLessons.quizzes,
  ...grammar.quizzes,
  ...vocabulary.quizzes,
  ...quizBank.quizzes,
];

export const flashcards = [
  ...verbFlashcards,
  ...verbsExtra.flashcards,
  ...moreLessons.flashcards,
  ...grammar.flashcards,
  ...vocabulary.flashcards,
  ...wordBank.flashcards,
];

export const sentenceBuilders = [
  ...verbSentenceBuilders,
  ...verbsExtra.sentenceBuilders,
  ...moreLessons.sentenceBuilders,
  ...grammar.sentenceBuilders,
  ...vocabulary.sentenceBuilders,
  ...practiceBank.sentenceBuilders,
];

export const dictations = [
  ...verbDictations,
  ...verbsExtra.dictations,
  ...moreLessons.dictations,
  ...grammar.dictations,
  ...vocabulary.dictations,
  ...practiceBank.dictations,
];

// Ordered category metadata for grouping lessons in the UI.
export const lessonCategories = [
  { id: 'verbs', label: 'افعال', emoji: '🟣' },
  { id: 'grammar', label: 'گرامر', emoji: '🟢' },
  { id: 'vocabulary', label: 'واژگان', emoji: '🟠' },
];
