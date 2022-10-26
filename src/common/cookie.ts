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

export function setCookie(
  name: string,
  value: string,
  options?: {
    expires?: Date;
    path?: string;
    domain?: string;
    secure?: boolean;
  }
) {
  const { expires, path, domain, secure } = {
    path: '/',
    secure: true,
    ...options,
  };
  let cookieString = `${name}=${value}`;
  if (expires) cookieString += `;expires=${expires.toUTCString()}`;
  if (path) cookieString += `;path=${path}`;
  if (domain) cookieString += `;domain=${domain}`;
  if (secure) cookieString += ';secure';
  document.cookie = cookieString;
}

export function clearCookie(
  name: string,
  options?: Omit<Parameters<typeof setCookie>[2], 'expires'>
) {
  setCookie(name, '', {
    ...options,
    expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT'),
  });
}
