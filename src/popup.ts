document.getElementById("captureVisibleTab")?.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "captureVisibleTab" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Error sending message:", chrome.runtime.lastError.message);
      return;
    }

    if (response?.error) {
      console.error("Error capturing screenshot:", response.error);
      return;
    }

    if (response?.dataUrl) {
      console.log("Captured dataUrl:", response.dataUrl);

      // Открываем editor.html и передаем скриншот через URL параметр
      chrome.tabs.create({
        url: `editor.html?screenshot=${encodeURIComponent(response.dataUrl)}`,
      });
    } else {
      console.error("No dataUrl received in popup.ts");
    }
  });
});

// document
//   .getElementById("captureScreenWindow")
//   ?.addEventListener("click", () => {
//     chrome.runtime.sendMessage(
//       { action: "captureScreenWindow" },
//       (response) => {
//         if (chrome.runtime.lastError) {
//           console.error("Error:", chrome.runtime.lastError.message);
//           return;
//         }

//         if (response?.error) {
//           console.error("Capture error:", response.error);
//           return;
//         }

//         if (response?.dataUrl) {
//           chrome.tabs.create({
//             url: `editor.html?screenshot=${encodeURIComponent(
//               response.dataUrl
//             )}`,
//           });
//         }
//       }
//     );
//   });

document
  .getElementById("captureScreenWindow")
  ?.addEventListener("click", () => {
    chrome.runtime.sendMessage(
      { action: "captureScreenWindow", tab: chrome.tabs },
      (response) => {}
    );
  });
