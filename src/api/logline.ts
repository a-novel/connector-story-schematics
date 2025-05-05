import {
  CreateLoglineForm,
  GenerateLoglinesForm,
  GetAllLoglinesParams,
  GetLoglineParams,
  Logline,
  LoglineIdea,
  LoglinePreview,
  Token,
} from "@/api/bindings";
import { apiPath, withAuthHeaders } from "@/api/common";
import { InternalError, newErrorResponseMessage, NotFoundError, UnauthorizedError } from "@/api/errors";

import { z } from "zod";

const LOGLINE_PATH = "/logline";

const LOGLINES_PATH = "/loglines";

/**
 * Create a new logline for a user.
 */
export const createLogline = async (
  token: z.infer<typeof Token>,
  form: z.infer<typeof CreateLoglineForm>
): Promise<z.infer<typeof Logline>> => {
  const response = await fetch(
    apiPath(LOGLINE_PATH),
    withAuthHeaders(token, {
      method: "PUT",
      body: JSON.stringify(form),
    })
  );

  switch (response.status) {
    case 401:
      throw new UnauthorizedError("invalid credentials");
    default:
      if (!response.ok) throw new InternalError(await newErrorResponseMessage("create logline", response));
      return Logline.parseAsync(await response.json());
  }
};

/**
 * Get a logline.
 */
export const getLogline = async (
  token: z.infer<typeof Token>,
  params: z.infer<typeof GetLoglineParams>
): Promise<z.infer<typeof Logline>> => {
  const searchParams = new URLSearchParams();

  if (params.id) searchParams.set("id", params.id);
  if (params.slug) searchParams.set("slug", params.slug);

  const response = await fetch(
    apiPath(LOGLINE_PATH, searchParams),
    withAuthHeaders(token, {
      method: "GET",
    })
  );

  switch (response.status) {
    case 401:
      throw new UnauthorizedError("invalid credentials");
    case 404:
      throw new NotFoundError("logline not found");
    default:
      if (!response.ok) throw new InternalError(await newErrorResponseMessage("get logline", response));
      return Logline.parseAsync(await response.json());
  }
};

/**
 * Get all loglines for the current user.
 */
export const getAllLoglines = async (
  token: z.infer<typeof Token>,
  params: z.infer<typeof GetAllLoglinesParams>
): Promise<z.infer<typeof LoglinePreview>[]> => {
  const searchParams = new URLSearchParams();

  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.offset) searchParams.set("offset", params.offset.toString());

  const response = await fetch(
    apiPath(LOGLINES_PATH, searchParams),
    withAuthHeaders(token, {
      method: "GET",
    })
  );

  switch (response.status) {
    case 401:
      throw new UnauthorizedError("invalid credentials");
    default:
      if (!response.ok) throw new InternalError(await newErrorResponseMessage("get loglines", response));
      return LoglinePreview.array().parseAsync(await response.json());
  }
};

/**
 * Generate new loglines for a user.
 */
export const generateLoglines = async (
  token: z.infer<typeof Token>,
  form: z.infer<typeof GenerateLoglinesForm>
): Promise<z.infer<typeof LoglineIdea>[]> => {
  const response = await fetch(
    apiPath(LOGLINES_PATH + "/generate"),
    withAuthHeaders(token, {
      method: "POST",
      body: JSON.stringify(form),
    })
  );

  switch (response.status) {
    case 401:
      throw new UnauthorizedError("invalid credentials");
    default:
      if (!response.ok) throw new InternalError(await newErrorResponseMessage("generate loglines", response));
      return LoglineIdea.array().parseAsync(await response.json());
  }
};

/**
 * Add more details to a logline idea.
 */
export const expandLogline = async (
  token: z.infer<typeof Token>,
  form: z.infer<typeof LoglineIdea>
): Promise<z.infer<typeof LoglineIdea>> => {
  const response = await fetch(
    apiPath(LOGLINE_PATH + "/expand"),
    withAuthHeaders(token, {
      method: "POST",
      body: JSON.stringify(form),
    })
  );

  switch (response.status) {
    case 401:
      throw new UnauthorizedError("invalid credentials");
    default:
      if (!response.ok) throw new InternalError(await newErrorResponseMessage("expand logline", response));
      return LoglineIdea.parseAsync(await response.json());
  }
};
