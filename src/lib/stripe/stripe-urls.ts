export function getStripeReturnBaseUrl(request: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "")
  }

  const requestUrl = new URL(request.url)

  return requestUrl.origin
}
