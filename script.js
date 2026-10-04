const STORAGE_KEY = "islamicQuizAppState";

const quizBank = [
  {
    id: 1,
    title: "Quran Basics",
    category: "Quran",
    difficulty: "Beginner",
    description: "Test your understanding of foundational Quranic knowledge.",
    questions: [
      {
        question: "Which Surah is known as the Heart of the Quran?",
        type: "multiple",
        options: ["Al-Fatihah", "Al-Ikhlas", "Ya-Sin", "Al-Mulk"],
        answer: "C",
        explanation: "Surah Ya-Sin is often called the Heart of the Quran in Islamic tradition."
      },
      {
        question: "The Quran was revealed over a period of approximately 23 years.",
        type: "truefalse",
        options: ["True", "False"],
        answer: "A",
        explanation: "The Quran was sent down gradually over about 23 years."
      },
      {
        question: "How many Surahs are in the Quran?",
        type: "multiple",
        options: ["100", "114", "124", "144"],
        answer: "B",
        explanation: "The Quran contains 114 Surahs."
      }
    ]
  },
  {
    id: 2,
    title: "Prophet Muhammad ﷺ in Seerah",
    category: "Seerah",
    difficulty: "Intermediate",
    description: "Explore the biography and character of the Prophet ﷺ.",
    questions: [
      {
        question: "In which city was the Prophet Muhammad ﷺ born?",
        type: "multiple",
        options: ["Makkah", "Madinah", "Taif", "Jerusalem"],
        answer: "A",
        explanation: "The Prophet Muhammad ﷺ was born in Makkah."
      },
      {
        question: "The Hijrah marks the migration from Makkah to Madinah.",
        type: "truefalse",
        options: ["True", "False"],
        answer: "A",
        explanation: "The Hijrah was the migration from Makkah to Madinah and is a major event in Islamic history."
      },
      {
        question: "Which year is known as the Year of Delegations?",
        type: "multiple",
        options: ["1 AH", "3 AH", "5 AH", "10 AH"],
        answer: "B",
        explanation: "The year 3 AH is famously known as the Year of Delegations."
      }
    ]
  },
  {
    id: 3,
    title: "Hadith Essentials",
    category: "Hadith",
    difficulty: "Intermediate",
    description: "Strengthen your understanding of Hadith and authenticity.",
    questions: [
      {
        question: "The phrase 'Actions are judged by intentions' is a hadith narrated by the Prophet ﷺ.",
        type: "truefalse",
        options: ["True", "False"],
        answer: "A",
        explanation: "This is a foundational hadith and is widely cited in Islamic practice."
      },
      {
        question: "Which collection is most widely accepted among Sunni Muslims?",
        type: "multiple",
        options: ["Sahih al-Bukhari", "Muwatta Malik", "Jami al-Tirmidhi", "Musnad Ahmad"],
        answer: "A",
        explanation: "Sahih al-Bukhari is one of the most authentic and respected collections of Hadith."
      },
      {
        question: "What is the Arabic term for 'intention' in Islamic teachings?",
        type: "multiple",
        options: ["Sabr", "Niyyah", "Amanah", "Taqwa"],
        answer: "B",
        explanation: "Niyyah means intention, and it plays a significant role in shaping actions in Islam."
      }
    ]
  },
  {
    id: 4,
    title: "Fiqh Fundamentals",
    category: "Fiqh",
    difficulty: "Advanced",
    description: "Learn essential Fiqh concepts and practical rulings.",
    questions: [
      {
        question: "Which of the following is a primary source of Islamic jurisprudence?",
        type: "multiple",
        options: ["Custom", "Quran", "Public opinion", "Culture"],
        answer: "B",
        explanation: "The Quran is one of the primary sources of Islamic law."
      },
      {
        question: "The concept of 'ihram' is associated with the pilgrimage rituals.",
        type: "truefalse",
        options: ["True", "False"],
        answer: "A",
        explanation: "Ihram is the sacred state entered before Hajj and Umrah."
      },
      {
        question: "Which act is part of the five daily prayers?",
        type: "multiple",
        options: ["Reading the Quran", "Washing the hands", "Saying the takbir", "Giving charity"],
        answer: "C",
        explanation: "The takbir is part of the prayer and marks the beginning of the act of worship."
      }
    ]
  }
];

