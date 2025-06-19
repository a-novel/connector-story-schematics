import { genericSetup } from "../../__test__/utils/setup";
import {
  createStoryPlan,
  CreateStoryPlanForm,
  getAllStoryPlans,
  GetAllStoryPlansParams,
  getStoryPlan,
  GetStoryPlanParams,
  isInternalError,
  isNotFoundError,
  isUnauthorizedError,
  StoryPlan,
  StoryPlanPreview,
  updateStoryPlan,
  UpdateStoryPlanForm,
} from "./index";

import nock from "nock";
import { describe, expect, it } from "vitest";
import { z } from "zod";

describe("create story plan", () => {
  let nockAPI: nock.Scope;

  const defaultForm: z.infer<typeof CreateStoryPlanForm> = {
    slug: "my-story",
    lang: "en",
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

    const nockStoryPlan = nockAPI
      .put("/story-plan", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, rawRes);

    const apiRes = await createStoryPlan("access-token", defaultForm);
    expect(apiRes).toEqual(res);

    expect(nockStoryPlan.isDone()).toBe(true);
  });

  it("returns unauthorized", async () => {
    const nockStoryPlan = nockAPI
      .put("/story-plan", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(401, undefined);

    const apiRes = await createStoryPlan("access-token", defaultForm).catch((e) => e);
    expect(isUnauthorizedError(apiRes)).toBe(true);
    expect(nockStoryPlan.isDone()).toBe(true);
  });

  it("returns internal", async () => {
    const nockStoryPlan = nockAPI
      .put("/story-plan", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(501, "crash");

    const apiRes = await createStoryPlan("access-token", defaultForm).catch((e) => e);
    expect(isInternalError(apiRes)).toBe(true);
    expect(nockStoryPlan.isDone()).toBe(true);
  });
});

describe("update story plan", () => {
  let nockAPI: nock.Scope;

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

  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });

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

    const nockStoryPlan = nockAPI
      .patch("/story-plan", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, rawRes);

    const apiRes = await updateStoryPlan("access-token", defaultForm);
    expect(apiRes).toEqual(res);

    expect(nockStoryPlan.isDone()).toBe(true);
  });

  it("returns unauthorized", async () => {
    const nockStoryPlan = nockAPI
      .patch("/story-plan", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(401, undefined);

    const apiRes = await updateStoryPlan("access-token", defaultForm).catch((e) => e);
    expect(isUnauthorizedError(apiRes)).toBe(true);
    expect(nockStoryPlan.isDone()).toBe(true);
  });

  it("returns not found", async () => {
    const nockStoryPlan = nockAPI
      .patch("/story-plan", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(404, undefined);

    const apiRes = await updateStoryPlan("access-token", defaultForm).catch((e) => e);
    expect(isNotFoundError(apiRes)).toBe(true);
    expect(nockStoryPlan.isDone()).toBe(true);
  });

  it("returns internal", async () => {
    const nockStoryPlan = nockAPI
      .patch("/story-plan", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(501, "crash");

    const apiRes = await updateStoryPlan("access-token", defaultForm).catch((e) => e);
    expect(isInternalError(apiRes)).toBe(true);
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

    const nockStoryPlan = nockAPI
      .get(`/story-plan?id=${defaultParams.id}&slug=${defaultParams.slug}`, undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes);

    const apiRes = await getStoryPlan("access-token", defaultParams);
    expect(apiRes).toEqual(res);

    expect(nockStoryPlan.isDone()).toBe(true);
  });

  it("returns unauthorized", async () => {
    const nockStoryPlan = nockAPI
      .get(`/story-plan?id=${defaultParams.id}&slug=${defaultParams.slug}`, undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(401, undefined);

    const apiRes = await getStoryPlan("access-token", defaultParams).catch((e) => e);
    expect(isUnauthorizedError(apiRes)).toBe(true);
    expect(nockStoryPlan.isDone()).toBe(true);
  });

  it("returns not found", async () => {
    const nockStoryPlan = nockAPI
      .get(`/story-plan?id=${defaultParams.id}&slug=${defaultParams.slug}`, undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(404, undefined);

    const apiRes = await getStoryPlan("access-token", defaultParams).catch((e) => e);
    expect(isNotFoundError(apiRes)).toBe(true);
    expect(nockStoryPlan.isDone()).toBe(true);
  });

  it("returns internal", async () => {
    const nockStoryPlan = nockAPI
      .get(`/story-plan?id=${defaultParams.id}&slug=${defaultParams.slug}`, undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(501, "crash");

    const apiRes = await getStoryPlan("access-token", defaultParams).catch((e) => e);
    expect(isInternalError(apiRes)).toBe(true);
    expect(nockStoryPlan.isDone()).toBe(true);
  });
});

describe("get all story plans", () => {
  let nockAPI: nock.Scope;

  const defaultParams: z.infer<typeof GetAllStoryPlansParams> = {
    limit: 100,
  };

  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });

  it("returns successful response", async () => {
    const res: z.infer<typeof StoryPlanPreview>[] = [
      {
        id: "29f71c01-5ae1-4b01-b729-e17488538e15",
        lang: "en",
        slug: "my-story",
        name: "My Story Plan",
        description: "A story plan for a hero's journey.",
        createdAt: new Date("2022-01-01T00:00:00Z"),
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
    ];

    const nockStoryPlan = nockAPI
      .get(`/story-plans?limit=${defaultParams.limit}`, undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes);

    const apiRes = await getAllStoryPlans("access-token", defaultParams);
    expect(apiRes).toEqual(res);

    expect(nockStoryPlan.isDone()).toBe(true);
  });

  it("returns unauthorized", async () => {
    const nockStoryPlan = nockAPI
      .get(`/story-plans?limit=${defaultParams.limit}`, undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(401, undefined);

    const apiRes = await getAllStoryPlans("access-token", defaultParams).catch((e) => e);
    expect(isUnauthorizedError(apiRes)).toBe(true);
    expect(nockStoryPlan.isDone()).toBe(true);
  });

  it("returns internal", async () => {
    const nockStoryPlan = nockAPI
      .get(`/story-plans?limit=${defaultParams.limit}`, undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(501, "crash");

    const apiRes = await getAllStoryPlans("access-token", defaultParams).catch((e) => e);
    expect(isInternalError(apiRes)).toBe(true);
    expect(nockStoryPlan.isDone()).toBe(true);
  });
});
