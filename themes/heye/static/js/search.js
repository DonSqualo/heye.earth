// Site search. Replaces super.so's hosted search with a static index (/index.json)
// rendered into the same modal markup/classes, so the old CSS applies.
(function () {
  var root = document.getElementById("site-search");
  if (!root) return;
  var input = root.querySelector("input");
  var list = root.querySelector(".notion-search__result-list");
  var clear = root.querySelector(".notion-search__clear");
  var index = null, loading = null, active = -1, results = [];

  function load() {
    if (index) return Promise.resolve(index);
    if (!loading) {
      loading = fetch("/index.json").then(function (r) { return r.json(); }).then(function (d) {
        index = d.map(function (p) {
          return { title: p.title || "", url: p.url, icon: p.icon, icon_image: p.icon_image, text: p.text || "", lt: (p.title || "").toLowerCase(), ltext: (p.text || "").toLowerCase() };
        });
        return index;
      });
    }
    return loading;
  }
  function open() {
    root.classList.remove("close"); root.classList.add("open");
    root.setAttribute("aria-hidden", "false");
    setTimeout(function () { input.focus(); }, 0);
    load();
  }
  function close() {
    root.classList.remove("open"); root.classList.add("close");
    root.setAttribute("aria-hidden", "true");
  }
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function snippet(p, q) {
    var i = p.ltext.indexOf(q);
    if (i < 0) return "";
    var start = Math.max(0, i - 40), end = Math.min(p.text.length, i + q.length + 60);
    return (start > 0 ? "…" : "") + esc(p.text.slice(start, end)) + (end < p.text.length ? "…" : "");
  }
  function render() {
    if (!results.length) { list.hidden = true; list.innerHTML = ""; return; }
    list.hidden = false;
    list.innerHTML = results.map(function (p, i) {
      var icon = p.icon_image ? '<img class="notion-search__result-item-icon" src="' + esc(p.icon_image) + '" alt="">' :
        '<span class="notion-icon text" style="width:20px;height:20px;font-size:20px">' + (p.icon ? esc(p.icon) : '<svg class="notion-icon notion-icon__page" viewBox="0 0 16 16" width="16" height="16" fill="var(--color-text-default-light)"><path d="M4.35645 15.4678H11.6367C13.0996 15.4678 13.8584 14.6953 13.8584 13.2256V7.02539C13.8584 6.0752 13.7354 5.6377 13.1406 5.03613L9.55176 1.38574C8.97754 0.804688 8.50586 0.667969 7.65137 0.667969H4.35645C2.89355 0.667969 2.13477 1.44043 2.13477 2.91016V13.2256C2.13477 14.7021 2.89355 15.4678 4.35645 15.4678ZM4.46582 14.1279C3.80273 14.1279 3.47461 13.7793 3.47461 13.1436V2.99219C3.47461 2.36328 3.80273 2.00781 4.46582 2.00781H7.37793V5.75391C7.37793 6.73145 7.86328 7.20312 8.83398 7.20312H12.5186V13.1436C12.5186 13.7793 12.1836 14.1279 11.5205 14.1279H4.46582ZM8.9707 6.02734C8.67676 6.02734 8.55371 5.9043 8.55371 5.60352V2.19238L12.334 6.02734H8.9707Z"></path></svg>') + '</span>';
      return '<div class="notion-search__result-item-wrapper' + (i === results.length - 1 ? ' last' : '') + '"><a class="notion-search__result-item page' + (i === active ? ' active' : '') + '" href="' + esc(p.url) + '" data-i="' + i + '">' + icon +
        '<div class="notion-search__result-item-content"><div class="notion-search__result-item-title">' + esc(p.title) + '</div>' + (p.snip ? '<div class="notion-search__result-item-page-title">' + p.snip + '</div>' : '') + '</div></a></div>';
    }).join("");
  }
  function search(q) {
    q = q.trim().toLowerCase();
    active = -1; results = [];
    if (!q || !index) { render(); return; }
    var hits = [];
    index.forEach(function (p) {
      var score = 0;
      if (p.lt === q) score = 100; else if (p.lt.indexOf(q) === 0) score = 60; else if (p.lt.indexOf(q) >= 0) score = 40; else if (p.ltext.indexOf(q) >= 0) score = 10;
      if (score) hits.push({ p: p, score: score });
    });
    hits.sort(function (a, b) { return b.score - a.score || a.p.title.localeCompare(b.p.title); });
    results = hits.slice(0, 10).map(function (h) { var o = Object.create(h.p); o.snip = h.score <= 10 ? snippet(h.p, q) : ""; return o; });
    render();
  }

  document.querySelectorAll("#desktop-search, #mobile-search").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); open(); });
  });
  root.querySelector(".notion-search__wrapper").addEventListener("click", function (e) { if (e.target === e.currentTarget) close(); });
  clear.addEventListener("click", function () { input.value = ""; search(""); input.focus(); });
  input.addEventListener("input", function () { load().then(function () { search(input.value); }); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); if (results.length) { active = (active + 1) % results.length; render(); } }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (results.length) { active = (active - 1 + results.length) % results.length; render(); } }
    else if (e.key === "Enter") { var r = results[active >= 0 ? active : 0]; if (r) window.location.href = r.url; }
    else if (e.key === "Escape") { close(); }
  });
  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); root.classList.contains("open") ? close() : open(); }
    else if (e.key === "Escape" && root.classList.contains("open")) close();
  });
})();
