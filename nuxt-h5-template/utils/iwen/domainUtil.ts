namespace DomainUtil {
  export const useList = [
    "991kang.com",
    "wenwo.com",
    "health.sina.cn",
    "b.health.sina.cn chspu.com",
  ];
  export function inUseList(url: string) {
    return [document.domain, ...useList].some((domain) => url.includes(domain));
  }
}
export default DomainUtil;
