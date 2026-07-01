const DEFAULT_API_BASE_URL = "http://localhost:4000"

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown> | null
  token?: string | null
}

type ProblemDetails = {
  detail?: string
  title?: string
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export function getApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(
    /\/$/,
    ""
  )
}

export async function apiRequest<TResponse>(
  path: string,
  options: ApiRequestOptions = {}
) {
  const headers = new Headers(options.headers)

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`)
  }

  let body = options.body

  if (body && typeof body === "object" && !(body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
    body = JSON.stringify(body)
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers,
    body,
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`

    try {
      const problem = (await response.json()) as ProblemDetails
      message = problem.detail || problem.title || message
    } catch {
      // Keep the fallback message when the response has no JSON body.
    }

    throw new ApiError(message, response.status)
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  const responseText = await response.text()

  if (!responseText) {
    return undefined as TResponse
  }

  return JSON.parse(responseText) as TResponse
}
