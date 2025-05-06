import { Token } from "./bindings";

import { z } from "zod";

/**
 * AuthPath returns a full url for the auth api.
 */
export const apiPath = (path: string, queryParams?: URLSearchParams): URL => {
  if (!import.meta.env.VITE_STORY_SCHEMATICS_API) {
    throw new Error("VITE_STORY_SCHEMATICS_API is not defined");
  }

  const url = new URL(import.meta.env.VITE_STORY_SCHEMATICS_API + path);

  if (queryParams) {
    url.search = queryParams.toString();
  }

  return url;
};

/**
 * Automatically set the default headers for the auth api.
 */
export const withDefaultHeaders = (init?: RequestInit): RequestInit => {
  return {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  };
};

/**
 * Automatically set the Authorization header with the given token.
 */
export const withAuthHeaders = (token: z.infer<typeof Token>, init?: RequestInit): RequestInit => {
  return withDefaultHeaders({
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...init?.headers },
  });
};
