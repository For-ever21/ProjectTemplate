/**
 * @description Base64字符串转Blob
 */
export function dataURLtoBlob(base64Buf: string): Blob {
  const arr = base64Buf.split(",");
  const typeItem = arr[0];
  const mime = typeItem!.match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * @description Base64字符串转File格式
 */
export function dataURLtoFile(base64Buf: string, fileName: string): Blob {
  const arr = base64Buf.split(",");
  const typeItem = arr[0];
  const mime = typeItem!.match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, {
    type: mime,
  });
}

/**
 * @description 根据图片URL直接获取到DataUrl
 * @param url 图片url
 * @param imgType 图片类型
 */
export function urlToBase64(url: string, imgType?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let canvas = document.createElement("CANVAS") as Nullable<HTMLCanvasElement>;
    const ctx = canvas!.getContext("2d");

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function() {
      if (!canvas || !ctx) {
        const err = "未获取到canvas对象";
        return reject(err);
      }
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL(imgType || "image/png");
      canvas = null;
      resolve(dataURL);
    };
    img.onerror = function() {
      const error = `${url}该图片加载失败！`;
      reject(error);
    };
    img.src = url;
  });
}
