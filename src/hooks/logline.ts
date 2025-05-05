import {
  createLogline,
  CreateLoglineForm,
  expandLogline,
  generateLoglines,
  GenerateLoglinesForm,
  getAllLoglines,
  getLogline,
  InternalError,
  isInternalError,
  LoglineIdea,
  NotFoundError,
  UnauthorizedError,
} from "@/api";
import { InfiniteQueryAPI, MutationAPI, QueryAPI } from "@/hooks/common";

import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";

const BASE_PARAMS = ["story-schematics service", "logline"] as const;

const createLoglineMutationKey = [...BASE_PARAMS, "create"];

export const CreateLogline: MutationAPI<
  [accessToken: string],
  Awaited<ReturnType<typeof createLogline>>,
  UnauthorizedError | InternalError,
  z.infer<typeof CreateLoglineForm>
> = {
  key: createLoglineMutationKey,
  useAPI: (accessToken) =>
    useMutation({
      mutationFn: (form) => createLogline(accessToken, form),
      mutationKey: createLoglineMutationKey,
    }),
};

const getLoglineQueryKey = (...params: Parameters<typeof getLogline>) => [
  ...BASE_PARAMS,
  "get",
  params[1],
  { token: params[0] },
];

export const GetLogline: QueryAPI<
  Parameters<typeof getLogline>,
  Awaited<ReturnType<typeof getLogline>>,
  UnauthorizedError | NotFoundError | InternalError
> = {
  key: getLoglineQueryKey,
  useAPI: (...params) =>
    useQuery({
      queryKey: getLoglineQueryKey(...params),
      queryFn: () => getLogline(...params),
      retry: (_, error) => isInternalError(error),
      enabled: !!params[0] && (!!params[1].id || !!params[1].slug),
    }),
};

const getAllLoglinesQueryKey = (...params: Parameters<typeof getAllLoglines>) => [
  ...BASE_PARAMS,
  "get all",
  params[1],
  { token: params[0] },
];

const DEFAULT_LIST_LOGLINES_LIMIT = 100;

export const GetAllLoglines: InfiniteQueryAPI<
  [...Parameters<typeof getAllLoglines>, { maxPages?: number }?],
  { pages: Awaited<ReturnType<typeof getAllLoglines>>[] },
  UnauthorizedError | InternalError
> = {
  key: getAllLoglinesQueryKey,
  useAPI: (accessToken, params, options) =>
    useInfiniteQuery({
      queryKey: getAllLoglinesQueryKey(accessToken, params),
      queryFn: ({ pageParam = 0 }) => getAllLoglines(accessToken, { ...params, offset: pageParam }),
      initialPageParam: params.offset,
      getNextPageParam: (lastPage, _allPages, lastPageParam) =>
        lastPage.length > 0 ? (lastPageParam ?? 0) + lastPage.length : undefined,
      getPreviousPageParam: (_firstPage, _allPages, firstPageParam) =>
        (firstPageParam ?? 0) > 0
          ? Math.max(0, (firstPageParam ?? 0) - (params.limit ?? DEFAULT_LIST_LOGLINES_LIMIT))
          : undefined,
      enabled: !!accessToken,
      maxPages: options?.maxPages,
    }),
};

const generateLoglinesMutationKey = [...BASE_PARAMS, "generate"];

export const GenerateLoglines: MutationAPI<
  [accessToken: string],
  Awaited<ReturnType<typeof generateLoglines>>,
  UnauthorizedError | InternalError,
  z.infer<typeof GenerateLoglinesForm>
> = {
  key: generateLoglinesMutationKey,
  useAPI: (accessToken) =>
    useMutation({
      mutationFn: (form) => generateLoglines(accessToken, form),
      mutationKey: generateLoglinesMutationKey,
    }),
};

const expandLoglineMutationKey = [...BASE_PARAMS, "expand"];

export const ExpandLogline: MutationAPI<
  [accessToken: string],
  Awaited<ReturnType<typeof expandLogline>>,
  UnauthorizedError | InternalError,
  z.infer<typeof LoglineIdea>
> = {
  key: expandLoglineMutationKey,
  useAPI: (accessToken) =>
    useMutation({
      mutationFn: (form) => expandLogline(accessToken, form),
      mutationKey: expandLoglineMutationKey,
    }),
};
