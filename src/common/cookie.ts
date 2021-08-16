export function getCookie(key: string) {
  const cookie = document.cookie
    .split(';')
    .map((kv) => kv.trim().split('='))
    .find(([k, _v]) => k.trim() === key);
  if (cookie) {
    return cookie[1];
  } else {
    return undefined;
  }
}
