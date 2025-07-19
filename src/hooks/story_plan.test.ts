import { MockQueryClient } from "../../__test__/mocks/query_client";
import { server } from "../../__test__/utils/setup";
import { QueryWrapper } from "../../__test__/utils/wrapper";
import {
  CreateStoryPlanForm,
  GetAllStoryPlansParams,
  GetStoryPlanParams,
  StoryPlanPreview,
  StoryPlan,
  UpdateStoryPlanForm,
} from "../api";
import { CreateStoryPlan, GetAllStoryPlans, GetStoryPlan, UpdateStoryPlan } from "./index";

import { http } from "@a-novel/nodelib/msw";

import { act } from "react";

import { QueryClient } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { z } from "zod";

describe("create story plan", () => {
  const defaultForm: z.infer<typeof CreateStoryPlanForm> = {
    lang: "en",
    slug: "my-story",
    name: "My Story Plan",
    description: "A story plan for a hero's journey.",
    beats: [
      {
        name: "Introduction",
        key: "beat-1",
        keyPoints: ["The protagonist is introduced to the reader.", "The protagonist's goal is revealed."],
        purpose: "Introduce the protagonist.",
        minScenes: 1,
        maxScenes: 3,
      },
    ],
  };

  it("returns successful response", async () => {
    const res: z.infer<typeof StoryPlan> = {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      lang: "en",
      slug: "my-story",
      name: "My Story Plan",
      description: "A story plan for a hero's journey.",
      beats: [
        {
          name: "Introduction",
          key: "beat-1",
          keyPoints: ["The protagonist is introduced to the reader.", "The protagonist's goal is revealed."],
          purpose: "Introduce the protagonist.",
          minScenes: 1,
          maxScenes: 3,
        },
      ],
      createdAt: new Date("2022-01-01T00:00:00Z"),
    };

    const rawRes = {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      lang: "en",
      slug: "my-story",
      name: "My Story Plan",
      description: "A story plan for a hero's journey.",
      beats: [
        {
          name: "Introduction",
          key: "beat-1",
          keyPoints: ["The protagonist is introduced to the reader.", "The protagonist's goal is revealed."],
          purpose: "Introduce the protagonist.",
          minScenes: 1,
          maxScenes: 3,
        },
      ],
      createdAt: "2022-01-01T00:00:00Z",
    };

    const queryClient = new QueryClient(MockQueryClient);

    server.use(
      http
        .put("/story-plan")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .bodyJSON(defaultForm, HttpResponse.error())
        .resolve(() => HttpResponse.json(rawRes))
    );

    const hook = renderHook((accessToken) => CreateStoryPlan.useAPI(accessToken), {
      initialProps: "access-token",
      wrapper: QueryWrapper(queryClient),
    });

    await act(async () => {
      const apiRes = await hook.result.current.mutateAsync(defaultForm);
      expect(apiRes).toEqual(res);
    });
  });
});

describe("update story plan", () => {
  const defaultForm: z.infer<typeof UpdateStoryPlanForm> = {
    lang: "en",
    slug: "my-story",
    name: "My Story Plan",
    description: "A story plan for a hero's journey.",
    beats: [
      {
        name: "Introduction",
        key: "beat-1",
        keyPoints: ["The protagonist is introduced to the reader.", "The protagonist's goal is revealed."],
        purpose: "Introduce the protagonist.",
        minScenes: 1,
        maxScenes: 3,
      },
    ],
  };

  it("returns successful response", async () => {
    const res: z.infer<typeof StoryPlan> = {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      lang: "en",
      slug: "my-story",
      name: "My Story Plan",
      description: "A story plan for a hero's journey.",
      beats: [
        {
          name: "Introduction",
          key: "beat-1",
          keyPoints: ["The protagonist is introduced to the reader.", "The protagonist's goal is revealed."],
          purpose: "Introduce the protagonist.",
          minScenes: 1,
          maxScenes: 3,
        },
      ],
      createdAt: new Date("2022-01-01T00:00:00Z"),
    };

    const rawRes = {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      lang: "en",
      slug: "my-story",
      name: "My Story Plan",
      description: "A story plan for a hero's journey.",
      beats: [
        {
          name: "Introduction",
          key: "beat-1",
          keyPoints: ["The protagonist is introduced to the reader.", "The protagonist's goal is revealed."],
          purpose: "Introduce the protagonist.",
          minScenes: 1,
          maxScenes: 3,
        },
      ],
      createdAt: "2022-01-01T00:00:00Z",
    };

    const queryClient = new QueryClient(MockQueryClient);

    server.use(
      http
        .patch("/story-plan")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .bodyJSON(defaultForm, HttpResponse.error())
        .resolve(() => HttpResponse.json(rawRes))
    );

    const hook = renderHook((accessToken) => UpdateStoryPlan.useAPI(accessToken), {
      initialProps: "access-token",
      wrapper: QueryWrapper(queryClient),
    });

    await act(async () => {
      const apiRes = await hook.result.current.mutateAsync(defaultForm);
      expect(apiRes).toEqual(res);
    });
  });
});

