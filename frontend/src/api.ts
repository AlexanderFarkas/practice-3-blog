import createClient from "openapi-fetch";
import { paths } from "./gen/schema";

const api = createClient<paths>({});
api.use({
  async onRequest({ request }) {
    request.headers.set("Authorization", "Bearer token");
  },
});

export { api };
