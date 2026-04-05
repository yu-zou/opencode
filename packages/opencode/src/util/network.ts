export function online() {
  const nav = globalThis.navigator
  if (!nav || typeof nav.onLine !== "boolean") return true
  return nav.onLine
}

export function proxy() {
  const val = (
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.ALL_PROXY ||
    process.env.all_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy
  )
  if (!val || val.trim() === "") return undefined
  return val
}

export function noproxy() {
  const val = process.env.NO_PROXY || process.env.no_proxy
  if (!val || val.trim() === "") return undefined
  return val
}

export function proxied() {
  return !!proxy()
}