describe("get story plan", () => {
  const defaultParams: z.infer<typeof GetStoryPlanParams> = {
    slug: "my-story",
    id: "29f71c01-5ae1-4b01-b729-e17488538e15",
  };

  it("returns successful response", async () => {
    const res: z.infer<typeof StoryPlan> = {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      lang: "en",
      slug: "my-story",
      name: "My Story Plan",
      description: "A story plan for a hero's journey.",
      beats: [
        {
          name: "Introduction",
          key: "beat-1",
          keyPoints: ["The protagonist is introduced to the reader.", "The protagonist's goal is revealed."],
          purpose: "Introduce the protagonist.",
          minScenes: 1,
          maxScenes: 3,
        },
      ],
      createdAt: new Date("2022-01-01T00:00:00Z"),
    };

    const rawRes = {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      lang: "en",
      slug: "my-story",
      name: "My Story Plan",
      description: "A story plan for a hero's journey.",
      beats: [
        {
          name: "Introduction",
          key: "beat-1",
          keyPoints: ["The protagonist is introduced to the reader.", "The protagonist's goal is revealed."],
          purpose: "Introduce the protagonist.",
          minScenes: 1,
          maxScenes: 3,
        },
      ],
      createdAt: "2022-01-01T00:00:00Z",
    };

    const queryClient = new QueryClient(MockQueryClient);

    server.use(
      http
        .get("/story-plan")
        .searchParams(new URLSearchParams({ id: defaultParams.id!, slug: defaultParams.slug! }), true)
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .resolve(() => HttpResponse.json(rawRes))
    );

    const hook = renderHook(() => GetStoryPlan.useAPI("access-token", defaultParams), {
      wrapper: QueryWrapper(queryClient),
    });

    await waitFor(() => {
      expect(hook.result.current.data).toEqual(res);
    });
  });
});

