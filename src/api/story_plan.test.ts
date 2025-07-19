import { server } from "../../__test__/utils/setup";
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
  updateStoryPlan,
  UpdateStoryPlanForm,
} from "./index";

import { http } from "@a-novel/nodelib/msw";

import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { z } from "zod";

describe("create story plan", () => {
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

  const testCases = {
    success: {
      response: HttpResponse.json({
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
      }),
      expect: {
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
      },
      expectError: null,
    },
    unauthorized: {
      response: HttpResponse.json(undefined, { status: 401 }),
      expect: null,
      expectError: isUnauthorizedError,
    },
    internal: {
      response: HttpResponse.json("crash", { status: 501 }),
      expect: null,
      expectError: isInternalError,
    },
  };

  for (const [key, { response, expect: expected, expectError }] of Object.entries(testCases)) {
    it(`returns ${key} response`, async () => {
      server.use(
        http
          .put("/story-plan")
          .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
          .bodyJSON(defaultForm, HttpResponse.error())
          .resolve(() => response)
      );

      const apiRes = await createStoryPlan("access-token", defaultForm).catch((e) => e);

      if (expected) {
        expect(apiRes).toEqual(expected);
      } else if (expectError) {
        expect(expectError(apiRes)).toBe(true);
      }
    });
  }
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

  const testCases = {
    success: {
      response: HttpResponse.json({
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
      }),
      expect: {
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
      },
      expectError: null,
    },
    unauthorized: {
      response: HttpResponse.json(undefined, { status: 401 }),
      expect: null,
      expectError: isUnauthorizedError,
    },
    notFound: {
      response: HttpResponse.json(undefined, { status: 404 }),
      expect: null,
      expectError: isNotFoundError,
    },
    internal: {
      response: HttpResponse.json("crash", { status: 501 }),
      expect: null,
      expectError: isInternalError,
    },
  };

  for (const [key, { response, expect: expected, expectError }] of Object.entries(testCases)) {
    it(`returns ${key} response`, async () => {
      server.use(
        http
          .patch("/story-plan")
          .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
          .bodyJSON(defaultForm, HttpResponse.error())
          .resolve(() => response)
      );

      const apiRes = await updateStoryPlan("access-token", defaultForm).catch((e) => e);

      if (expected) {
        expect(apiRes).toEqual(expected);
      } else if (expectError) {
        expect(expectError(apiRes)).toBe(true);
      }
    });
  }
});

describe("get story plan", () => {
  const defaultParams: z.infer<typeof GetStoryPlanParams> = {
    slug: "my-story",
    id: "29f71c01-5ae1-4b01-b729-e17488538e15",
  };

  const testCases = {
    success: {
      response: HttpResponse.json({
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
      }),
      expect: {
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
      },
      expectError: null,
    },
    unauthorized: {
      response: HttpResponse.json(undefined, { status: 401 }),
      expect: null,
      expectError: isUnauthorizedError,
    },
    notFound: {
      response: HttpResponse.json(undefined, { status: 404 }),
      expect: null,
      expectError: isNotFoundError,
    },
    internal: {
      response: HttpResponse.json("crash", { status: 501 }),
      expect: null,
      expectError: isInternalError,
    },
  };

  for (const [key, { response, expect: expected, expectError }] of Object.entries(testCases)) {
    it(`returns ${key} response`, async () => {
      server.use(
        http
          .get("/story-plan")
          .searchParams(new URLSearchParams({ id: defaultParams.id!, slug: defaultParams.slug! }), true)
          .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
          .resolve(() => response)
      );

      const apiRes = await getStoryPlan("access-token", defaultParams).catch((e) => e);

      if (expected) {
        expect(apiRes).toEqual(expected);
      } else if (expectError) {
        expect(expectError(apiRes)).toBe(true);
      }
    });
  }
});

describe("get all story plans", () => {
  const defaultParams: z.infer<typeof GetAllStoryPlansParams> = {
    limit: 100,
  };

  const testCases = {
    success: {
      response: HttpResponse.json([
        {
          id: "29f71c01-5ae1-4b01-b729-e17488538e15",
          lang: "en",
          slug: "my-story",
          name: "My Story Plan",
          description: "A story plan for a hero's journey.",
          createdAt: "2022-01-01T00:00:00Z",
        },
      ]),
      expect: [
        {
          id: "29f71c01-5ae1-4b01-b729-e17488538e15",
          lang: "en",
          slug: "my-story",
          name: "My Story Plan",
          description: "A story plan for a hero's journey.",
          createdAt: new Date("2022-01-01T00:00:00Z"),
        },
      ],
      expectError: null,
    },
    unauthorized: {
      response: HttpResponse.json(undefined, { status: 401 }),
      expect: null,
      expectError: isUnauthorizedError,
    },
    internal: {
      response: HttpResponse.json("crash", { status: 501 }),
      expect: null,
      expectError: isInternalError,
    },
  };

  for (const [key, { response, expect: expected, expectError }] of Object.entries(testCases)) {
    it(`returns ${key} response`, async () => {
      server.use(
        http
          .get("/story-plans")
          .searchParams(new URLSearchParams({ limit: defaultParams.limit!.toString() }), true)
          .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
          .resolve(() => response)
      );

      const apiRes = await getAllStoryPlans("access-token", defaultParams).catch((e) => e);

      if (expected) {
        expect(apiRes).toEqual(expected);
      } else if (expectError) {
        expect(expectError(apiRes)).toBe(true);
      }
    });
  }
});
