"use client";

import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";
import { API_URL } from "./config";

export { API_URL };

/**
 * BetterAuth browser client. The JWT plugin lets this app call the Express API
 * with an `Authorization: Bearer <token>` header.
 */
export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [jwtClient()],
});