describe("get all story plans", () => {
  const defaultParams: z.infer<typeof GetAllStoryPlansParams> = {
    limit: 1,
  };

  const res: z.infer<typeof StoryPlanPreview>[] = [
    {
      lang: "en",
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      slug: "my-story",
      name: "My Story Plan",
      description: "A story plan for a hero's journey.",
      createdAt: new Date("2022-01-01T00:00:00Z"),
    },
    {
      lang: "en",
      id: "29f71c01-5ae1-4b01-b729-e17488538e16",
      slug: "my-second-story",
      name: "My Second Story Plan",
      description: "A story plan for a hero's journey.",
      createdAt: new Date("2022-01-02T00:00:00Z"),
    },
    {
      lang: "en",
      id: "29f71c01-5ae1-4b01-b729-e17488538e17",
      slug: "my-third-story",
      name: "My Third Story Plan",
      description: "A story plan for a hero's journey.",
      createdAt: new Date("2022-01-03T00:00:00Z"),
    },
  ];

  const rawRes = [
    {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      lang: "en",
      slug: "my-story",
      name: "My Story Plan",
      description: "A story plan for a hero's journey.",
      createdAt: "2022-01-01T00:00:00Z",
    },
    {
      id: "29f71c01-5ae1-4b01-b729-e17488538e16",
      lang: "en",
      slug: "my-second-story",
      name: "My Second Story Plan",
      description: "A story plan for a hero's journey.",
      createdAt: "2022-01-02T00:00:00Z",
    },
    {
      id: "29f71c01-5ae1-4b01-b729-e17488538e17",
      lang: "en",
      slug: "my-third-story",
      name: "My Third Story Plan",
      description: "A story plan for a hero's journey.",
      createdAt: "2022-01-03T00:00:00Z",
    },
  ];

  it("returns first page", async () => {
    const queryClient = new QueryClient(MockQueryClient);

    server.use(
      http
        .get("/story-plans")
        .searchParams(new URLSearchParams({ limit: "1" }), true)
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .resolve(() => HttpResponse.json(rawRes.slice(0, 1)))
    );

    const hook = renderHook(() => GetAllStoryPlans.useAPI("access-token", defaultParams), {
      wrapper: QueryWrapper(queryClient),
    });

    await waitFor(() => {
      expect(hook.result.current.data?.pages.flat()).toEqual(res.slice(0, 1));
    });
  });

  it("returns all pages", async () => {
    const queryClient = new QueryClient(MockQueryClient);

    server.use(
      http
        .get("/story-plans")
        .searchParams(new URLSearchParams({ limit: "1" }), true)
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .resolve(() => HttpResponse.json(rawRes.slice(0, 1))),
      http
        .get("/story-plans")
        .searchParams(new URLSearchParams({ limit: "1", offset: "1" }), true)
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .resolve(() => HttpResponse.json(rawRes.slice(1, 2))),
      http
        .get("/story-plans")
        .searchParams(new URLSearchParams({ limit: "1", offset: "2" }), true)
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .resolve(() => HttpResponse.json(rawRes.slice(2, 3)))
    );

    const hook = renderHook(() => GetAllStoryPlans.useAPI("access-token", defaultParams, { maxPages: 2 }), {
      wrapper: QueryWrapper(queryClient),
    });

    await waitFor(() => {
      expect(hook.result.current.data?.pages.flat()).toEqual(res.slice(0, 1));
    });

    await act(async () => {
      await hook.result.current.fetchNextPage();
      await hook.result.current.fetchNextPage();
    });

    await waitFor(() => {
      expect(hook.result.current.data?.pages.flat()).toEqual(res.slice(1, 3));
    });
  });

  it("paginates backwards", async () => {
    const queryClient = new QueryClient(MockQueryClient);

    server.use(
      http
        .get("/story-plans")
        .searchParams(new URLSearchParams({ limit: "10" }), true)
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .resolve(() => HttpResponse.json(rawRes.slice(0, 1))),
      http
        .get("/story-plans")
        .searchParams(new URLSearchParams({ limit: "10", offset: "1" }), true)
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .resolve(() => HttpResponse.json(rawRes.slice(1, 2))),
      http
        .get("/story-plans")
        .searchParams(new URLSearchParams({ limit: "10", offset: "2" }), true)
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .resolve(() => HttpResponse.json(rawRes.slice(2, 3)))
    );

    const hook = renderHook(() => GetAllStoryPlans.useAPI("access-token", { limit: 10 }, { maxPages: 2 }), {
      wrapper: QueryWrapper(queryClient),
    });

    await waitFor(() => {
      expect(hook.result.current.data?.pages.flat()).toEqual(res.slice(0, 1));
    });

    await act(async () => {
      await hook.result.current.fetchNextPage();
      await hook.result.current.fetchNextPage();
    });

    await waitFor(() => {
      expect(hook.result.current.data?.pages.flat()).toEqual(res.slice(1, 3));
    });

    await act(async () => {
      await hook.result.current.fetchPreviousPage();
    });

    await waitFor(() => {
      expect(hook.result.current.data?.pages.flat()).toEqual(res.slice(0, 2));
    });
  });
});
