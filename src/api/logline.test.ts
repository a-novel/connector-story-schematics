import { server } from "../../__test__/utils/setup";
import {
  CreateLoglineForm,
  GenerateLoglinesForm,
  GetAllLoglinesParams,
  GetLoglineParams,
  LoglineIdea,
  isInternalError,
  isNotFoundError,
  isUnauthorizedError,
  createLogline,
  expandLogline,
  generateLoglines,
  getAllLoglines,
  getLogline,
} from "./index";

import { http } from "@a-novel/nodelib/msw";

import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { z } from "zod";

describe("create logline", () => {
  const defaultForm: z.infer<typeof CreateLoglineForm> = {
    lang: "en",
    slug: "my-story",
    name: "My Story",
    content: "A story about a hero's journey.",
  };

  const testCases = {
    success: {
      response: HttpResponse.json({
        id: "29f71c01-5ae1-4b01-b729-e17488538e15",
        lang: "en",
        userID: "29f71c01-5ae1-4b01-b729-e17488538e15",
        slug: "my-story",
        name: "My Story",
        content: "A story about a hero's journey.",
        createdAt: "2022-01-01T00:00:00Z",
      }),
      expect: {
        id: "29f71c01-5ae1-4b01-b729-e17488538e15",
        lang: "en",
        userID: "29f71c01-5ae1-4b01-b729-e17488538e15",
        slug: "my-story",
        name: "My Story",
        content: "A story about a hero's journey.",
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
          .put("http://localhost:3000/logline")
          .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
          .bodyJSON(defaultForm, HttpResponse.error())
          .resolve(() => response)
      );

      const apiRes = await createLogline("access-token", defaultForm).catch((e) => e);

      if (expected) {
        expect(apiRes).toEqual(expected);
      } else if (expectError) {
        expect(expectError(apiRes)).toBe(true);
      }
    });
  }
});

describe("get logline", () => {
  const defaultParams: z.infer<typeof GetLoglineParams> = {
    id: "29f71c01-5ae1-4b01-b729-e17488538e15",
    slug: "my-story",
  };

  const testCases = {
    success: {
      response: HttpResponse.json({
        id: "29f71c01-5ae1-4b01-b729-e17488538e15",
        lang: "en",
        userID: "29f71c01-5ae1-4b01-b729-e17488538e15",
        slug: "my-story",
        name: "My Story",
        content: "A story about a hero's journey.",
        createdAt: "2022-01-01T00:00:00Z",
      }),
      expect: {
        id: "29f71c01-5ae1-4b01-b729-e17488538e15",
        lang: "en",
        userID: "29f71c01-5ae1-4b01-b729-e17488538e15",
        slug: "my-story",
        name: "My Story",
        content: "A story about a hero's journey.",
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
          .get("http://localhost:3000/logline")
          .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
          .searchParams(
            new URLSearchParams({ id: defaultParams.id!, slug: defaultParams.slug! }),
            true,
            HttpResponse.error()
          )
          .resolve(() => response)
      );

      const apiRes = await getLogline("access-token", defaultParams).catch((e) => e);

      if (expected) {
        expect(apiRes).toEqual(expected);
      } else if (expectError) {
        expect(expectError(apiRes)).toBe(true);
      }
    });
  }
});

describe("get all loglines", () => {
  const defaultParams: z.infer<typeof GetAllLoglinesParams> = {
    limit: 100,
  };

  const testCases = {
    success: {
      response: HttpResponse.json([
        {
          lang: "en",
          slug: "my-story",
          name: "My Story",
          content: "A story about a hero's journey.",
          createdAt: "2022-01-01T00:00:00Z",
        },
      ]),
      expect: [
        {
          lang: "en",
          slug: "my-story",
          name: "My Story",
          content: "A story about a hero's journey.",
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
          .get("http://localhost:3000/loglines")
          .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
          .searchParams(new URLSearchParams({ limit: defaultParams.limit!.toString() }), true, HttpResponse.error())
          .resolve(() => response)
      );

      const apiRes = await getAllLoglines("access-token", defaultParams).catch((e) => e);

      if (expected) {
        expect(apiRes).toEqual(expected);
      } else if (expectError) {
        expect(expectError(apiRes)).toBe(true);
      }
    });
  }
});

describe("generate loglines", () => {
  const defaultForm: z.infer<typeof GenerateLoglinesForm> = {
    lang: "en",
    count: 5,
    theme: "fantasy",
  };

  const testCases = {
    success: {
      response: HttpResponse.json([
        {
          lang: "en",
          name: "My Story",
          content: "A story about a hero's journey.",
        },
      ]),
      expect: [
        {
          lang: "en",
          name: "My Story",
          content: "A story about a hero's journey.",
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
          .post("http://localhost:3000/loglines/generate")
          .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
          .bodyJSON(defaultForm, HttpResponse.error())
          .resolve(() => response)
      );

      const apiRes = await generateLoglines("access-token", defaultForm).catch((e) => e);

      if (expected) {
        expect(apiRes).toEqual(expected);
      } else if (expectError) {
        expect(expectError(apiRes)).toBe(true);
      }
    });
  }
});

describe("expand logline", () => {
  const defaultForm: z.infer<typeof LoglineIdea> = {
    lang: "en",
    name: "My Story",
    content: "A story about a hero's journey.",
  };

  const testCases = {
    success: {
      response: HttpResponse.json({
        lang: "en",
        name: "My Story",
        content: "A story about a hero's journey, with twists and turns that lead to unexpected outcomes.",
      }),
      expect: {
        lang: "en",
        name: "My Story",
        content: "A story about a hero's journey, with twists and turns that lead to unexpected outcomes.",
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
          .post("http://localhost:3000/logline/expand")
          .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
          .bodyJSON(defaultForm, HttpResponse.error())
          .resolve(() => response)
      );

      const apiRes = await expandLogline("access-token", defaultForm).catch((e) => e);

      if (expected) {
        expect(apiRes).toEqual(expected);
      } else if (expectError) {
        expect(expectError(apiRes)).toBe(true);
      }
    });
  }
});
