// ====== منطق الموقع العام (نسخة كاملة) ======
(function () {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  // ===== Helpers =====
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._tid);
    t._tid = setTimeout(() => t.classList.remove("show"), 2500);
  }

  function escape(str) {
    return String(str ?? "").replace(/[&<>"']/g, (m) => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[m]));
  }

  // ===== Theme (وضع ليلي/نهاري) =====
  function initTheme(defaultTheme) {
    const saved = DB.getTheme();
    const theme = saved || defaultTheme || "dark";
    DB.setTheme(theme);
    updateThemeIcon(theme);
  }

  function updateThemeIcon(theme) {
    const btn = $("#themeToggle");
    if (btn) btn.textContent = theme === "dark" ? "☀️" : "🌙";
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    DB.setTheme(next);
    updateThemeIcon(next);
  }

  $("#themeToggle")?.addEventListener("click", toggleTheme);

  // ===== State =====
  let allProjects = [];
  let currentFilter = "all";
  let currentSearch = "";

  // ===== Load Settings =====
  async function loadSettings() {
    const s = await DB.getSettings();
    const ui = await DB.getUiSettings();

    // اسم المكتب
    $("#brandName").textContent   = s.officeName || ui.site_name || "مكتب الهندسة";
    $("#footerName").textContent  = s.officeName || "مكتب الهندسة";
    $("#heroTagline").textContent = s.tagline || s.about || "";
    $("#aboutText").textContent   = s.about || "";
    $("#infoPhone").textContent   = s.phone || "—";
    $("#infoEmail").textContent   = s.email || "—";
    $("#infoAddress").textContent = s.address || "—";
    $("#infoPhone2").textContent  = s.phone || "—";
    $("#infoEmail2").textContent  = s.email || "—";
    document.title = s.officeName || "مكتب الهندسة";

    // شعار
    if (ui.logo_url) {
      $("#logoMark").innerHTML = `<img src="${escape(ui.logo_url)}" alt="logo">`;
    }

    // اللون الأساسي
    if (ui.primary_color) {
      document.documentElement.style.setProperty("--accent", ui.primary_color);
    }

    // الوضع الافتراضي
    initTheme(ui.default_theme);

    // إظهار/إخفاء الأقسام
    if (ui.show_services === false) $("#services").style.display = "none";
    if (ui.show_projects === false) $("#projects").style.display = "none";
  }

  // ===== Services =====
  async function loadServices() {
    const list = await DB.getServices();
    const box = $("#servicesGrid");
    if (!list.length) {
      box.innerHTML = `<p class="muted">لا توجد خدمات منشورة بعد.</p>`;
      return;
    }
    box.innerHTML = list.map((s) => `
      <article class="card service reveal">
        <div class="icon">${escape(s.icon || "✦")}</div>
        <h3>${escape(s.title)}</h3>
        <p class="muted">${escape(s.description || s.desc)}</p>
      </article>
    `).join("");
    observeReveal();
  }

  // ===== Projects =====
  async function loadProjects() {
    allProjects = await DB.getProjects();

    // بناء أزرار الفلترة من التصنيفات الفعلية
    const cats = ["all", ...new Set(allProjects.map(p => p.cat).filter(Boolean))];
    $("#projFilters").innerHTML = cats.map((c) => `
      <button class="filter ${c === "all" ? "on" : ""}" data-cat="${escape(c)}">
        ${c === "all" ? "الكل" : escape(c)}
      </button>
    `).join("");

    renderProjects();
  }

  function renderProjects() {
    const box = $("#projectsGrid");
    let list = allProjects;

    if (currentFilter !== "all") {
      list = list.filter(p => p.cat === currentFilter);
    }
    if (currentSearch.trim()) {
      const q = currentSearch.trim().toLowerCase();
      list = list.filter(p =>
        (p.title || "").toLowerCase().includes(q) ||
        (p.description || p.desc || "").toLowerCase().includes(q)
      );
    }

    if (!list.length) {
      box.innerHTML = `<p class="muted">لا توجد مشاريع مطابقة.</p>`;
      return;
    }

    box.innerHTML = list.map((p) => `
      <article class="card reveal" data-slug="${escape(p.slug || "")}">
        <div class="thumb">
          ${p.cover_image
            ? `<img src="${escape(p.cover_image)}" alt="${escape(p.title)}" loading="lazy">`
            : escape(p.icon || "⌂")}
        </div>
        <div class="body">
          <span class="tag">${escape(p.cat || "مشروع")}</span>
          <h3>${escape(p.title)}</h3>
          <p class="muted">${escape(p.description || p.desc || "")}</p>
        </div>
      </article>
    `).join("");

    // ربط النقر لفتح التفاصيل
    $$("#projectsGrid .