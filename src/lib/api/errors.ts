export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public endpoint: string,
    public response?: unknown
  ) {
    super(message);
    this.name = "APIError";
  }
}

export class NetworkError extends Error {
  constructor(
    message: string,
    public endpoint: string
  ) {
    super(message);
    this.name = "NetworkError";
  }
}

export class AuthenticationError extends APIError {
  constructor(endpoint: string) {
    super("Authentication required", 401, endpoint);
    this.name = "AuthenticationError";
  }
}

export class RateLimitError extends APIError {
  constructor(
    endpoint: string,
    public retryAfter?: number
  ) {
    super("Rate limit exceeded", 429, endpoint);
    this.name = "RateLimitError";
  }
}

export class ServerError extends APIError {
  constructor(message: string, statusCode: number, endpoint: string) {
    super(message, statusCode, endpoint);
    this.name = "ServerError";
  }
}