const defaultNotifications = [
  "New Quran quiz: 'Quran Basics' has been added.",
  "Daily challenge available: 'Hadith Essentials'.",
  "Your progress report is ready to view.",
  "Admin approved a new educational content update."
];

const initialState = {
  users: [
    {
      id: 1,
      name: "Demo Student",
      email: "student@example.com",
      password: "123456",
      role: "user",
      completedQuizzes: [],
      reviews: [],
      notifications: defaultNotifications.slice()
    }
  ],
  currentUser: null,
  currentSection: "dashboard",
  activeAuthTab: "login",
  selectedQuiz: null,
  quizIndex: 0,
  selectedAnswers: [],
  filters: {
    category: "All",
    difficulty: "All",
    search: ""
  }
};

const state = loadState();

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  return structuredClone(initialState);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getCurrentUser() {
  return state.currentUser;
}

function setCurrentUser(user) {
  state.currentUser = user;
  saveState();
}

function renderApp() {
  const user = getCurrentUser();

  if (!user) {
    document.getElementById("authSection").classList.remove("hidden");
    document.getElementById("dashboardSection").classList.add("hidden");
    document.getElementById("quizzesSection").classList.add("hidden");
    document.getElementById("quizPlaySection").classList.add("hidden");
    document.getElementById("reviewsSection").classList.add("hidden");
    document.getElementById("adminSection").classList.add("hidden");
    document.getElementById("logoutBtn").classList.add("hidden");
    document.getElementById("welcomeText").textContent = "Guest";
    return;
  }

  document.getElementById("authSection").classList.add("hidden");
  document.getElementById("logoutBtn").classList.remove("hidden");
  document.getElementById("welcomeText").textContent = `Welcome, ${user.name}`;

  const sectionMap = {
    dashboard: "dashboardSection",
    quizzes: "quizzesSection",
    reviews: "reviewsSection",
    admin: "adminSection"
  };

  Object.entries(sectionMap).forEach(([key, id]) => {
    const visible = key === state.currentSection;
    document.getElementById(id).classList.toggle("hidden", !visible);
  });

  renderDashboard();
  renderQuizList();
  renderReviewSelect();
  renderReviews();
  renderNotifications();
  renderAdminList();
  updateAdminAccess();
}

function updateAdminAccess() {
  const user = getCurrentUser();
  const showAdminBtn = document.getElementById("showAdminQuizBtn");
  if (user && user.role === "admin") {
    showAdminBtn.classList.remove("hidden");
  } else {
    showAdminBtn.classList.add("hidden");
  }
}

function renderDashboard() {
  const user = getCurrentUser();
  if (!user) return;

  const totalQuizzes = quizBank.length;
  const completed = user.completedQuizzes.length;
  const scores = user.completedQuizzes.map(item => item.scorePercent || 0);
  const average = scores.length
    ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    : 0;

  const categoryMap = {};
  user.completedQuizzes.forEach(item => {
    const category = item.category;
    categoryMap[category] = categoryMap[category] || [];
    categoryMap[category].push(item.scorePercent);
  });

  let bestCategory = "-";
  let bestAverage = -1;
  Object.entries(categoryMap).forEach(([category, values]) => {
    const avg = Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
    if (avg > bestAverage) {
      bestAverage = avg;
      bestCategory = category;
    }
  });

  document.getElementById("totalQuizzesStat").textContent = totalQuizzes;
  document.getElementById("completedStat").textContent = completed;
  document.getElementById("averageScoreStat").textContent = `${average}%`;
  document.getElementById("bestCategoryStat").textContent = bestCategory;

  document.querySelectorAll(".chart-row").forEach(row => {
    const category = row.dataset.category;
    const attempts = user.completedQuizzes.filter(item => item.category === category);
    const avg = attempts.length
      ? Math.round(attempts.reduce((sum, item) => sum + item.scorePercent, 0) / attempts.length)
      : 0;

    const bar = row.querySelector(".chart-bar");
    bar.style.width = `${avg}%`;
  });
}

