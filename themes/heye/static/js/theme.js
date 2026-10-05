// Light/dark switch. Port of the theme-switcher part of the old Global.js:
// the preference lives in localStorage under the same key, the default is dark,
// and the `global-dark-theme` class on <html> drives the custom CSS.
(function () {
  var KEY = "heyeEarthUserThemPreference";
  var html = document.documentElement;

  var sunIconString = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun">' +
    '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line>' +
    '<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line>' +
    '<line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  var moonIconString = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon">' +
    '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function updateTheme(isDark) {
    if (typeof isDark == "string") isDark = isDark == "true";
    if (isDark) html.classList.add("global-dark-theme");
    else html.classList.remove("global-dark-theme");
    try { localStorage.setItem(KEY, isDark); } catch (e) {}
    return isDark;
  }
  function updateButtonSVG(button, themeToSwitchTo) {
    button.innerHTML = "";
    button.insertAdjacentHTML("afterbegin", themeToSwitchTo ? moonIconString : sunIconString);
  }

  var stored = read();
  var initializedAsDark = updateTheme(stored != null ? stored : true);

  var desktop = document.getElementById("desktop-theme-switcher");
  var mobile = document.getElementById("mobile-theme-switcher");
  var buttons = [desktop, mobile].filter(Boolean);
  buttons.forEach(function (b) { updateButtonSVG(b, initializedAsDark); });

  if (desktop) {
    desktop.addEventListener("click", function () {
      var isDark = html.classList.contains("global-dark-theme");
      updateTheme(!isDark);
      buttons.forEach(function (b) { updateButtonSVG(b, !isDark); });
    });
  }
  if (mobile) {
    mobile.addEventListener("click", function () { if (desktop) desktop.click(); });
  }
})();
