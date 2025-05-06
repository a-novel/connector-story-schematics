import {
  CreateStoryPlanForm,
  GetAllStoryPlansParams,
  GetStoryPlanParams,
  StoryPlan,
  StoryPlanPreview,
  Token,
  UpdateStoryPlanForm,
} from ".//bindings";
import { apiPath, withAuthHeaders } from ".//common";
import { InternalError, newErrorResponseMessage, NotFoundError, UnauthorizedError } from ".//errors";

import { z } from "zod";

const STORY_PLAN_PATH = "/story-plan";

const STORY_PLANS_PATH = "/story-plans";

/**
 * Create a new story plan.
 */
export const createStoryPlan = async (
  token: z.infer<typeof Token>,
  form: z.infer<typeof CreateStoryPlanForm>
): Promise<z.infer<typeof StoryPlan>> => {
  const response = await fetch(
    apiPath(STORY_PLAN_PATH),
    withAuthHeaders(token, {
      method: "PUT",
      body: JSON.stringify(form),
    })
  );

  switch (response.status) {
    case 401:
      throw new UnauthorizedError("invalid credentials");
    default:
      if (!response.ok) throw new InternalError(await newErrorResponseMessage("create story plan", response));
      return StoryPlan.parseAsync(await response.json());
  }
};

/**
 * Update a story plan.
 */
export const updateStoryPlan = async (
  token: z.infer<typeof Token>,
  form: z.infer<typeof UpdateStoryPlanForm>
): Promise<z.infer<typeof StoryPlan>> => {
  const response = await fetch(
    apiPath(STORY_PLAN_PATH),
    withAuthHeaders(token, {
      method: "PATCH",
      body: JSON.stringify(form),
    })
  );

  switch (response.status) {
    case 401:
      throw new UnauthorizedError("invalid credentials");
    case 404:
      throw new NotFoundError("story plan not found");
    default:
      if (!response.ok) throw new InternalError(await newErrorResponseMessage("update story plan", response));
      return StoryPlan.parseAsync(await response.json());
  }
};

/**
 * Get a story plan.
 */
export const getStoryPlan = async (
  token: z.infer<typeof Token>,
  params: z.infer<typeof GetStoryPlanParams>
): Promise<z.infer<typeof StoryPlan>> => {
  const queryParams = new URLSearchParams();

  if (params.id) queryParams.set("id", params.id);
  if (params.slug) queryParams.set("slug", params.slug);

  const response = await fetch(
    apiPath(STORY_PLAN_PATH, queryParams),
    withAuthHeaders(token, {
      method: "GET",
    })
  );

  switch (response.status) {
    case 401:
      throw new UnauthorizedError("invalid credentials");
    case 404:
      throw new NotFoundError("story plan not found");
    default:
      if (!response.ok) throw new InternalError(await newErrorResponseMessage("get story plan", response));
      return StoryPlan.parseAsync(await response.json());
  }
};

/**
 * Get all story plans.
 */
export const getAllStoryPlans = async (
  token: z.infer<typeof Token>,
  params: z.infer<typeof GetAllStoryPlansParams>
): Promise<z.infer<typeof StoryPlanPreview>[]> => {
  const queryParams = new URLSearchParams();

  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.offset) queryParams.set("offset", params.offset.toString());

  const response = await fetch(
    apiPath(STORY_PLANS_PATH, queryParams),
    withAuthHeaders(token, {
      method: "GET",
    })
  );

  switch (response.status) {
    case 401:
      throw new UnauthorizedError("invalid credentials");
    default:
      if (!response.ok) throw new InternalError(await newErrorResponseMessage("get all story plans", response));
      return StoryPlanPreview.array().parseAsync(await response.json());
  }
};
