import { actions } from "./actions";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === actions.offscreenCaptureScreenWindow) {
    takeScreenshot(sendResponse);
    return true;
  }
});

async function takeScreenshot(
  sendResponse: (response: { dataUrl?: string; error?: string }) => void
) {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    const video = document.createElement("video");
    video.srcObject = stream;
    video.play();

    await new Promise((resolve) => (video.onloadedmetadata = resolve));

    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    stream.getTracks().forEach((track) => track.stop());

    const dataUrl = canvas.toDataURL("image/png");

    sendResponse({ dataUrl });
  } catch (error: any) {
    sendResponse({ error });
  }
}
