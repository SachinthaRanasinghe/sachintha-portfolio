(() => {
  const { projects } = window.PORTFOLIO;
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");

  // ---------- Previews ----------
  const previews = {
    escape: (p) => `<img class="pv-img" src="${p.poster}" alt="" loading="lazy" />`,
    image: (p) => `<img class="pv-img" src="${p.poster}" alt="" loading="lazy" />`,
    phone: (p) => p.poster ? `
      <div class="pv-phone"><div class="phone phone-shot"><img src="${p.poster}" alt="" loading="lazy" /></div></div>` : `
      <div class="pv-phone"><div class="phone">
        <div class="notch"></div>
        <div class="p-h"></div><div class="p-s"></div>
        <div class="p-row">
          <div class="p-tile"><b></b><i></i></div>
          <div class="p-tile"><b></b><i></i></div>
        </div>
        <div class="p-bars"><span style="height:40%"></span><span style="height:65%"></span><span class="on" style="height:90%"></span><span style="height:55%"></span><span style="height:75%"></span><span style="height:35%"></span><span style="height:60%"></span></div>
        <div class="p-bubble me"><i></i><i></i></div>
        <div class="p-bubble"><i></i><i></i><i></i></div>
      </div></div>`,
    dashboard: () => `
      <div class="pv-dash">
        <div class="d-side"><i class="on"></i><i></i><i></i><i></i><i></i><i></i></div>
        <div class="d-main">
          <div class="d-title"></div>
          <div class="d-kpis">
            <div class="d-kpi"><b></b><i></i></div><div class="d-kpi"><b></b><i></i></div><div class="d-kpi"><b></b><i></i></div>
          </div>
          <div class="d-match"><i style="width:70%"></i><span class="ring"></span><i style="width:45%"></i></div>
          <div class="d-match"><i style="width:60%"></i><span class="ring" style="border-right-color:#2a2a2a"></span><i style="width:35%"></i></div>
          <div class="d-match"><i style="width:50%"></i><span class="ring" style="border-right-color:#2a2a2a;border-top-color:#888"></span><i style="width:40%"></i></div>
        </div>
      </div>`,
  };
  const preview = (p) => (previews[p.preview] || (() => ""))(p);
  const videoChip = (p) => (p.videos.length ? `<span class="video-chip">Video</span>` : "");

  // ---------- Featured cards ----------
  const featured = projects.filter((p) => p.featured);
  $("#featured").innerHTML = featured
    .map(
      (p, i) => `
      <a class="card" href="#project/${p.slug}" aria-label="${esc(p.name)}: view case study">
        <div class="card-preview">${videoChip(p)}${preview(p)}</div>
        <div class="card-body">
          <div class="card-num"><span class="meta">Project ${pad(i + 1)}</span><span class="meta">${p.year}</span></div>
          <div>
            <h3>${esc(p.name)}</h3>
            <p class="sub">${esc(p.subtitle)}</p>
          </div>
          <p class="desc">${esc(p.summary)}</p>
          <p class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</p>
          <div class="card-foot"><span class="case-link">View case study <span class="arr">→</span></span></div>
        </div>
      </a>`
    )
    .join("");

  // ---------- Index ----------
  $("#projectCount").textContent = `${pad(projects.length)} systems`;
  $("#projectIndex").innerHTML = projects
    .map(
      (p, i) => `
      <li><a class="index-row" href="#project/${p.slug}">
        <span class="n meta">${pad(i + 1)}</span>
        <span class="t">${esc(p.name)}<small>${esc(p.subtitle)}</small></span>
        <span class="d">${esc(p.summary)}</span>
        <span class="r">${videoChip(p)}<span class="arr">→</span></span>
      </a></li>`
    )
    .join("");

  // ---------- Case study ----------
  const dialog = $("#case");
  const body = $("#caseBody");
  let returnFocus = null;

  function renderCase(p) {
    const idx = projects.indexOf(p);
    const media = p.videos.length
      ? `<div class="player">
          <video id="caseVideo" class="${p.videos[0].portrait ? "portrait" : ""}" controls playsinline preload="metadata" poster="${p.videos[0].poster || ""}" src="${p.videos[0].src}"></video>
          ${
            p.videos.length > 1
              ? `<div class="player-tabs" role="group" aria-label="Choose video">${p.videos
                  .map((v, i) => `<button type="button" data-v="${i}" aria-pressed="${i === 0}">${esc(v.label)}</button>`)
                  .join("")}</div>`
              : ""
          }
        </div>`
      : `<div class="player player-static">${preview(p)}</div>`;

    body.innerHTML = `
      <div class="case-bar">
        <span class="meta">Case study · ${pad(idx + 1)} / ${pad(projects.length)}</span>
        <button class="icon-btn" data-close aria-label="Close case study">✕</button>
      </div>
      <div class="case-head">
        <p class="meta">${esc(p.subtitle)} · ${p.year}</p>
        <h2 id="caseTitle">${esc(p.name)}</h2>
        <p>${esc(p.overview)}</p>
      </div>
      ${media}
      <div class="case-grid">
        <div>
          <h3>What I built</h3>
          <ul class="built">${p.built.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
        </div>
        <aside class="case-side">
          <div><h3>Stack</h3><div class="chips">${p.stack.map((s) => `<span>${esc(s)}</span>`).join("")}</div></div>
          <div><h3>Links</h3><div class="case-links">
            ${p.links.map((l) => `<a class="btn btn-ghost" href="${l.href}" target="_blank" rel="noopener">${esc(l.label)} <span class="arr">↗</span></a>`).join("")}
            ${p.note ? `<p class="case-note">${esc(p.note)}</p>` : ""}
            <a class="btn btn-ghost" href="mailto:sachintha.ranasinghe.int@gmail.com?subject=${encodeURIComponent(p.name)}">Ask about this project <span class="arr">→</span></a>
          </div></div>
        </aside>
      </div>`;

    const video = $("#caseVideo", body);
    body.querySelectorAll(".player-tabs button").forEach((btn) =>
      btn.addEventListener("click", () => {
        const v = p.videos[+btn.dataset.v];
        body.querySelectorAll(".player-tabs button").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        video.classList.toggle("portrait", !!v.portrait);
        video.poster = v.poster || "";
        video.src = v.src;
        video.play().catch(() => {});
      })
    );
  }

  function openCase(slug) {
    const p = projects.find((x) => x.slug === slug);
    if (!p) return;
    if (!dialog.open) returnFocus = document.activeElement;
    renderCase(p);
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    document.title = `${p.name} | Sachintha Ranasinghe`;
  }

  function closeCase() {
    const v = $("video", dialog);
    if (v) v.pause();
    if (dialog.open) dialog.close();
  }

  dialog.addEventListener("close", () => {
    const v = $("video", dialog);
    if (v) v.pause();
    document.title = "Sachintha Ranasinghe | AI Systems Engineer";
    if (location.hash.startsWith("#project/")) history.replaceState(null, "", location.pathname + location.search + "#projects");
    if (returnFocus) returnFocus.focus({ preventScroll: true });
  });
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog || e.target.closest("[data-close]")) closeCase();
  });

  // Hash routing keeps case studies shareable: /#project/ai-escape-room
  function route() {
    const m = location.hash.match(/^#project\/([\w-]+)/);
    if (m) openCase(m[1]);
    else if (dialog.open) closeCase();
  }
  window.addEventListener("hashchange", route);
  window.PORTFOLIO.openCase = (slug) => (location.hash = `#project/${slug}`);

  // Keep project links from scrolling the page underneath
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#project/"]');
    if (!a) return;
    e.preventDefault();
    history.pushState(null, "", a.getAttribute("href"));
    route();
  });
  window.addEventListener("popstate", route);
  route();

  // ---------- Nav state ----------
  const links = [...document.querySelectorAll(".nav a")];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => l.classList.toggle("active", l.dataset.section === en.target.id));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  document.querySelectorAll("[data-section]").forEach((s) => s.id && observer.observe(s));

  // ---------- Profile ----------
  const profile = $("#profile");
  $("#profileBtn").addEventListener("click", () => profile.showModal());
  profile.addEventListener("click", (e) => {
    if (e.target === profile || e.target.closest("[data-close]")) profile.close();
  });

  // ---------- Mobile menu ----------
  const sidebar = $("#sidebar");
  const menuBtn = $("#menuBtn");
  menuBtn.addEventListener("click", () => {
    const open = sidebar.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  links.forEach((l) =>
    l.addEventListener("click", () => {
      sidebar.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    })
  );
})();