function renderNotifications() {
  const user = getCurrentUser();
  if (!user) return;

  const list = document.getElementById("notificationList");
  list.innerHTML = "";

  const items = user.notifications.length ? user.notifications : defaultNotifications;
  items.slice(0, 4).forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

function renderQuizList() {
  const user = getCurrentUser();
  if (!user) return;

  const list = document.getElementById("quizList");
  list.innerHTML = "";

  const category = state.filters.category;
  const difficulty = state.filters.difficulty;
  const search = state.filters.search.trim().toLowerCase();

  const filtered = quizBank.filter(quiz => {
    const categoryMatch = category === "All" || quiz.category === category;
    const difficultyMatch = difficulty === "All" || quiz.difficulty === difficulty;
    const searchMatch = !search || quiz.title.toLowerCase().includes(search);
    return categoryMatch && difficultyMatch && searchMatch;
  });

  if (!filtered.length) {
    list.innerHTML = '<div class="quiz-card"><h3>No quizzes found</h3><p>Try changing your filters or search query.</p></div>';
    return;
  }

  filtered.forEach(quiz => {
    const card = document.createElement("article");
    card.className = "quiz-card";

    const completed = user.completedQuizzes.find(item => item.quizId === quiz.id);

    card.innerHTML = `
      <div class="quiz-topline">
        <span class="category-tag">${quiz.category}</span>
        <span class="pill">${quiz.difficulty}</span>
      </div>
      <h3>${quiz.title}</h3>
      <p>${quiz.description}</p>
      <div class="quiz-bottom">
        <span>${quiz.questions.length} Questions</span>
        <span>${completed ? "Completed" : "Ready"}</span>
      </div>
      <button class="btn btn-primary start-quiz-btn" data-quiz-id="${quiz.id}">Start quiz</button>
    `;

    list.appendChild(card);
  });

  document.querySelectorAll(".start-quiz-btn").forEach(button => {
    button.addEventListener("click", () => startQuiz(Number(button.dataset.quizId)));
  });
}

function startQuiz(quizId) {
  const quiz = quizBank.find(item => item.id === quizId);
  if (!quiz) return;

  state.selectedQuiz = quiz;
  state.quizIndex = 0;
  state.selectedAnswers = Array(quiz.questions.length).fill(null);

  document.getElementById("quizTitle").textContent = quiz.title;
  document.getElementById("quizMeta").textContent = `${quiz.category} • ${quiz.difficulty}`;

  document.getElementById("quizzesSection").classList.add("hidden");
  document.getElementById("quizPlaySection").classList.remove("hidden");
  renderQuestion();
}

function renderQuestion() {
  const quiz = state.selectedQuiz;
  if (!quiz) return;

  const question = quiz.questions[state.quizIndex];
  const questionCard = document.getElementById("questionCard");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  const step = state.quizIndex + 1;
  const percent = (step / quiz.questions.length) * 100;
  progressFill.style.width = `${percent}%`;
  progressText.textContent = `Question ${step} / ${quiz.questions.length}`;

  prevBtn.disabled = state.quizIndex === 0;
  prevBtn.style.opacity = state.quizIndex === 0 ? "0.5" : "1";

  const selected = state.selectedAnswers[state.quizIndex];

  const optionMarkup = question.options
    .map((option, index) => {
      const letter = String.fromCharCode(65 + index);
      const isSelected = selected === letter;
      return `<button class="option ${isSelected ? "selected" : ""}" data-letter="${letter}">${letter}. ${option}</button>`;
    })
    .join("");

  questionCard.innerHTML = `
    <h3>${question.question}</h3>
    <div class="options">${optionMarkup}</div>
  `;

  questionCard.querySelectorAll(".option").forEach(button => {
    button.addEventListener("click", () => {
      const letter = button.dataset.letter;
      state.selectedAnswers[state.quizIndex] = letter;
      renderQuestion();
    });
  });

  nextBtn.textContent = state.quizIndex === quiz.questions.length - 1 ? "Submit quiz" : "Next";
}

function submitQuiz() {
  const quiz = state.selectedQuiz;
  if (!quiz) return;

  let correctResponses = 0;
  quiz.questions.forEach((question, index) => {
    if (state.selectedAnswers[index] === question.answer) correctResponses += 1;
  });

  const user = getCurrentUser();
  const scorePercent = Math.round((correctResponses / quiz.questions.length) * 100);

  const existingIndex = user.completedQuizzes.findIndex(item => item.quizId === quiz.id);
  if (existingIndex >= 0) {
    user.completedQuizzes[existingIndex] = { quizId: quiz.id, category: quiz.category, scorePercent };
  } else {
    user.completedQuizzes.push({ quizId: quiz.id, category: quiz.category, scorePercent });
  }

  const resultCard = document.getElementById("questionCard");
  resultCard.innerHTML = `
    <h3>Quiz results</h3>
    <p style="margin:0 0 18px; font-size:1.15rem; font-weight:700; color:var(--primary-900);">Your score: ${scorePercent}%</p>
    <p style="margin:0 0 14px; color:var(--muted);">You answered ${correctResponses} out of ${quiz.questions.length} questions correctly.</p>
    <div class="review-list">
      ${quiz.questions
        .map((question, index) => {
          const userAnswer = state.selectedAnswers[index] || "No answer";
          const isCorrect = userAnswer === question.answer;
          return `
            <div class="review-item">
              <div class="review-item-head">
                <h4>Question ${index + 1}</h4>
                <span class="rating-stars">${isCorrect ? "✅ Correct" : "❌ Incorrect"}</span>
              </div>
              <p><strong>Question:</strong> ${question.question}</p>
              <p><strong>Your answer:</strong> ${userAnswer}</p>
              <p><strong>Correct answer:</strong> ${question.answer}</p>
              <div class="explanation-box">${question.explanation}</div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;

  const nextBtn = document.getElementById("nextBtn");
  nextBtn.textContent = "Finish";
  nextBtn.onclick = () => {
    state.selectedQuiz = null;
    state.currentSection = "quizzes";
    document.getElementById("quizPlaySection").classList.add("hidden");
    renderApp();
  };

  document.getElementById("prevBtn").classList.add("hidden");
  progressFill.style.width = "100%";
  progressText.textContent = `Completed • ${scorePercent}%`;

  saveState();
  renderDashboard();
  renderQuizList();
}

document.getElementById("nextBtn").addEventListener("click", () => {
  const quiz = state.selectedQuiz;
  if (!quiz) return;

  if (state.quizIndex < quiz.questions.length - 1) {
    state.quizIndex += 1;
    renderQuestion();
    return;
  }

  submitQuiz();
});

document.getElementById("prevBtn").addEventListener("click", () => {
  if (!state.selectedQuiz) return;
  if (state.quizIndex > 0) {
    state.quizIndex -= 1;
    renderQuestion();
  }
});

function renderReviewSelect() {
  const select = document.getElementById("reviewQuizSelect");
  select.innerHTML = quizBank
    .map(quiz => `<option value="${quiz.id}">${quiz.title}</option>`)
    .join("");
}

function submitReview() {
  const user = getCurrentUser();
  if (!user) return;

  const quizId = Number(document.getElementById("reviewQuizSelect").value);
  const rating = Number(document.getElementById("ratingInput").value);
  const text = document.getElementById("reviewText").value.trim();

  if (!text) {
    alert("Please enter feedback before submitting.");
    return;
  }

  const quiz = quizBank.find(item => item.id === quizId);
  if (!quiz) return;

  user.reviews.push({
    quizId,
    quizTitle: quiz.title,
    rating,
    text
  });

  document.getElementById("reviewText").value = "";
  renderReviews();
  saveState();
}

function renderReviews() {
  const user = getCurrentUser();
  if (!user) return;

  const container = document.getElementById("reviewsList");
  container.innerHTML = "";

  if (!user.reviews.length) {
    container.innerHTML = "<div class='review-item'><p>No reviews yet. Start by rating a quiz.</p></div>";
    return;
  }

  user.reviews.forEach(review => {
    const item = document.createElement("div");
    item.className = "review-item";
    item.innerHTML = `
      <div class="review-item-head">
        <h4>${review.quizTitle}</h4>
        <span class="rating-stars">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span>
      </div>
      <p>${review.text}</p>
    `;
    container.appendChild(item);
  });
}

function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const user = state.users.find(item => item.email === email && item.password === password);
  if (!user) {
    alert("Invalid login credentials.");
    return;
  }

  setCurrentUser(user);
  state.currentSection = "dashboard";
  renderApp();
}

