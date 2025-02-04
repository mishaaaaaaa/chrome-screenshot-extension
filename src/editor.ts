import Cropper from "cropperjs";

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("screenshot", (result) => {
    const screenshotUrl = result.screenshot;

    if (screenshotUrl) {
      const imageElement = document.getElementById("image") as HTMLImageElement;
      imageElement.src = screenshotUrl;

      let cropper: any = null; // need to find the Cropper type; complicated cause this let in outer context
      let isCropping = false;

      // Кнопка для скачивания изображения
      document
        .getElementById("downloadButton")
        ?.addEventListener("click", () => {
          const canvas = document.createElement("canvas") as HTMLCanvasElement;
          const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
          const img = new Image();
          img.src = screenshotUrl;

          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL("image/png");

            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = "screenshot.png";
            link.click();
          };
        });

      const cropButton = document.getElementById(
        "cropButton"
      ) as HTMLButtonElement;

      cropButton?.addEventListener("click", () => {
        if (!isCropping) {
          cropper = new Cropper(imageElement, {
            viewMode: 1,
            autoCropArea: 0.5,
            responsive: true,
            zoomable: true,
            scalable: true,
            cropBoxResizable: true,
          });

          cropper.enable();

          isCropping = true;

          cropButton.textContent = "Finish Cropping";
        } else {
          const canvas = cropper.getCroppedCanvas();

          const croppedImageDataUrl = canvas.toDataURL("image/png");

          const link = document.createElement("a");
          link.href = croppedImageDataUrl;
          link.download = "cropped-image.png";
          link.click();

          cropper.destroy();

          isCropping = false;

          cropButton.textContent = "Crop";

          // recover initial image
          imageElement.src = screenshotUrl;
        }
      });
    } else {
      console.error("Screenshot not found in storage");
    }
  });
});
