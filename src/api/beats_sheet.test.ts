import { server } from "../../__test__/utils/setup";
import {
  createBeatsSheet,
  expandBeat,
  generateBeatsSheet,
  getAllBeatsSheets,
  getBeatsSheet,
  regenerateBeats,
  CreateBeatsSheetForm,
  ExpandBeatForm,
  GenerateBeatsSheetForm,
  GetAllBeatsSheetsParams,
  GetBeatsSheetParams,
  RegenerateBeatForm,
  isInternalError,
  isNotFoundError,
  isUnauthorizedError,
  isValidationError,
} from "./index";

import { http } from "@a-novel/nodelib/msw";

import { HttpResponse } from "msw";
import { describe, it, expect } from "vitest";
import { z } from "zod";

describe("create beats sheet", () => {
  const defaultForm: z.infer<typeof CreateBeatsSheetForm> = {
    lang: "en",
    loglineID: "29f71c01-5ae1-4b01-b729-e17488538e15",
    content: [
      {
        key: "beat-1",
        title: "Introduction",
        content: "The protagonist is introduced to the reader.",
      },
    ],
  };

  const testCases = {
    success: {
      response: HttpResponse.json({
        id: "29f71c01-5ae1-4b01-b729-e17488538e15",
        lang: "en",
        loglineID: "29f71c01-5ae1-4b01-b729-e17488538e15",
        content: [
          {
            key: "beat-1",
            title: "Introduction",
            content: "The protagonist is introduced to the reader.",
          },
        ],
        createdAt: "2022-01-01T00:00:00Z",
      }),
      expect: {
        id: "29f71c01-5ae1-4b01-b729-e17488538e15",
        lang: "en",
        loglineID: "29f71c01-5ae1-4b01-b729-e17488538e15",

        content: [
          {
            key: "beat-1",
            title: "Introduction",
            content: "The protagonist is introduced to the reader.",
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
    validationError: {
      response: HttpResponse.json(undefined, { status: 422 }),
      expect: null,
      expectError: isValidationError,
    },
    internalError: {
      response: HttpResponse.json("crash", { status: 501 }),
      expect: null,
      expectError: isInternalError,
    },
  };

  for (const [key, { response, expect: expected, expectError }] of Object.entries(testCases)) {
    it(`returns ${key} response`, async () => {
      server.use(
        http
          .put("http://localhost:3000/beats-sheet")
          .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
          .bodyJSON(defaultForm, HttpResponse.error())
          .resolve(() => response)
      );

      const apiRes = await createBeatsSheet("access-token", defaultForm).catch((e) => e);

      if (expected) {
        expect(apiRes).toEqual(expected);
      } else if (expectError) {
        expect(expectError(apiRes)).toBe(true);
      }
    });
  }
});

describe("get beats sheet", () => {
  const defaultParams: z.infer<typeof GetBeatsSheetParams> = {
    beatsSheetID: "29f71c01-5ae1-4b01-b729-e17488538e15",
  };

  const testCases = {
    success: {
      response: HttpResponse.json({
        id: "29f71c01-5ae1-4b01-b729-e17488538e15",
        lang: "en",
        loglineID: "29f71c01-5ae1-4b01-b729-e17488538e15",

        content: [
          {
            key: "beat-1",
            title: "Introduction",
            content: "The protagonist is introduced to the reader.",
          },
        ],
        createdAt: "2022-01-01T00:00:00Z",
      }),
      expect: {
        id: "29f71c01-5ae1-4b01-b729-e17488538e15",
        lang: "en",
        loglineID: "29f71c01-5ae1-4b01-b729-e17488538e15",

        content: [
          {
            key: "beat-1",
            title: "Introduction",
            content: "The protagonist is introduced to the reader.",
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
    internalError: {
      response: HttpResponse.json("crash", { status: 501 }),
      expect: null,
      expectError: isInternalError,
    },
  };

  for (const [key, { response, expect: expected, expectError }] of Object.entries(testCases)) {
    it(`returns ${key} response`, async () => {
      server.use(
        http
          .get("http://localhost:3000/beats-sheet")
          .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
          .searchParams(new URLSearchParams({ beatsSheetID: defaultParams.beatsSheetID }), true, HttpResponse.error())
          .resolve(() => response)
      );

      const apiRes = await getBeatsSheet("access-token", defaultParams).catch((e) => e);

      if (expected) {
        expect(apiRes).toEqual(expected);
      } else if (expectError) {
        expect(expectError(apiRes)).toBe(true);
      }
    });
  }
});

describe("get all beats sheets", () => {
  const defaultParams: z.infer<typeof GetAllBeatsSheetsParams> = {
    loglineID: "29f71c01-5ae1-4b01-b729-e17488538e15",
  };

  const testCases = {
    success: {
      response: HttpResponse.json([
        {
          lang: "en",
          id: "29f71c01-5ae1-4b01-b729-e17488538e15",
          createdAt: "2022-01-01T00:00:00Z",
        },
      ]),
      expect: [
        {
          lang: "en",
          id: "29f71c01-5ae1-4b01-b729-e17488538e15",
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
    internalError: {
      response: HttpResponse.json("crash", { status: 501 }),
      expect: null,
      expectError: isInternalError,
    },
  };

  for (const [key, { response, expect: expected, expectError }] of Object.entries(testCases)) {
    it(`returns ${key} response`, async () => {
      server.use(
        http
          .get("http://localhost:3000/beats-sheets")
          .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
          .searchParams(new URLSearchParams({ loglineID: defaultParams.loglineID }), true, HttpResponse.error())
          .resolve(() => response)
      );

      const apiRes = await getAllBeatsSheets("access-token", defaultParams).catch((e) => e);

      if (expected) {
        expect(apiRes).toEqual(expected);
      } else if (expectError) {
        expect(expectError(apiRes)).toBe(true);
      }
    });
  }
});

describe("generate beats sheet", () => {
  const defaultForm: z.infer<typeof GenerateBeatsSheetForm> = {
    lang: "en",
    loglineID: "29f71c01-5ae1-4b01-b729-e17488538e15",
  };

  const testCases = {
    success: {
      response: HttpResponse.json({
        lang: "en",
        content: [
          {
            key: "beat-1",
            title: "Introduction",
            content: "The protagonist is introduced to the reader.",
          },
        ],
      }),
      expect: {
        lang: "en",
        content: [
          {
            key: "beat-1",
            title: "Introduction",
            content: "The protagonist is introduced to the reader.",
          },
        ],
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
    internalError: {
      response: HttpResponse.json("crash", { status: 501 }),
      expect: null,
      expectError: isInternalError,
    },
  };

  for (const [key, { response, expect: expected, expectError }] of Object.entries(testCases)) {
    it(`returns ${key} response`, async () => {
      server.use(
        http
          .post("http://localhost:3000/beats-sheet/generate")
          .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
          .bodyJSON(defaultForm, HttpResponse.error())
          .resolve(() => response)
      );

      const apiRes = await generateBeatsSheet("access-token", defaultForm).catch((e) => e);

      if (expected) {
        expect(apiRes).toEqual(expected);
      } else if (expectError) {
        expect(expectError(apiRes)).toBe(true);
      }
    });
  }
});

describe("regenerate beats", () => {
  const defaultForm: z.infer<typeof RegenerateBeatForm> = {
    beatsSheetID: "29f71c01-5ae1-4b01-b729-e17488538e15",
    regenerateKeys: ["beat-1"],
  };

  const testCases = {
    success: {
      response: HttpResponse.json({
        id: "29f71c01-5ae1-4b01-b729-e17488538e15",
        lang: "en",
        loglineID: "29f71c01-5ae1-4b01-b729-e17488538e15",

        content: [
          {
            key: "beat-1",
            title: "Introduction",
            content: "The protagonist is introduced to the reader.",
          },
        ],
        createdAt: "2022-01-01T00:00:00Z",
      }),
      expect: {
        id: "29f71c01-5ae1-4b01-b729-e17488538e15",
        lang: "en",
        loglineID: "29f71c01-5ae1-4b01-b729-e17488538e15",

        content: [
          {
            key: "beat-1",
            title: "Introduction",
            content: "The protagonist is introduced to the reader.",
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
    internalError: {
      response: HttpResponse.json("crash", { status: 501 }),
      expect: null,
      expectError: isInternalError,
    },
  };

  for (const [key, { response, expect: expected, expectError }] of Object.entries(testCases)) {
    it(`returns ${key} response`, async () => {
      server.use(
        http
          .patch("http://localhost:3000/beats-sheet/regenerate")
          .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
          .bodyJSON(defaultForm, HttpResponse.error())
          .resolve(() => response)
      );

      const apiRes = await regenerateBeats("access-token", defaultForm).catch((e) => e);

      if (expected) {
        expect(apiRes).toEqual(expected);
      } else if (expectError) {
        expect(expectError(apiRes)).toBe(true);
      }
    });
  }
});

describe("expand beat", () => {
  const defaultForm: z.infer<typeof ExpandBeatForm> = {
    beatsSheetID: "29f71c01-5ae1-4b01-b729-e17488538e15",
    targetKey: "beat-1",
  };

  const testCases = {
    success: {
      response: HttpResponse.json({
        key: "beat-1",
        title: "Introduction",
        content: "The protagonist is introduced to the reader.",
      }),
      expect: {
        key: "beat-1",
        title: "Introduction",
        content: "The protagonist is introduced to the reader.",
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
    validationError: {
      response: HttpResponse.json(undefined, { status: 422 }),
      expect: null,
      expectError: isValidationError,
    },
    internalError: {
      response: HttpResponse.json("crash", { status: 501 }),
      expect: null,
      expectError: isInternalError,
    },
  };

  for (const [key, { response, expect: expected, expectError }] of Object.entries(testCases)) {
    it(`returns ${key} response`, async () => {
      server.use(
        http
          .patch("http://localhost:3000/beats-sheet/expand")
          .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
          .bodyJSON(defaultForm, HttpResponse.error())
          .resolve(() => response)
      );

      const apiRes = await expandBeat("access-token", defaultForm).catch((e) => e);

      if (expected) {
        expect(apiRes).toEqual(expected);
      } else if (expectError) {
        expect(expectError(apiRes)).toBe(true);
      }
    });
  }
});
