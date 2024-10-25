import createClient from "openapi-fetch";
import { paths } from "./gen/schema";

const api = createClient<paths>({
  fetch: async (...params) => {
    try {
      return await fetch(...params);
    } catch (error) {
      throw new NetworkError(error);
    }
  },
});

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
  }
}

export class NetworkError extends ApiError {
  constructor(public originalError: unknown) {
    super("Network error", 0);
  }
}

export class UnauthorizedError extends ApiError {
  constructor() {
    super("Unauthorized", 401);
  }
}

api.use({
  async onRequest({ request }) {
    request.headers.set("Authorization", "Bearer token");
  },
  async onResponse({ response }) {
    if (!response.ok) {
      if (response.status === 401) {
        throw new UnauthorizedError();
      } else {
        throw new ApiError(response.statusText, response.status);
      }
    }
  },
});

export { api };
