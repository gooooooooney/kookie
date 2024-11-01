import type { CookieData, ExportConfig } from "~types/cookie"

export async function exportCookies(config: ExportConfig): Promise<CookieData[]> {
  const cookies = await chrome.cookies.getAll({
    url: config.url,
    domain: config.domain
  })
  console.log(cookies)

  // 过滤并格式化 cookie 数据
  return cookies.map(cookie => ({
    name: cookie.name,
    value: cookie.value,
    domain: cookie.domain,
    path: cookie.path,
    secure: cookie.secure,
    httpOnly: cookie.httpOnly,
    sameSite: cookie.sameSite,
    expirationDate: cookie.expirationDate
  }))
}

export async function importCookies(cookies: CookieData[]): Promise<void> {
  for (const cookie of cookies) {
    try {
      await chrome.cookies.set({
        url: `${cookie.secure ? 'https://' : 'http://'}${cookie.domain}${cookie.path}`,
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        sameSite: cookie.sameSite,
        expirationDate: cookie.expirationDate
      })
    } catch (error) {
      console.error(`Error importing cookie ${cookie.name}:`, error)
    }
  }
} 