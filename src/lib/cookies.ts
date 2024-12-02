class CookieStore {
  constructor(cookies) {
    this.cookies = cookies;
    this.set = cookies.set;
  }
  get(key) {
    const value = this.cookies.get(key);
    return { name: key, value };
  }
}

export default function getCookieStore(cookies): CookieStore {
  return new CookieStore(cookies);
}
