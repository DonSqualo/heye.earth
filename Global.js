const themeSwitcherContainer = document.createElement("div");
themeSwitcherContainer.classList.add("lp-theme-switcher");
const themeSwitcherButton = document.createElement("a");
themeSwitcherButton.id="desktop-theme-switcher";
themeSwitcherContainer.appendChild(themeSwitcherButton);

const themeSwitcherButtons = [themeSwitcherButton];

const sunIconString = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun">
  <circle cx="12" cy="12" r="5">
  </circle>
  <line x1="12" y1="1" x2="12" y2="3">
  </line>
  <line x1="12" y1="21" x2="12" y2="23">
  </line>
  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64">
  </line>
  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78">
  </line>
  <line x1="1" y1="12" x2="3" y2="12">
  </line>
  <line x1="21" y1="12" x2="23" y2="12">
  </line>
  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36">
  </line>
  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22">
  </line>
</svg>`;

const moonIconString = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon">
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
</svg>`;

const IS_USER_THEME_PREFERENCE_DARK_LOCAL_STORAGE_KEY = "heyeEarthUserThemPreference";

let runUntilHtmlLoaded = setInterval(() => {
  if(document.querySelector(".notion-navbar")){
    const navbarFirstChild = document.querySelector(".notion-navbar").querySelector("div");
    navbarFirstChild.parentNode.insertBefore(themeSwitcherContainer, navbarFirstChild.nextSibling);

    themeSwitcherButton.addEventListener("click", e => {
      var isDark = document.querySelector("html").classList.contains("global-dark-theme");
      updateTheme(!isDark);

      if(themeSwitcherButtons.length <= 1){
        const mobileThemeSwitcher = document.querySelector("#mobile-theme-switcher");
        if(mobileThemeSwitcher){
          themeSwitcherButtons.push(mobileThemeSwitcher);
        }
      }
      themeSwitcherButtons.forEach(button => {
        updateButtonSVG(button, !isDark);
      });
    });
    clearInterval(runUntilHtmlLoaded);
  }
}, 100);

const valueFromStorage = localStorage.getItem(IS_USER_THEME_PREFERENCE_DARK_LOCAL_STORAGE_KEY);
console.log("valueFromStorage",valueFromStorage);
//default dark theme if user has not intentionally set it to light mode
const initializedAsDark = updateTheme(valueFromStorage != null ? valueFromStorage : /*(window.matchMedia('(prefers-color-scheme: dark)').matches)*/ true);
setTimeout(() => {
  if(themeSwitcherButtons.length <= 1){
    const mobileThemeSwitcher = document.querySelector("#mobile-theme-switcher");
    if(mobileThemeSwitcher){
      themeSwitcherButtons.push(mobileThemeSwitcher);
    }
  }
  themeSwitcherButtons.forEach(button => {
    updateButtonSVG(button, initializedAsDark);
  });
}, 1);

function updateTheme(isDark){
  console.log(isDark);
  if(typeof isDark =="string"){
    isDark = isDark == "true";
  }

  if(isDark == true){
    document.querySelector("html").classList.add("global-dark-theme");
  }
  else if(isDark == false){
    document.querySelector("html").classList.remove("global-dark-theme");
  }

  localStorage.setItem(IS_USER_THEME_PREFERENCE_DARK_LOCAL_STORAGE_KEY, isDark);

  return isDark;
}
function updateButtonSVG(button, themeToSwitchTo){
  button.innerHTML = '';
  if(themeToSwitchTo == true) {
    button.insertAdjacentHTML('afterbegin', moonIconString);
  }
  else {
    button.insertAdjacentHTML('afterbegin', sunIconString);
  }
}