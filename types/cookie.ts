export interface CookieData {
  name: string
  value: string
  domain: string
  path: string
  secure: boolean
  httpOnly: boolean
  sameSite: chrome.cookies.SameSiteStatus
  expirationDate?: number
}

export interface ExportConfig {
  url: string
  domain: string
  includeSubdomains: boolean
} 