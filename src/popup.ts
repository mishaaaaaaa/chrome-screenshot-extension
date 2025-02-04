import { actions } from "./actions";

document.getElementById("captureVisibleTab")?.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: actions.captureVisibleTab });
});

document
  .getElementById("captureScreenWindow")
  ?.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: actions.captureScreenWindow });
  });
