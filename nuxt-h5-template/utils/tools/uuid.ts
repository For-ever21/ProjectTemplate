/**
 * @description 生成一个随机的 UUID 数
 */
export function buildUUID(): string {
  const hexList: string[] = [];
  for (let i = 0; i <= 15; i++) {
    hexList[i] = i.toString(16);
  }
  let uuid = "";
  for (let i = 1; i <= 36; i++) {
    if (i === 9 || i === 14 || i === 19 || i === 24) {
      uuid += "-";
    } else if (i === 15) {
      uuid += 4;
    } else if (i === 20) {
      uuid += hexList[(Math.random() * 4) | 8];
    } else {
      uuid += hexList[(Math.random() * 16) | 0];
    }
  }
  return uuid.replace(/-/g, "");
}

/**
 * @description 生成一个随机 带前缀名的 UUID 数
 * @param prefix 追加一个前缀名
 */
export function showUUID(prefix: string): string {
  let unique = 0;
  const time = Date.now();
  const random = Math.floor(Math.random() * 1000000000);
  unique++;
  return prefix + "_" + random + unique + String(time);
}
