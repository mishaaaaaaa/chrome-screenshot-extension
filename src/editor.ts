document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("screenshot", (result) => {
    const screenshotUrl = result.screenshot;

    if (screenshotUrl) {
      console.log(screenshotUrl);
      const canvas = document.getElementById(
        "editorCanvas"
      ) as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      const img = new Image();
      img.src = screenshotUrl;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
    } else {
      console.error("Screenshot not found in storage");
    }
  });
});
