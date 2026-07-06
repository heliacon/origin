// Heliacon homepage. Wires the intent box to the live /ask capability and confirms the origin
// is online. Small, vanilla, no dependencies.
(() => {
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

  const status = document.getElementById("status");
  fetch("/origin.json", { cache: "no-store" })
    .then((r) => { if (!r.ok) throw 0; })
    .catch(() => { if (status) { status.classList.add("off"); status.lastChild.textContent = "Origin unreachable"; } });

  const form = document.getElementById("ask");
  const input = document.getElementById("q");
  const out = document.getElementById("answers");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    out.innerHTML = '<p class="hint">Asking the origin...</p>';
    try {
      const r = await fetch("/ask?q=" + encodeURIComponent(q));
      const d = await r.json();
      if (!d.answers || !d.answers.length) {
        out.innerHTML = '<p class="hint">Nothing in the corpus answers that yet. It is small and honest.</p>';
        return;
      }
      out.innerHTML = d.answers
        .map((a) => `<a class="ans" href="${a.citation.url}"><span class="ans-t">${esc(a.citation.title)}</span><span class="ans-x">${esc(a.text)}</span></a>`)
        .join("");
    } catch (err) {
      out.innerHTML = '<p class="hint">Could not reach the origin. Try again.</p>';
    }
  });
})();
