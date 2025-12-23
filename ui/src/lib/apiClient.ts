let isRefreshing = false
let refreshPromise: Promise<void> | null = null

type ApiError = {
  status: number
  message: string
}

async function refreshToken() {
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true

  refreshPromise = fetch("/auth/refresh", {
    method: "POST",
    credentials: "include",
  }).then(res => {
    if (!res.ok) {
      throw new Error("Refresh failed")
    }
  }).finally(() => {
    isRefreshing = false
    refreshPromise = null
  })

  return refreshPromise
}

export async function api<T>(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  })

  // ✅ success
  if (res.ok) {
    return res.status === 204 ? (null as T) : res.json()
  }

  // 🔁 access token expired → refresh
  if (res.status === 401) {
    try {
      await refreshToken()

      // retry original request
      const retryRes = await fetch(input, {
        ...init,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...init.headers,
        },
      })

      if (!retryRes.ok) {
        throw new Error("Retry failed")
      }

      return retryRes.status === 204 ? (null as T) : retryRes.json()
    } catch {
      throw {
        status: 401,
        message: "Session expired",
      } satisfies ApiError
    }
  }

  // ❌ other errors
  const errorBody = await res.json().catch(() => null)

  throw {
    status: res.status,
    message: errorBody?.message || "Request failed",
  } satisfies ApiError
}

export const apiClient = {
  get: <T>(url: string, init?: RequestInit) =>
    api<T>(url, { ...init, method: "GET" }),

  post: <T>(url: string, body?: any, init?: RequestInit) =>
    api<T>(url, {
      ...init,
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(url: string, body?: any, init?: RequestInit) =>
    api<T>(url, {
      ...init,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: <T>(url: string, init?: RequestInit) =>
    api<T>(url, { ...init, method: "DELETE" }),
}
