/** Public API base URL. Safe to import from both server and client modules. */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://fixmate-server-twq6.vercel.app"
    : "http://localhost:5000");

