export async function fetchAuthApi(endpoint: string, options: RequestInit = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  
  // We check if we're in the browser to access localStorage
  let token = null
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || localStorage.getItem('accessToken')
  }

  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  // We might want to return the raw response if it's not JSON, but let's assume JSON for now
  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('accessToken')
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
    }
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || `API Error: ${res.statusText}`)
  }

  return res.json()
}
