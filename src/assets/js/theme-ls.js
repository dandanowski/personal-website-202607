const LOCAL_STORAGE_KEY_THEME = "theme";
const THEME_VALUE_AUTO = "auto";
const THEME_VALUE_DARK = "dark";
const THEME_VALUE_LIGHT = "light";

setThemeFromLocalStorageOrMediaPreference();
// Runs on initial page load. Add change listeners to light/dark
// toggles that set a local storage key and trigger a theme change.
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#theme-toggle input").forEach((toggle) => {
    toggle.addEventListener(
      "change",
      (e) => {
        if (e.target.checked) {
          if (e.target.value == THEME_VALUE_AUTO) {
            localStorage.removeItem(LOCAL_STORAGE_KEY_THEME);
          } else {
            localStorage.setItem(LOCAL_STORAGE_KEY_THEME, e.target.value);
          }
        }
        setThemeFromLocalStorageOrMediaPreference();
      },
      false
    );
  });
});

window.addEventListener("storage", (e) => {
  if (e.key == LOCAL_STORAGE_KEY_THEME) {
    setThemeFromLocalStorageOrMediaPreference();
  }
});

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    setThemeFromLocalStorageOrMediaPreference();
  });

// Sets light or dark mode based on a preference from local
// storage, or if none is set there, sets based on preference
// from the `prefers-color-scheme` CSS media selector.
function setThemeFromLocalStorageOrMediaPreference() {
  const theme =
    localStorage.getItem(LOCAL_STORAGE_KEY_THEME) || THEME_VALUE_AUTO;

  switch (theme) {
    case THEME_VALUE_AUTO:
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.style.colorScheme = "dark";
      } else {
        document.documentElement.style.colorScheme = "light";
      }
      break;

    case THEME_VALUE_DARK:
      document.documentElement.style.colorScheme = "dark";
      break;

    case THEME_VALUE_LIGHT:
      document.documentElement.style.colorScheme = "light";
      break;
  }

  document
    .querySelectorAll(`#theme-toggle input[value='${theme}']`)
    .forEach(function (toggle) {
      toggle.checked = true;
    });
}