function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;

  if (!name || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  if (state.users.some(user => user.email === email)) {
    alert("User already exists. Please log in instead.");
    return;
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role: "user",
    completedQuizzes: [],
    reviews: [],
    notifications: [
      "Welcome to Islamic Quiz! Start your learning journey today.",
      "A new challenge is available in the Quran section."
    ]
  };

  state.users.push(newUser);
  setCurrentUser(newUser);
  state.currentSection = "dashboard";
  renderApp();
}

function handleLogout() {
  setCurrentUser(null);
  state.currentSection = "dashboard";
  renderApp();
}

function switchAuthTab(tab) {
  state.activeAuthTab = tab;

  document.querySelectorAll(".tab-btn").forEach(button => {
    const isActive = button.dataset.auth === tab;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  document.getElementById("loginForm").classList.toggle("hidden", tab !== "login");
  document.getElementById("registerForm").classList.toggle("hidden", tab !== "register");
}

function addAdminQuiz(event) {
  event.preventDefault();

  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    alert("Only admins can add quiz content.");
    return;
  }

  const title = document.getElementById("adminQuizTitle").value.trim();
  const category = document.getElementById("adminQuizCategory").value;
  const difficulty = document.getElementById("adminQuizDifficulty").value;
  const questionText = document.getElementById("adminQuestionText").value.trim();
  const optionA = document.getElementById("adminOptionA").value.trim();
  const optionB = document.getElementById("adminOptionB").value.trim();
  const optionC = document.getElementById("adminOptionC").value.trim();
  const optionD = document.getElementById("adminOptionD").value.trim();
  const correctAnswer = document.getElementById("adminCorrectAnswer").value;
  const explanation = document.getElementById("adminExplanation").value.trim();
  const type = document.getElementById("adminQuestionType").value;

  const newQuiz = {
    id: Date.now(),
    title,
    category,
    difficulty,
    description: "Submitted by admin for review and learning.",
    questions: [
      {
        question: questionText,
        type,
        options: [optionA, optionB, optionC, optionD],
        answer: correctAnswer,
        explanation
      }
    ]
  };

  quizBank.unshift(newQuiz);
  renderQuizList();
  renderReviewSelect();
  renderAdminList();
  document.getElementById("adminQuizForm").reset();
  alert("New quiz added successfully.");
}

function renderAdminList() {
  const list = document.getElementById("adminQuizList");
  list.innerHTML = "";

  quizBank.forEach(quiz => {
    const item = document.createElement("li");
    item.textContent = `${quiz.title} • ${quiz.category}`;
    list.appendChild(item);
  });
}

document.getElementById("loginForm").addEventListener("submit", handleLogin);
document.getElementById("registerForm").addEventListener("submit", handleRegister);
document.getElementById("logoutBtn").addEventListener("click", handleLogout);
document.getElementById("submitReviewBtn").addEventListener("click", submitReview);
document.getElementById("adminQuizForm").addEventListener("submit", addAdminQuiz);

document.querySelectorAll(".tab-btn").forEach(button => {
  button.addEventListener("click", () => switchAuthTab(button.dataset.auth));
});

document.querySelectorAll(".nav-btn").forEach(button => {
  button.addEventListener("click", () => {
    state.currentSection = button.dataset.section;
    renderApp();
  });
});

document.getElementById("categoryFilter").addEventListener("change", event => {
  state.filters.category = event.target.value;
  renderQuizList();
});

document.getElementById("difficultyFilter").addEventListener("change", event => {
  state.filters.difficulty = event.target.value;
  renderQuizList();
});

document.getElementById("searchInput").addEventListener("input", event => {
  state.filters.search = event.target.value;
  renderQuizList();
});

document.getElementById("showAdminQuizBtn").addEventListener("click", () => {
  state.currentSection = "admin";
  renderApp();
});

const demoAdminUser = {
  id: 2,
  name: "Admin",
  email: "admin@example.com",
  password: "admin123",
  role: "admin",
  completedQuizzes: [],
  reviews: [],
  notifications: [
    "Admin dashboard is active.",
    "A new content review is pending approval.",
    "Daily learning reminder: read one hadith today."
  ]
};

if (!state.users.some(user => user.email === demoAdminUser.email)) {
  state.users.push(demoAdminUser);
  saveState();
}

renderApp();
