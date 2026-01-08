import {
  APIError,
  AuthenticationError,
  RateLimitError,
  ServerError,
} from "./errors";

// ============================================
// Types
// ============================================

export interface RequestConfig {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
}

export interface RequestInterceptor {
  onRequest: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
}

export interface ResponseInterceptor {
  onResponse: (response: Response) => Response | Promise<Response>;
  onError?: (error: Error) => Error | Promise<Error>;
}

// ============================================
// API Client Class
// ============================================

class APIClient {
  private baseURL: string;
  private defaultTimeout: number;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor(baseURL = "", timeout = 30_000) {
    this.baseURL = baseURL;
    this.defaultTimeout = timeout;
  }

  /**
   * Add request interceptor (e.g., for auth headers)
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor (e.g., for error handling)
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Execute request with interceptors
   */
  async request<T>(config: RequestConfig): Promise<T> {
    // Apply request interceptors
    let finalConfig = config;
    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor.onRequest(finalConfig);
    }

    const {
      endpoint,
      method = "GET",
      body,
      headers = {},
      timeout,
      signal,
    } = finalConfig;
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${this.baseURL}${endpoint}`;

    // Create timeout controller
    const timeoutMs = timeout ?? this.defaultTimeout;
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

    // Merge signals
    const mergedSignal = signal
      ? this.mergeAbortSignals(signal, abortController.signal)
      : abortController.signal;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include",
        signal: mergedSignal,
      });

      clearTimeout(timeoutId);

      // Apply response interceptors
      let finalResponse = response;
      for (const interceptor of this.responseInterceptors) {
        finalResponse = await interceptor.onResponse(finalResponse);
      }

      // Handle error responses
      if (!finalResponse.ok) {
        await this.handleErrorResponse(finalResponse, endpoint);
      }

      return finalResponse.json();
    } catch (error) {
      clearTimeout(timeoutId);

      // Apply error interceptors
      let finalError = error as Error;
      for (const interceptor of this.responseInterceptors) {
        if (interceptor.onError) {
          finalError = await interceptor.onError(finalError);
        }
      }

      throw finalError;
    }
  }

  /**
   * Handle HTTP error responses
   */
  private async handleErrorResponse(
    response: Response,
    endpoint: string
  ): Promise<never> {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));

    switch (response.status) {
      case 401:
        throw new AuthenticationError(endpoint);
      case 429: {
        const retryAfter = response.headers.get("Retry-After");
        throw new RateLimitError(
          endpoint,
          retryAfter ? Number.parseInt(retryAfter) : undefined
        );
      }
      case 500:
      case 502:
      case 503:
      case 504:
        throw new ServerError(
          errorData.error || "Server error",
          response.status,
          endpoint
        );
      default:
        throw new APIError(
          errorData.error || `HTTP ${response.status}`,
          response.status,
          endpoint
        );
    }
  }

  /**
   * Merge multiple AbortSignals
   */
  private mergeAbortSignals(...signals: AbortSignal[]): AbortSignal {
    const controller = new AbortController();

    for (const signal of signals) {
      if (signal.aborted) {
        controller.abort();
        break;
      }

      signal.addEventListener("abort", () => controller.abort(), {
        once: true,
      });
    }

    return controller.signal;
  }
}

// ============================================
// Singleton Instance
// ============================================

export const apiClient = new APIClient("", 30_000);

// Add auth interceptor (cookies are handled automatically)
apiClient.addRequestInterceptor({
  onRequest: async (config) => {
    // Auth headers are handled by cookies (credentials: 'include')
    // This interceptor is for future extensibility
    return config;
  },
});

// Add error interceptor for dev logging
if (import.meta.env.DEV) {
  apiClient.addResponseInterceptor({
    onResponse: (response) => {
      console.log(`[API] ${response.status} ${response.url}`);
      return response;
    },
    onError: (error) => {
      console.error("[API] Request failed:", error);
      return error;
    },
  });
}
