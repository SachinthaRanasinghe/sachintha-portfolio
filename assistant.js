// "Ask my portfolio": answers come from the portfolio's own data, matched in the browser.
// No API key or server is involved, so it works on static hosting and never invents facts.
(() => {
  const { projects, profile } = window.PORTFOLIO;
  const $ = (s) => document.querySelector(s);
  const caseLink = (slug, text) => `<a href="#project/${slug}">${text}</a>`;
  const list = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
  const P = Object.fromEntries(projects.map((p) => [p.slug, p]));

  const intents = [
    {
      keys: ["ai project", "ai projects", "llm project", "built", "projects", "work", "portfolio", "agent", "agents"],
      answer: () =>
        `<p>His main AI projects:</p>` +
        list([
          `${caseLink("ai-escape-room", "AI Escape Room")}: an LLM benchmark where two models race through the same generated room, replayed in 3D. <em>Has video.</em>`,
          `${caseLink("ai-job-application-agent", "AI Job Application Agent")}: tailors a resume and cover letter to a posting, then fills the employer's form. <em>Has video.</em>`,
          `${caseLink("daily-life-ai", "Daily Life AI")}: Flutter assistant for mood, habits, finance and planning with Groq/Llama insights. <em>Has video.</em>`,
          `${caseLink("cinematic-ai-portfolio", "Cinematic AI Portfolio")}: scroll-driven 3D portfolio with a RAG assistant on Groq and Llama 3.3. <em>Has video.</em>`,
          `${caseLink("smartcareers", "SmartCareers")}: AI career platform with job matching for five user roles.`,
          `${caseLink("edumind-ai", "EduMind AI")}: adaptive learning with LLM tutoring and risk prediction.`,
          `${caseLink("peak-blend", "Peak Blend Coffeehouse")}: voice AI barista with tool calling and ~323ms time to first audio. <em>Has video.</em>`,
        ]),
    },
    {
      keys: ["technolog", "tech stack", "stack", "skills", "languages", "tools", "use", "framework"],
      answer: () =>
        list([
          "<b>AI / LLM:</b> Groq, Gemini, OpenRouter, OpenAI-compatible APIs, RAG, tool calling, structured output (Zod), scikit-learn, LightGBM",
          "<b>Frontend:</b> React 19, Next.js, TypeScript, Flutter, Tailwind CSS, Three.js / React Three Fiber",
          "<b>Backend:</b> Node.js, Express, Django REST Framework, Flask, Server-Sent Events",
          "<b>Data:</b> PostgreSQL, MySQL, SQLite, Firebase Firestore",
          "<b>Testing & tools:</b> Vitest, Playwright, GitHub Actions, Vercel",
        ]),
    },
    {
      keys: ["escape", "escape room", "benchmark", "race", "3d"],
      answer: () => {
        const p = P["ai-escape-room"];
        return `<p>${p.overview}</p>` + list(p.built.slice(0, 4)) + `<p>${caseLink(p.slug, "Open the case study")} to watch the trailer and the full 85-second race.</p>`;
      },
    },
    {
      keys: ["full-stack", "full stack", "fullstack", "backend", "frontend", "experience", "production"],
      answer: () =>
        `<p>He builds applications end to end: frontend, API, database and deployment:</p>` +
        list([
          `${caseLink("ai-job-application-agent", "AI Job Application Agent")}: Next.js 16 + SQLite, 57k lines of TypeScript, 126 test files.`,
          `${caseLink("smartcareers", "SmartCareers")}: React + Express + PostgreSQL, five role-scoped workflows.`,
          `${caseLink("cafe-piranha", "Cafe Piranha")}: a staff attendance and payroll system running in production for a café. <em>Has video.</em>`,
          `${caseLink("edumind-ai", "EduMind AI")}: React + Django REST Framework + PostgreSQL.`,
          `${caseLink("daily-life-ai", "Daily Life AI")}: Flutter client with a Node.js + PostgreSQL API.`,
        ]),
    },
    {
      keys: ["education", "degree", "university", "study", "studied", "qualification", "bsc", "diploma"],
      answer: () =>
        list([
          "<b>BSc (Hons) Software Engineering, First Class</b>, Cardiff Metropolitan University / ICBT, 2024 - 2025",
          "Higher Diploma in Computing & Software Engineering, First Class, 2023 - 2024",
          "International Diploma in ICT, First Class, 2022",
        ]),
    },
    {
      keys: ["job agent", "job application", "resume tailor", "cover letter", "playwright"],
      answer: () => {
        const p = P["ai-job-application-agent"];
        return `<p>${p.overview}</p>` + list(p.built.slice(0, 4)) + `<p>${caseLink(p.slug, "Watch the demo")}.</p>`;
      },
    },
    {
      keys: ["contact", "email", "hire", "reach", "available", "linkedin", "github", "location", "based", "where", "visa", "relocat"],
      answer: () =>
        `<p>He's based in ${profile.location} and available for work.</p>` +
        list([
          `Email: <a href="mailto:${profile.email}">${profile.email}</a>`,
          `<a href="${profile.linkedin}" target="_blank" rel="noopener">LinkedIn</a> · <a href="${profile.github}" target="_blank" rel="noopener">GitHub</a>`,
          `<a href="${profile.resume}" target="_blank" rel="noopener">Download resume (PDF)</a>`,
        ]),
    },
    {
      keys: ["resume", "cv"],
      answer: () => `<p><a href="${profile.resume}" target="_blank" rel="noopener">Download the resume (PDF)</a>, or see the summary in the ${'<a href="#resume">Resume section</a>'}.</p>`,
    },
    {
      keys: ["video", "demo", "watch"],
      answer: () =>
        `<p>Projects with demo videos:</p>` +
        list(projects.filter((p) => p.videos.length).map((p) => `${caseLink(p.slug, p.name)}: ${p.videos.map((v) => v.label).join(", ")}`)),
    },
    {
      keys: ["rag", "llm", "ai", "machine learning", "ml", "model", "prompt"],
      answer: () =>
        `<p>His AI work centres on making LLM systems reliable through architecture rather than prompts:</p>` +
        list([
          "Multi-provider routing across Groq, Gemini and OpenRouter behind one interface.",
          "Structured output validated with Zod; tool calling compiled per provider.",
          "Provenance checks that reject model-invented content structurally.",
          "RAG (a portfolio chatbot over Llama 3.3) and classical ML, including a LightGBM classifier at MAP 0.712.",
        ]),
    },
  ];

  const suggestions = [
    "What AI projects has Sachintha built?",
    "What technologies does he use?",
    "Tell me about the AI Escape Room.",
    "What is his full-stack experience?",
    "What is his education?",
  ];

  function answer(q) {
    const text = q.toLowerCase();
    // Direct project name match first
    const proj = projects.find((p) => text.includes(p.name.toLowerCase()) || text.includes(p.slug.replace(/-/g, " ")));
    let best = null;
    let bestScore = 0;
    intents.forEach((it, i) => {
      const score = it.keys.reduce((s, k) => s + (text.includes(k) ? k.length + 10 : 0), 0) - i * 0.01;
      if (score > bestScore) { bestScore = score; best = it; }
    });
    // A named project wins unless a dedicated project intent (escape room, job agent) already matched
    const dedicated = best && ["escape", "job agent"].some((k) => best.keys.includes(k));
    if (proj && !dedicated) {
      return `<p>${proj.overview}</p>` + list(proj.built.slice(0, 4)) + `<p>${caseLink(proj.slug, "Open the case study")}.</p>`;
    }
    if (best) return best.answer();
    return `<p>I can answer questions about Sachintha's projects, technologies, education and experience. Try one of the suggestions, or email him at <a href="mailto:${profile.email}">${profile.email}</a>.</p>`;
  }

  const fab = $("#askFab");
  const panel = $("#askPanel");
  const log = $("#askLog");
  const input = $("#askInput");

  function add(role, html) {
    const el = document.createElement("div");
    el.className = `msg ${role}`;
    if (role === "user") el.textContent = html;
    else el.innerHTML = html;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  }

  function ask(q) {
    q = q.trim();
    if (!q) return;
    add("user", q);
    $("#askSuggest").classList.add("compact");
    setTimeout(() => add("bot", answer(q)), 220);
  }

  $("#askSuggest").innerHTML = suggestions.map((s) => `<button type="button">${s}</button>`).join("");
  $("#askSuggest").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) ask(b.textContent);
  });
  $("#askForm").addEventListener("submit", (e) => {
    e.preventDefault();
    ask(input.value);
    input.value = "";
  });

  function toggle(open) {
    panel.hidden = !open;
    fab.setAttribute("aria-expanded", String(open));
    if (open) {
      if (!log.children.length) add("bot", "<p>Hi! I answer from the content of this portfolio. What would you like to know?</p>");
      input.focus();
    }
  }
  fab.addEventListener("click", () => toggle(panel.hidden));
  $("#askClose").addEventListener("click", () => toggle(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden && !document.querySelector("#case[open]")) toggle(false);
  });
  // Links inside answers to case studies close the panel on small screens
  log.addEventListener("click", (e) => {
    if (e.target.closest('a[href^="#"]') && window.innerWidth < 760) toggle(false);
  });
})();
