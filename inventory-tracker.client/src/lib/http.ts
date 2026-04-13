import { env } from "@/config/env";

type RequestOptions = RequestInit & {
  token?: string | null;
};

type ValidationProblem = {
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function buildUrl(path: string) {
  if (!env.apiBaseUrl) {
    return path;
  }

  return `${env.apiBaseUrl}${path}`;
}

function getErrorMessage(payload: unknown, fallbackMessage: string) {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const problem = payload as ValidationProblem;

    if (problem.detail?.trim()) {
      return problem.detail;
    }

    if (problem.title?.trim()) {
      return problem.title;
    }

    if (problem.errors) {
      const firstError = Object.values(problem.errors).flat()[0];

      if (firstError) {
        return firstError;
      }
    }
  }

  return fallbackMessage;
}

export async function request<T>(path: string, options: RequestOptions = {}) {
  const { token, headers, ...rest } = options;
  const hasJsonBody = rest.body && !(rest.body instanceof FormData);
  const response = await fetch(buildUrl(path), {
    ...rest,
    headers: {
      ...(hasJsonBody ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const rawBody = await response.text();
  let payload: unknown = null;

  if (rawBody) {
    try {
      payload = JSON.parse(rawBody) as unknown;
    } catch {
      payload = rawBody;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(
        payload,
        "Something went wrong while talking to the server.",
      ),
      response.status,
    );
  }

  return payload as T;
}

