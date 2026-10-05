// Behaviour for exported Notion content that super.so used to provide client-side:
// toggles, code copy buttons, tweet embeds. Uses event delegation so it also works
// for pages that home.js loads into the landing page.
(function () {
  // Toggle blocks
  document.addEventListener("click", function (e) {
    var summary = e.target.closest(".notion-toggle__summary");
    if (!summary) return;
    if (e.target.closest("a")) return;
    var toggle = summary.parentElement;
    var content = toggle.querySelector(":scope > .notion-toggle__content");
    var open = toggle.classList.contains("open");
    toggle.classList.toggle("open", !open);
    toggle.classList.toggle("closed", open);
    if (content) content.style.display = open ? "none" : "";
  });

  // Toggle headings (h1-h3 with class toggle)
  document.addEventListener("click", function (e) {
    var trigger = e.target.closest(".notion-toggle-heading-1 > .notion-toggle__summary, .notion-toggle-heading-2 > .notion-toggle__summary, .notion-toggle-heading-3 > .notion-toggle__summary");
    if (!trigger) return;
    // handled by the generic handler above (same structure)
  });

  // Copy buttons on code blocks
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".notion-code__copy-button");
    if (!btn) return;
    var code = btn.parentElement.querySelector("code");
    if (!code || !navigator.clipboard) return;
    navigator.clipboard.writeText(code.innerText).then(function () {
      btn.classList.add("copied");
      setTimeout(function () { btn.classList.remove("copied"); }, 1200);
    });
  });

  // Tweets: load Twitter's widget script only when a page actually embeds one
  function loadTweets(root) {
    if (!(root || document).querySelector(".twitter-tweet")) return;
    if (window.twttr && window.twttr.widgets) { window.twttr.widgets.load(root || document.body); return; }
    if (document.getElementById("twitter-wjs")) return;
    var s = document.createElement("script");
    s.id = "twitter-wjs";
    s.src = "https://platform.twitter.com/widgets.js";
    s.async = true;
    document.body.appendChild(s);
  }
  loadTweets();
  window.heyeLoadTweets = loadTweets;

  // Orbit review areas inside lazily loaded pages
  function loadOrbit(root) {
    if (!(root || document).querySelector("orbit-reviewarea")) return;
    if (document.getElementById("orbit-wc")) return;
    var s = document.createElement("script");
    s.id = "orbit-wc";
    s.type = "module";
    s.src = "https://js.withorbit.com/orbit-web-component.js";
    document.body.appendChild(s);
  }
  window.heyeLoadOrbit = loadOrbit;
})();
