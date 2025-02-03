chrome.runtime.onMessage.addListener(async (message) => {
  console.log("hello from offscreen");
  if (message.target === "offscreen") {
    switch (message.type) {
      case "start-recording":
        await takeScreenshot();
        break;
      default:
        throw new Error("Unrecognized message:", message.type);
    }
  }
});

let recorder;
let data = [];

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

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    stream.getTracks().forEach((track) => track.stop());

    canvas.toBlob((blob) => {
      const screenshotUrl = URL.createObjectURL(blob);
      window.open(screenshotUrl, "_blank");
    }, "image/png");
  } catch (error) {
    console.error("Ошибка при создании скриншота:", error);
  }
}

async function stopRecording() {
  if (recorder && recorder.state === "recording") {
    recorder.stop();
    recorder.stream.getTracks().forEach((t) => t.stop());
    window.location.hash = "";
  }
}
