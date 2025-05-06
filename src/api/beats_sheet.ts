import {
  Beat,
  BeatsSheet,
  BeatsSheetIdea,
  BeatsSheetPreview,
  CreateBeatsSheetForm,
  ExpandBeatForm,
  GenerateBeatsSheetForm,
  GetAllBeatsSheetsParams,
  GetBeatsSheetParams,
  RegenerateBeatForm,
  Token,
} from ".//bindings";
import { apiPath, withAuthHeaders } from ".//common";
import { InternalError, newErrorResponseMessage, NotFoundError, UnauthorizedError, ValidationError } from ".//errors";

import { z } from "zod";

const BEATS_SHEET_PATH = "/beats-sheet";

const BEATS_SHEETS_PATH = "/beats-sheets";

/**
 * Create a new beats sheet for a logline, following a story plan.
 */
export const createBeatsSheet = async (
  token: z.infer<typeof Token>,
  form: z.infer<typeof CreateBeatsSheetForm>
): Promise<z.infer<typeof BeatsSheet>> => {
  const response = await fetch(
    apiPath(BEATS_SHEET_PATH),
    withAuthHeaders(token, {
      method: "PUT",
      body: JSON.stringify(form),
    })
  );

  switch (response.status) {
    case 401:
      throw new UnauthorizedError("invalid credentials");
    case 404:
      throw new NotFoundError("the logline or story plan does not exist");
    case 422:
      throw new ValidationError(await newErrorResponseMessage("create beats sheet", response));
    default:
      if (!response.ok) throw new InternalError(await newErrorResponseMessage("create beats sheet", response));
      return BeatsSheet.parseAsync(await response.json());
  }
};

/**
 * Get a beats sheet.
 */
export const getBeatsSheet = async (
  token: z.infer<typeof Token>,
  params: z.infer<typeof GetBeatsSheetParams>
): Promise<z.infer<typeof BeatsSheet>> => {
  const searchParams = new URLSearchParams();
  searchParams.set("beatsSheetID", params.beatsSheetID);

  const response = await fetch(
    apiPath(BEATS_SHEET_PATH, searchParams),
    withAuthHeaders(token, {
      method: "GET",
    })
  );

  switch (response.status) {
    case 401:
      throw new UnauthorizedError("invalid credentials");
    case 404:
      throw new NotFoundError("the beats sheet does not exist");
    default:
      if (!response.ok) throw new InternalError(await newErrorResponseMessage("get beats sheet", response));
      return BeatsSheet.parseAsync(await response.json());
  }
};

/**
 * Get all beats sheets for the current user.
 */
export const getAllBeatsSheets = async (
  token: z.infer<typeof Token>,
  params: z.infer<typeof GetAllBeatsSheetsParams>
): Promise<z.infer<typeof BeatsSheetPreview>[]> => {
  const searchParams = new URLSearchParams();

  searchParams.set("loglineID", params.loglineID);
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.offset) searchParams.set("offset", params.offset.toString());

  const response = await fetch(
    apiPath(BEATS_SHEETS_PATH, searchParams),
    withAuthHeaders(token, {
      method: "GET",
    })
  );

  switch (response.status) {
    case 401:
      throw new UnauthorizedError("invalid credentials");
    default:
      if (!response.ok) throw new InternalError(await newErrorResponseMessage("get all beats sheets", response));
      return z.array(BeatsSheetPreview).parseAsync(await response.json());
  }
};

/**
 * Generate a new beats sheet for a logline, following a story plan.
 */
export const generateBeatsSheet = async (
  token: z.infer<typeof Token>,
  form: z.infer<typeof GenerateBeatsSheetForm>
): Promise<z.infer<typeof BeatsSheetIdea>> => {
  const response = await fetch(
    apiPath(BEATS_SHEET_PATH + "/generate"),
    withAuthHeaders(token, {
      method: "POST",
      body: JSON.stringify(form),
    })
  );

  switch (response.status) {
    case 401:
      throw new UnauthorizedError("invalid credentials");
    case 404:
      throw new NotFoundError("the logline or story plan does not exist");
    default:
      if (!response.ok) throw new InternalError(await newErrorResponseMessage("generate beats sheet", response));
      return BeatsSheetIdea.parseAsync(await response.json());
  }
};

/**
 * Regenerate the content of specific beats in a beats sheet.
 */
export const regenerateBeats = async (
  token: z.infer<typeof Token>,
  form: z.infer<typeof RegenerateBeatForm>
): Promise<z.infer<typeof BeatsSheet>> => {
  const response = await fetch(
    apiPath(BEATS_SHEET_PATH + "/regenerate"),
    withAuthHeaders(token, {
      method: "PATCH",
      body: JSON.stringify(form),
    })
  );

  switch (response.status) {
    case 401:
      throw new UnauthorizedError("invalid credentials");
    case 404:
      throw new NotFoundError("the beats sheet does not exist");
    default:
      if (!response.ok) throw new InternalError(await newErrorResponseMessage("regenerate beats sheet", response));
      return BeatsSheet.parseAsync(await response.json());
  }
};

/**
 * Add more details to a specific beat in a beats sheet.
 */
export const expandBeat = async (
  token: z.infer<typeof Token>,
  form: z.infer<typeof ExpandBeatForm>
): Promise<z.infer<typeof Beat>> => {
  const response = await fetch(
    apiPath(BEATS_SHEET_PATH + "/expand"),
    withAuthHeaders(token, {
      method: "PATCH",
      body: JSON.stringify(form),
    })
  );

  switch (response.status) {
    case 401:
      throw new UnauthorizedError("invalid credentials");
    case 404:
      throw new NotFoundError("the beats sheet does not exist");
    case 422:
      throw new ValidationError(await newErrorResponseMessage("add details to beat", response));
    default:
      if (!response.ok) throw new InternalError(await newErrorResponseMessage("add details to beat", response));
      return Beat.parseAsync(await response.json());
  }
};
