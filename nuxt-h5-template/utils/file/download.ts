/**
 * @description 根据文件地址 进行下载文件
 * @param url 下载链接
 * @param target 链接请求方式 默认为 _blank
 * @param fileName 文件名
 */
export function downloadByUrl({
  url,
  target = "_blank",
  fileName,
}: {
  url: string;
  target?: TargetContext;
  fileName?: string;
}): boolean {
  const isChrome = window.navigator.userAgent.toLowerCase().includes("chrome");
  const isSafari = window.navigator.userAgent.toLowerCase().includes("safari");

  if (/(iP)/g.test(window.navigator.userAgent)) {
    console.error("Your browser does not support download!");
    return false;
  }
  if (isChrome || isSafari) {
    const link = document.createElement("a");
    link.href = url;
    link.target = target;

    if (link.download !== undefined) {
      link.download = fileName || url.substring(url.lastIndexOf("/") + 1, url.length);
    }

    if (document.createEvent) {
      const e = document.createEvent("MouseEvents");
      e.initEvent("click", true, true);
      link.dispatchEvent(e);
      return true;
    }
  }
  if (!url.includes("?")) {
    url += "?download";
  }

  window.open(url, target);
  return true;
}
