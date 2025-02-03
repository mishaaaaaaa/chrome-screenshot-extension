chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "captureVisibleTab") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (!tabs.length || !tabs[0].id) {
        sendResponse({ error: "No active tab found" });
        return;
      }

      try {
        const screenshotUrl = await chrome.tabs.captureVisibleTab(
          tabs[0].windowId
        );

        if (chrome.runtime.lastError) {
          console.error("Capture error:", chrome.runtime.lastError.message);
          sendResponse({ error: chrome.runtime.lastError.message });
          return;
        }

        sendResponse({ dataUrl: screenshotUrl });
      } catch (error) {
        console.error("Error capturing visible tab:", error);
        sendResponse({ error: "Failed to capture visible tab" });
      }
    });

    return true;
  }
});
