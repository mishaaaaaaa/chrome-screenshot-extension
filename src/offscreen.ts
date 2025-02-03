import { actions } from "./actions";

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action === actions.offscreemCaptureScreenWindow) {
    await takeScreenshot();
  }
});

async function takeScreenshot() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    const video = document.createElement("video");
    video.srcObject = stream;
    video.play();

    await new Promise((resolve) => (video.onloadedmetadata = resolve));

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    stream.getTracks().forEach((track) => track.stop());

    canvas.toBlob((blob) => {
      const screenshotUrl = URL.createObjectURL(blob as Blob);
      window.open(screenshotUrl, "_blank");
    }, "image/png");
  } catch (error) {
    console.error("Ошибка при создании скриншота:", error);
  }
}
