import { actions } from "./actions";

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action === actions.captureVisibleTab) {
    try {
      const [activeTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      const screenshotUrl = await chrome.tabs.captureVisibleTab(
        activeTab.windowId
      );

      chrome.storage.local.set({ screenshot: screenshotUrl }, () => {
        chrome.tabs.create({ url: "editor.html" });
      });
    } catch (error) {
      console.error("Error capturing visible tab:", error);
    }

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
          reasons: [chrome.offscreen.Reason.DISPLAY_MEDIA],
          justification:
            "Recording from navigator.mediaDevices.getDisplayMedia API",
        });
      }

      chrome.runtime.sendMessage(
        { action: actions.offscreenCaptureScreenWindow },
        async (response) => {
          if (response?.dataUrl) {
            chrome.storage.local.set({ screenshot: response?.dataUrl }, () => {
              chrome.tabs.create({ url: "editor.html" });
            });
          } else {
            console.log(
              "Either user canceled modal or some other error occured during navigator.mediaDevices.getDisplayMedia:",
              response.error
            );
          }
          // finish stream in any case
          await chrome.offscreen.closeDocument().catch((err) => {
            console.warn("Failed to close offscreen document:", err);
          });
        }
      );
    };

    captureScreenWindow();
    return true;
  }
});
