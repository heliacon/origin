// Heliacon site script. Small, vanilla, no dependencies, defer-loaded on every page.
// Progressive enhancement only: every feature degrades to working HTML with JS off.
(() => {
  "use strict";
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ── theme toggle (light/dark) ────────────────────────────────────────────
  // The no-flash script in <head> has already stamped [data-theme]. Here we just flip and persist.
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const root = document.documentElement;
      const cur = root.getAttribute("data-theme") ||
        (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      const next = cur === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (_) {}
    });
  });

  // ── mobile nav disclosure (design-system §4.2, ia §4.2) ──────────────────
  const toggle = document.querySelector(".nav__toggle");
  const sheet = document.getElementById("nav-sheet");
  if (toggle && sheet) {
    const close = () => { sheet.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); };
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = sheet.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    document.addEventListener("click", (e) => {
      if (sheet.classList.contains("open") && !sheet.contains(e.target) && e.target !== toggle) close();
    });
    sheet.addEventListener("click", (e) => { if (e.target.closest("a")) close(); });
  }

  // ── hero parallax (single-layer; the image scrolls slower than the page) ──
  // Layer-ready: any element inside .hero carrying data-parallax="<factor>" is
  // translated by scrollY * factor, so multi-layer art (Firewatch-style) only
  // needs layers in the markup with their own factors. The flattened hero image
  // gets a default 0.35. Transform-only, rAF-throttled, off under reduced motion.
  const motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const heroMedia = document.querySelector(".hero .hero__media");
  if (motionOK && heroMedia) {
    if (!heroMedia.hasAttribute("data-parallax")) heroMedia.setAttribute("data-parallax", "0.35");
    const layers = [...document.querySelectorAll(".hero [data-parallax]")]
      .map((el) => ({ el, f: parseFloat(el.getAttribute("data-parallax")) || 0 }));
    const heroEl = heroMedia.closest(".hero");
    let ticking = false;
    const apply = () => {
      ticking = false;
      if (window.scrollY > heroEl.offsetHeight + 200) return; // hero gone; skip work
      const y = Math.min(window.scrollY, heroEl.offsetHeight); // clamp to the overscan budget
      layers.forEach(({ el, f }) => { el.style.transform = `translate3d(0,${(y * f).toFixed(1)}px,0)`; });
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(apply); }
    }, { passive: true });
    apply();
  }

  // ── click-to-copy (contact email) ────────────────────────────────────────
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const val = btn.getAttribute("data-copy");
      try { await navigator.clipboard.writeText(val); } catch (_) { return; }
      const flag = (btn.parentElement || document).querySelector("[data-copy-flag]");
      if (flag) { flag.hidden = false; setTimeout(() => { flag.hidden = true; }, 1600); }
    });
  });

  // ── mailto contact form (no backend; enhances the native mailto form) ─────
  const mform = document.querySelector("form[data-mailto-form]");
  if (mform) {
    const to = mform.getAttribute("data-mailto-to") || "hello@heliacon.com";
    const subj = mform.getAttribute("data-mailto-subject") || "Heliacon";
    // bridge hand-off from /ask (ia §6.2): prefill the message with the asked question
    const params = new URLSearchParams(location.search);
    if (params.get("ref") === "ask" && params.get("q")) {
      const msg = mform.querySelector('[name="message"]');
      if (msg && !msg.value) msg.value = "I asked: " + params.get("q") + "\n\n";
    }
    mform.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(mform);
      const body = [["Name", f.get("name")], ["Email", f.get("email")], ["Company", f.get("company")], ["Message", f.get("message")]]
        .filter((row) => row[1] && String(row[1]).trim())
        .map((row) => row[0] + ": " + row[1]).join("\n");
      location.href = "mailto:" + to + "?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent(body);
    });
  }

  // ── filter tabs -> client-side card filter (design-system §4.8) ───────────
  const tabWrap = document.querySelector("[data-filter-tabs]");
  const grid = document.querySelector("[data-filter-grid]");
  if (tabWrap && grid) {
    const tabs = [...tabWrap.querySelectorAll(".tab")];
    tabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        const type = tab.getAttribute("data-filter");
        tabs.forEach((t) => { t.classList.toggle("tab--active", t === tab); t.setAttribute("aria-selected", String(t === tab)); });
        grid.querySelectorAll("[data-type]").forEach((card) => {
          card.style.display = (type === "all" || card.getAttribute("data-type") === type) ? "" : "none";
        });
      });
    });
  }

  // ── on-this-page scroll spy (design-system §4.9), motion-safe ─────────────
  const toc = document.querySelector(".toc__list");
  if (toc && "IntersectionObserver" in window) {
    const items = new Map([...toc.querySelectorAll(".toc__item")].map((a) => [a.getAttribute("href").slice(1), a]));
    const heads = [...document.querySelectorAll(".article__body h2[id], .article__body h3[id]")];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          items.forEach((a) => a.classList.remove("is-active"));
          const a = items.get(en.target.id);
          if (a) a.classList.add("is-active");
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    heads.forEach((h) => obs.observe(h));
  }

  // ── ask box -> live /ask, with the bridge CTA after an answer (ia §6.2) ───
  const form = document.getElementById("ask");
  const input = document.getElementById("q");
  const out = document.getElementById("answers");
  const bridge = document.getElementById("ask-bridge");
  if (!form || !input || !out) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    out.innerHTML = '<p class="ask__hint">Asking the origin...</p>';
    try {
      const r = await fetch("/ask?q=" + encodeURIComponent(q));
      const d = await r.json();
      if (!d.answers || !d.answers.length) {
        out.innerHTML = '<p class="ask__hint">Nothing in the corpus answers that yet. It is small and honest.</p>';
        return;
      }
      out.innerHTML = d.answers
        .map((a) => `<a class="ask__ans" href="${esc(a.citation.url)}"><span class="ask__ans-t">${esc(a.citation.title)}</span><span class="ask__ans-x">${esc(a.text)}</span></a>`)
        .join("");
      if (bridge) bridge.querySelector("a").setAttribute("href", "/contact/?ref=ask&q=" + encodeURIComponent(q));
    } catch (_) {
      out.innerHTML = '<p class="ask__hint">Could not reach the origin. Try again.</p>';
    }
  });
})();
