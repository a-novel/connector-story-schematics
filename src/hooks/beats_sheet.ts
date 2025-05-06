import {
  createBeatsSheet,
  CreateBeatsSheetForm,
  expandBeat,
  ExpandBeatForm,
  generateBeatsSheet,
  GenerateBeatsSheetForm,
  getAllBeatsSheets,
  getBeatsSheet,
  InternalError,
  isInternalError,
  NotFoundError,
  RegenerateBeatForm,
  regenerateBeats,
  UnauthorizedError,
  ValidationError,
} from "../api";
import { InfiniteQueryAPI, MutationAPI, QueryAPI } from ".//common";

import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";

const BASE_PARAMS = ["story-schematics service", "beats sheet"] as const;

const createBeatsSheetMutationKey = [...BASE_PARAMS, "create"];

export const CreateBeatsSheet: MutationAPI<
  [accessToken: string],
  Awaited<ReturnType<typeof createBeatsSheet>>,
  UnauthorizedError | NotFoundError | ValidationError | InternalError,
  z.infer<typeof CreateBeatsSheetForm>
> = {
  key: createBeatsSheetMutationKey,
  useAPI: (accessToken) =>
    useMutation({
      mutationFn: (form) => createBeatsSheet(accessToken, form),
      mutationKey: createBeatsSheetMutationKey,
    }),
};

const getBeatsSheetQueryKey = (...params: Parameters<typeof getBeatsSheet>) => [
  ...BASE_PARAMS,
  "get",
  params[1],
  { token: params[0] },
];

export const GetBeatsSheet: QueryAPI<
  Parameters<typeof getBeatsSheet>,
  Awaited<ReturnType<typeof getBeatsSheet>>,
  UnauthorizedError | NotFoundError | InternalError
> = {
  key: getBeatsSheetQueryKey,
  useAPI: (...params) =>
    useQuery({
      queryFn: () => getBeatsSheet(...params),
      queryKey: getBeatsSheetQueryKey(...params),
      retry: (_, error) => isInternalError(error),
      enabled: !!params[0] && !!params[1].beatsSheetID,
    }),
};

const getAllBeatsSheetsQueryKey = (...params: Parameters<typeof getAllBeatsSheets>) => [
  ...BASE_PARAMS,
  "get all",
  params[1],
  { token: params[0] },
];

const DEFAULT_LIST_BEATS_SHEETS_LIMIT = 50;

export const GetAllBeatsSheets: InfiniteQueryAPI<
  [...Parameters<typeof getAllBeatsSheets>, { maxPages?: number }?],
  { pages: Awaited<ReturnType<typeof getAllBeatsSheets>>[] },
  UnauthorizedError | InternalError
> = {
  key: getAllBeatsSheetsQueryKey,
  useAPI: (accessToken, params, options) =>
    useInfiniteQuery({
      queryKey: getAllBeatsSheetsQueryKey(accessToken, params),
      queryFn: ({ pageParam = 0 }) => getAllBeatsSheets(accessToken, { ...params, offset: pageParam }),
      initialPageParam: params.offset,
      getNextPageParam: (lastPage, _allPages, lastPageParam) =>
        lastPage.length > 0 ? (lastPageParam ?? 0) + lastPage.length : undefined,
      getPreviousPageParam: (_firstPage, _allPages, firstPageParam) =>
        (firstPageParam ?? 0) > 0
          ? Math.max(0, (firstPageParam ?? 0) - (params.limit ?? DEFAULT_LIST_BEATS_SHEETS_LIMIT))
          : undefined,
      enabled: !!accessToken || !!params?.loglineID,
      maxPages: options?.maxPages,
    }),
};

export const generateBeatsSheetsMutationKey = [...BASE_PARAMS, "generate"] as const;

export const GenerateBeatsSheet: MutationAPI<
  [accessToken: string],
  Awaited<ReturnType<typeof generateBeatsSheet>>,
  UnauthorizedError | NotFoundError | InternalError,
  z.infer<typeof GenerateBeatsSheetForm>
> = {
  key: generateBeatsSheetsMutationKey,
  useAPI: (accessToken) =>
    useMutation({
      mutationFn: (form) => generateBeatsSheet(accessToken, form),
      mutationKey: generateBeatsSheetsMutationKey,
    }),
};

export const regenerateBeatsMutationKey = [...BASE_PARAMS, "regenerate beats"] as const;

export const RegenerateBeats: MutationAPI<
  [accessToken: string],
  Awaited<ReturnType<typeof regenerateBeats>>,
  UnauthorizedError | NotFoundError | InternalError,
  z.infer<typeof RegenerateBeatForm>
> = {
  key: regenerateBeatsMutationKey,
  useAPI: (accessToken) =>
    useMutation({
      mutationFn: (form) => regenerateBeats(accessToken, form),
      mutationKey: regenerateBeatsMutationKey,
    }),
};

export const expandBeatMutationKey = [...BASE_PARAMS, "expand beat"] as const;

export const ExpandBeat: MutationAPI<
  [accessToken: string],
  Awaited<ReturnType<typeof expandBeat>>,
  UnauthorizedError | NotFoundError | ValidationError | InternalError,
  z.infer<typeof ExpandBeatForm>
> = {
  key: expandBeatMutationKey,
  useAPI: (accessToken) =>
    useMutation({
      mutationFn: (form) => expandBeat(accessToken, form),
      mutationKey: expandBeatMutationKey,
    }),
};
