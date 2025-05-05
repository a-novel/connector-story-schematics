import {
  createStoryPlan,
  CreateStoryPlanForm,
  getAllStoryPlans,
  getStoryPlan,
  InternalError,
  isInternalError,
  NotFoundError,
  UnauthorizedError,
  updateStoryPlan,
  UpdateStoryPlanForm,
} from "@/api";
import { InfiniteQueryAPI, MutationAPI, QueryAPI } from "@/hooks/common";

import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";

const BASE_PARAMS = ["story-schematics service", "story plan"] as const;

const createStoryPlanMutationKey = [...BASE_PARAMS, "create"] as const;

export const CreateStoryPlan: MutationAPI<
  [accessToken: string],
  Awaited<ReturnType<typeof createStoryPlan>>,
  UnauthorizedError | InternalError,
  z.infer<typeof CreateStoryPlanForm>
> = {
  key: createStoryPlanMutationKey,
  useAPI: (accessToken) =>
    useMutation({
      mutationFn: (form) => createStoryPlan(accessToken, form),
      mutationKey: createStoryPlanMutationKey,
    }),
};

const updateStoryPlanMutationKey = [...BASE_PARAMS, "update"] as const;

export const UpdateStoryPlan: MutationAPI<
  [accessToken: string],
  Awaited<ReturnType<typeof updateStoryPlan>>,
  UnauthorizedError | NotFoundError | InternalError,
  z.infer<typeof UpdateStoryPlanForm>
> = {
  key: updateStoryPlanMutationKey,
  useAPI: (accessToken) =>
    useMutation({
      mutationFn: (form) => updateStoryPlan(accessToken, form),
      mutationKey: updateStoryPlanMutationKey,
    }),
};

const getStoryPlanQueryKey = (...params: Parameters<typeof getStoryPlan>) => [
  ...BASE_PARAMS,
  "get",
  params[1],
  { token: params[0] },
];

export const GetStoryPlan: QueryAPI<
  Parameters<typeof getStoryPlan>,
  Awaited<ReturnType<typeof getStoryPlan>>,
  UnauthorizedError | NotFoundError | InternalError
> = {
  key: getStoryPlanQueryKey,
  useAPI: (...params) =>
    useQuery({
      queryKey: getStoryPlanQueryKey(...params),
      queryFn: () => getStoryPlan(...params),
      retry: (_, error) => isInternalError(error),
      enabled: !!params[0] && (!!params[1].id || !!params[1].slug),
    }),
};

const getAllStoryPlansQueryKey = (...params: Parameters<typeof getAllStoryPlans>) => [
  ...BASE_PARAMS,
  "get all",
  params[1],
  { token: params[0] },
];

const DEFAULT_LIST_STORY_PLANS_LIMIT = 100;

export const GetAllStoryPlans: InfiniteQueryAPI<
  [...Parameters<typeof getAllStoryPlans>, { maxPages?: number }?],
  { pages: Awaited<ReturnType<typeof getAllStoryPlans>>[] },
  UnauthorizedError | InternalError
> = {
  key: getAllStoryPlansQueryKey,
  useAPI: (accessToken, params, options) =>
    useInfiniteQuery({
      queryKey: getAllStoryPlansQueryKey(accessToken, params),
      queryFn: ({ pageParam = 0 }) => getAllStoryPlans(accessToken, { ...params, offset: pageParam }),
      initialPageParam: params.offset,
      getNextPageParam: (lastPage, _allPages, lastPageParam) =>
        lastPage.length > 0 ? (lastPageParam ?? 0) + lastPage.length : undefined,
      getPreviousPageParam: (_firstPage, _allPages, firstPageParam) =>
        (firstPageParam ?? 0) > 0
          ? Math.max(0, (firstPageParam ?? 0) - (params.limit ?? DEFAULT_LIST_STORY_PLANS_LIMIT))
          : undefined,
      enabled: !!accessToken,
      maxPages: options?.maxPages,
    }),
};
