import createFetchClient from "openapi-fetch";
import { paths } from "./gen/schema";
import { AuthStore } from "@/screens/Stores/AuthStore.ts";

const api = {
  onUnauthorized: () => {},
  ...createFetchClient<paths>({
    baseUrl: "http://localhost:8000",
  }),
};

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
    request.headers.set(
      "Authorization",
      "Bearer " + localStorage.getItem(AuthStore.ACCESS_TOKEN),
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
  async onResponse({ response }) {
    if (!response.ok) {
      if (response.status === 401) {
        api.onUnauthorized();
        throw new UnauthorizedError();
      } else if (response.status >= 400 && response.status < 500) {
        const error = await response.clone().json();
        throw new ApiError(error["detail"], response.status);
      } else {
        throw new ApiError(response.statusText, response.status);
      }
    }
  },
});

export { api };
