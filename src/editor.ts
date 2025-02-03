document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const screenshotUrl = urlParams.get("screenshot");

  if (screenshotUrl) {
    const canvas = document.getElementById("editorCanvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const img = new Image();
      img.src = screenshotUrl;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
    }
  }

  document.getElementById("downloadButton")?.addEventListener("click", () => {
    const canvas = document.getElementById("editorCanvas") as HTMLCanvasElement;
    const link = document.createElement("a");
    link.download = "screenshot.png";
    link.href = canvas.toDataURL();
    link.click();
  });
});
