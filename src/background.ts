import { actions } from "./actions";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === actions.captureVisibleTab) {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const activeTab = tabs[0];

      if (!activeTab?.id) {
        sendResponse({ error: "No active tab found" });
        return;
      }

      try {
        const screenshotUrl = await chrome.tabs.captureVisibleTab(
          activeTab.windowId
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

  if (message.action === actions.captureScreenWindow) {
    const captureScreenWindow = async () => {
      const existingContexts = await chrome.runtime.getContexts({});

      const offscreenDocument = existingContexts.find(
        (c) => c.contextType === "OFFSCREEN_DOCUMENT"
      );

      if (!offscreenDocument) {
        // Create an offscreen document.
        await chrome.offscreen.createDocument({
          url: "offscreen.html",
          reasons: ["USER_MEDIA"] as any, // DISPLAY_MEDIA
          justification: "Recording from chrome.tabCapture API",
        });
      }

      chrome.runtime.sendMessage({
        action: actions.offscreemCaptureScreenWindow,
      });
    };

    captureScreenWindow();

    return true; // Required to use sendResponse asynchronously
  }
});
