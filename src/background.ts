import { actions } from "./actions";

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === actions.captureVisibleTab) {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const activeTab = tabs[0];

      if (!activeTab?.id) {
        console.error("No active tab found");
        return;
      }

      try {
        const screenshotUrl = await chrome.tabs.captureVisibleTab(
          activeTab.windowId
        );

        if (chrome.runtime.lastError) {
          console.error("Capture error:", chrome.runtime.lastError.message);
          return;
        }

        chrome.storage.local.set({ screenshot: screenshotUrl }, () => {
          chrome.tabs.create({ url: "editor.html" });
        });
      } catch (error) {
        console.error("Error capturing visible tab:", error);
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
        await chrome.offscreen.createDocument({
          url: "offscreen.html",
          reasons: ["USER_MEDIA"] as any,
          justification: "Recording from chrome.tabCapture API",
        });
      }

      chrome.runtime.sendMessage(
        { action: actions.offscreenCaptureScreenWindow },
        async (response) => {
          if (response?.dataUrl) {
            chrome.storage.local.set({ screenshot: response?.dataUrl }, () => {
              chrome.tabs.create({ url: "editor.html" });
            });

            await chrome.offscreen.closeDocument().catch((err) => {
              console.warn("Failed to close offscreen document:", err);
            });
          } else {
            console.error("Ошибка получения скриншота:", response?.error);
          }
        }
      );
    };

    captureScreenWindow();
    return true;
  }
});

// TODO: HANDLE CANCEL MODAL
// ERROR TRANSLATE
