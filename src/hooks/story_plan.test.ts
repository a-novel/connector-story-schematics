import { MockQueryClient } from "#/mocks/query_client";
import { genericSetup } from "#/utils/setup";
import { QueryWrapper } from "#/utils/wrapper";

import {
  CreateStoryPlanForm,
  GetAllStoryPlansParams,
  GetStoryPlanParams,
  StoryPlanPreview,
  StoryPlan,
  UpdateStoryPlanForm,
} from "@/api";
import { CreateStoryPlan, GetAllStoryPlans, GetStoryPlan, UpdateStoryPlan } from "@/hooks";

import { act } from "react";

import { QueryClient } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import nock from "nock";
import { describe, expect, it } from "vitest";
import { z } from "zod";

describe("create story plan", () => {
  let nockAPI: nock.Scope;

  const defaultForm: z.infer<typeof CreateStoryPlanForm> = {
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

  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });

  it("returns successful response", async () => {
    const res: z.infer<typeof StoryPlan> = {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
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

    const nockStoryPlan = nockAPI
      .put("/story-plan", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, rawRes);

    const hook = renderHook((accessToken) => CreateStoryPlan.useAPI(accessToken), {
      initialProps: "access-token",
      wrapper: QueryWrapper(queryClient),
    });

    await act(async () => {
      const apiRes = await hook.result.current.mutateAsync(defaultForm);
      expect(apiRes).toEqual(res);
    });

    expect(nockStoryPlan.isDone()).toBe(true);
  });
});

describe("update story plan", () => {
  let nockAPI: nock.Scope;

  const defaultForm: z.infer<typeof UpdateStoryPlanForm> = {
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

  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });

  it("returns successful response", async () => {
    const res: z.infer<typeof StoryPlan> = {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
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

    const nockStoryPlan = nockAPI
      .patch("/story-plan", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, rawRes);

    const hook = renderHook((accessToken) => UpdateStoryPlan.useAPI(accessToken), {
      initialProps: "access-token",
      wrapper: QueryWrapper(queryClient),
    });

    await act(async () => {
      const apiRes = await hook.result.current.mutateAsync(defaultForm);
      expect(apiRes).toEqual(res);
    });

    expect(nockStoryPlan.isDone()).toBe(true);
  });
});

describe("get story plan", () => {
  let nockAPI: nock.Scope;

  const defaultParams: z.infer<typeof GetStoryPlanParams> = {
    slug: "my-story",
    id: "29f71c01-5ae1-4b01-b729-e17488538e15",
  };

  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });

  it("returns successful response", async () => {
    const res: z.infer<typeof StoryPlan> = {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
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

    const nockStoryPlan = nockAPI
      .get(`/story-plan?id=${defaultParams.id}&slug=${defaultParams.slug}`, undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes);

    const hook = renderHook(() => GetStoryPlan.useAPI("access-token", defaultParams), {
      wrapper: QueryWrapper(queryClient),
    });

    await waitFor(() => {
      expect(nockStoryPlan.isDone()).toBe(true);
    });
    expect(hook.result.current.data).toEqual(res);
  });
});

describe("get all story plans", () => {
  let nockAPI: nock.Scope;

  const defaultParams: z.infer<typeof GetAllStoryPlansParams> = {
    limit: 1,
  };

  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });
  const res: z.infer<typeof StoryPlanPreview>[] = [
    {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      slug: "my-story",
      name: "My Story Plan",
      description: "A story plan for a hero's journey.",
      createdAt: new Date("2022-01-01T00:00:00Z"),
    },
    {
      id: "29f71c01-5ae1-4b01-b729-e17488538e16",
      slug: "my-second-story",
      name: "My Second Story Plan",
      description: "A story plan for a hero's journey.",
      createdAt: new Date("2022-01-02T00:00:00Z"),
    },
    {
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
      slug: "my-story",
      name: "My Story Plan",
      description: "A story plan for a hero's journey.",
      createdAt: "2022-01-01T00:00:00Z",
    },
    {
      id: "29f71c01-5ae1-4b01-b729-e17488538e16",
      slug: "my-second-story",
      name: "My Second Story Plan",
      description: "A story plan for a hero's journey.",
      createdAt: "2022-01-02T00:00:00Z",
    },
    {
      id: "29f71c01-5ae1-4b01-b729-e17488538e17",
      slug: "my-third-story",
      name: "My Third Story Plan",
      description: "A story plan for a hero's journey.",
      createdAt: "2022-01-03T00:00:00Z",
    },
  ];

  it("returns first page", async () => {
    const queryClient = new QueryClient(MockQueryClient);

    const nockUsers = nockAPI
      .get("/story-plans?limit=1", undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes.slice(0, 1));

    const hook = renderHook(() => GetAllStoryPlans.useAPI("access-token", defaultParams), {
      wrapper: QueryWrapper(queryClient),
    });

    await waitFor(() => {
      expect(nockUsers.isDone()).toBe(true);
    });

    expect(hook.result.current.data?.pages.flat()).toEqual(res.slice(0, 1));
  });

  it("returns all pages", async () => {
    const queryClient = new QueryClient(MockQueryClient);

    let nockUsers = nockAPI
      .get("/story-plans?limit=1", undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes.slice(0, 1));

    const hook = renderHook(() => GetAllStoryPlans.useAPI("access-token", defaultParams, { maxPages: 2 }), {
      wrapper: QueryWrapper(queryClient),
    });

    await waitFor(() => {
      expect(nockUsers.isDone()).toBe(true);
      expect(hook.result.current.data?.pages.flat()).toEqual(res.slice(0, 1));
    });

    nockUsers = nockAPI
      .get("/story-plans?limit=1&offset=1", undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes.slice(1, 2))
      .get("/story-plans?limit=1&offset=2", undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes.slice(2, 3));

    await act(async () => {
      await hook.result.current.fetchNextPage();
      await hook.result.current.fetchNextPage();
    });

    await waitFor(() => {
      expect(nockUsers.isDone()).toBe(true);
    });
    expect(hook.result.current.data?.pages.flat()).toEqual(res.slice(1, 3));
  });

  it("paginates backwards", async () => {
    const queryClient = new QueryClient(MockQueryClient);

    let nockUsers = nockAPI
      .get("/story-plans?limit=10", undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes.slice(0, 1));

    const hook = renderHook(() => GetAllStoryPlans.useAPI("access-token", { limit: 10 }, { maxPages: 2 }), {
      wrapper: QueryWrapper(queryClient),
    });

    await waitFor(() => {
      expect(nockUsers.isDone()).toBe(true);
      expect(hook.result.current.data?.pages.flat()).toEqual(res.slice(0, 1));
    });

    nockUsers = nockAPI
      .get("/story-plans?limit=10&offset=1", undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes.slice(1, 2))
      .get("/story-plans?limit=10&offset=2", undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes.slice(2, 3));

    await act(async () => {
      await hook.result.current.fetchNextPage();
      await hook.result.current.fetchNextPage();
    });

    await waitFor(() => {
      expect(nockUsers.isDone()).toBe(true);
    });
    expect(hook.result.current.data?.pages.flat()).toEqual(res.slice(1, 3));

    nockUsers = nockAPI
      .get("/story-plans?limit=10", undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes.slice(0, 1));

    await act(async () => {
      await hook.result.current.fetchPreviousPage();
    });

    await waitFor(() => {
      expect(nockUsers.isDone()).toBe(true);
    });
    expect(hook.result.current.data?.pages.flat()).toEqual(res.slice(0, 2));
  });
});
