chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "captureVisibleTab") {
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

  if (message.action === "captureScreenWindow") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const activeTab = tabs[0];
      console.log(activeTab);
      console.log(tabs);

      const existingContexts = await chrome.runtime.getContexts({});
      let recording = false;

      const offscreenDocument = existingContexts.find(
        (c) => c.contextType === "OFFSCREEN_DOCUMENT"
      );

      if (!offscreenDocument) {
        // Create an offscreen document.
        await chrome.offscreen.createDocument({
          url: "offscreen.html",
          reasons: ["USER_MEDIA"] as any,
          justification: "Recording from chrome.tabCapture API",
        });
      } else {
        if (offscreenDocument.documentUrl)
          recording = offscreenDocument.documentUrl.endsWith("#recording");
      }

      if (recording) {
        chrome.runtime.sendMessage({
          type: "stop-recording",
          target: "offscreen",
        });
        // chrome.action.setIcon({ path: "icons/not-recording.png" });
        return;
      }

      // Get a MediaStream for the active tab.

      await chrome.tabCapture.getMediaStreamId(
        {
          targetTabId: activeTab.id,
        },
        (streamIdx) => {
          chrome.runtime.sendMessage({
            type: "start-recording",
            target: "offscreen",
            data: streamIdx,
          });
        }
      );

      // Send the stream ID to the offscreen document to start recording.
    });

    return true; // Required to use sendResponse asynchronously
  }
});
