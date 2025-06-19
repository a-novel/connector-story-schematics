import { genericSetup } from "../../__test__/utils/setup";
import {
  createBeatsSheet,
  expandBeat,
  generateBeatsSheet,
  getAllBeatsSheets,
  getBeatsSheet,
  regenerateBeats,
  Beat,
  BeatsSheet,
  BeatsSheetPreview,
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
  BeatsSheetIdea,
} from "./index";

import nock from "nock";
import { describe, it, expect } from "vitest";
import { z } from "zod";

describe("create beats sheet", () => {
  let nockAPI: nock.Scope;

  const defaultForm: z.infer<typeof CreateBeatsSheetForm> = {
    lang: "en",
    loglineID: "29f71c01-5ae1-4b01-b729-e17488538e15",
    storyPlanID: "29f71c01-5ae1-4b01-b729-e17488538e15",
    content: [
      {
        key: "beat-1",
        title: "Introduction",
        content: "The protagonist is introduced to the reader.",
      },
    ],
  };

  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });

  it("returns successful response", async () => {
    const res: z.infer<typeof BeatsSheet> = {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      lang: "en",
      loglineID: "29f71c01-5ae1-4b01-b729-e17488538e15",
      storyPlanID: "29f71c01-5ae1-4b01-b729-e17488538e15",
      content: [
        {
          key: "beat-1",
          title: "Introduction",
          content: "The protagonist is introduced to the reader.",
        },
      ],
      createdAt: new Date("2022-01-01T00:00:00Z"),
    };

    const rawRes = {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      lang: "en",
      loglineID: "29f71c01-5ae1-4b01-b729-e17488538e15",
      storyPlanID: "29f71c01-5ae1-4b01-b729-e17488538e15",
      content: [
        {
          key: "beat-1",
          title: "Introduction",
          content: "The protagonist is introduced to the reader.",
        },
      ],
      createdAt: "2022-01-01T00:00:00Z",
    };

    const nockBeatsSheet = nockAPI
      .put("/beats-sheet", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, rawRes);

    const apiRes = await createBeatsSheet("access-token", defaultForm);
    expect(apiRes).toEqual(res);

    expect(nockBeatsSheet.isDone()).toBe(true);
  });

  it("returns unauthorized", async () => {
    const nockBeatsSheet = nockAPI
      .put("/beats-sheet", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(401, undefined);

    const apiRes = await createBeatsSheet("access-token", defaultForm).catch((e) => e);
    expect(isUnauthorizedError(apiRes)).toBe(true);
    expect(nockBeatsSheet.isDone()).toBe(true);
  });

  it("returns not found", async () => {
    const nockBeatsSheet = nockAPI
      .put("/beats-sheet", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(404, undefined);

    const apiRes = await createBeatsSheet("access-token", defaultForm).catch((e) => e);
    expect(isNotFoundError(apiRes)).toBe(true);
    expect(nockBeatsSheet.isDone()).toBe(true);
  });

  it("returns unprocessable entity", async () => {
    const nockBeatsSheet = nockAPI
      .put("/beats-sheet", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(422, undefined);

    const apiRes = await createBeatsSheet("access-token", defaultForm).catch((e) => e);
    expect(isValidationError(apiRes)).toBe(true);
    expect(nockBeatsSheet.isDone()).toBe(true);
  });

  it("returns internal", async () => {
    const nockBeatsSheet = nockAPI
      .put("/beats-sheet", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(501, "crash");

    const apiRes = await createBeatsSheet("access-token", defaultForm).catch((e) => e);
    expect(isInternalError(apiRes)).toBe(true);
    expect(nockBeatsSheet.isDone()).toBe(true);
  });
});

describe("get beats sheet", () => {
  let nockAPI: nock.Scope;

  const defaultParams: z.infer<typeof GetBeatsSheetParams> = {
    beatsSheetID: "29f71c01-5ae1-4b01-b729-e17488538e15",
  };

  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });

  it("returns successful response", async () => {
    const res: z.infer<typeof BeatsSheet> = {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      lang: "en",
      loglineID: "29f71c01-5ae1-4b01-b729-e17488538e15",
      storyPlanID: "29f71c01-5ae1-4b01-b729-e17488538e15",
      content: [
        {
          key: "beat-1",
          title: "Introduction",
          content: "The protagonist is introduced to the reader.",
        },
      ],
      createdAt: new Date("2022-01-01T00:00:00Z"),
    };

    const rawRes = {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      lang: "en",
      loglineID: "29f71c01-5ae1-4b01-b729-e17488538e15",
      storyPlanID: "29f71c01-5ae1-4b01-b729-e17488538e15",
      content: [
        {
          key: "beat-1",
          title: "Introduction",
          content: "The protagonist is introduced to the reader.",
        },
      ],
      createdAt: "2022-01-01T00:00:00Z",
    };

    const nockBeatsSheet = nockAPI
      .get(`/beats-sheet?beatsSheetID=${defaultParams.beatsSheetID}`, undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes);

    const apiRes = await getBeatsSheet("access-token", defaultParams);
    expect(apiRes).toEqual(res);

    expect(nockBeatsSheet.isDone()).toBe(true);
  });

  it("returns unauthorized", async () => {
    const nockBeatsSheet = nockAPI
      .get(`/beats-sheet?beatsSheetID=${defaultParams.beatsSheetID}`, undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(401, undefined);

    const apiRes = await getBeatsSheet("access-token", defaultParams).catch((e) => e);
    expect(isUnauthorizedError(apiRes)).toBe(true);
    expect(nockBeatsSheet.isDone()).toBe(true);
  });

  it("returns not found", async () => {
    const nockBeatsSheet = nockAPI
      .get(`/beats-sheet?beatsSheetID=${defaultParams.beatsSheetID}`, undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(404, undefined);

    const apiRes = await getBeatsSheet("access-token", defaultParams).catch((e) => e);
    expect(isNotFoundError(apiRes)).toBe(true);
    expect(nockBeatsSheet.isDone()).toBe(true);
  });

  it("returns internal", async () => {
    const nockBeatsSheet = nockAPI
      .get(`/beats-sheet?beatsSheetID=${defaultParams.beatsSheetID}`, undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(501, "crash");

    const apiRes = await getBeatsSheet("access-token", defaultParams).catch((e) => e);
    expect(isInternalError(apiRes)).toBe(true);
    expect(nockBeatsSheet.isDone()).toBe(true);
  });
});

describe("get all beats sheets", () => {
  let nockAPI: nock.Scope;

  const defaultParams: z.infer<typeof GetAllBeatsSheetsParams> = {
    loglineID: "29f71c01-5ae1-4b01-b729-e17488538e15",
  };

  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });

  it("returns successful response", async () => {
    const res: z.infer<typeof BeatsSheetPreview>[] = [
      {
        lang: "en",
        id: "29f71c01-5ae1-4b01-b729-e17488538e15",
        createdAt: new Date("2022-01-01T00:00:00Z"),
      },
    ];

    const rawRes = [
      {
        lang: "en",
        id: "29f71c01-5ae1-4b01-b729-e17488538e15",
        createdAt: "2022-01-01T00:00:00Z",
      },
    ];

    const nockBeatsSheet = nockAPI
      .get(`/beats-sheets?loglineID=${defaultParams.loglineID}`, undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes);

    const apiRes = await getAllBeatsSheets("access-token", defaultParams);
    expect(apiRes).toEqual(res);

    expect(nockBeatsSheet.isDone()).toBe(true);
  });

  it("returns unauthorized", async () => {
    const nockBeatsSheet = nockAPI
      .get(`/beats-sheets?loglineID=${defaultParams.loglineID}`, undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(401, undefined);

    const apiRes = await getAllBeatsSheets("access-token", defaultParams).catch((e) => e);
    expect(isUnauthorizedError(apiRes)).toBe(true);
    expect(nockBeatsSheet.isDone()).toBe(true);
  });

  it("returns internal", async () => {
    const nockBeatsSheet = nockAPI
      .get(`/beats-sheets?loglineID=${defaultParams.loglineID}`, undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(501, "crash");

    const apiRes = await getAllBeatsSheets("access-token", defaultParams).catch((e) => e);
    expect(isInternalError(apiRes)).toBe(true);
    expect(nockBeatsSheet.isDone()).toBe(true);
  });
});

describe("generate beats sheet", () => {
  let nockAPI: nock.Scope;

  const defaultForm: z.infer<typeof GenerateBeatsSheetForm> = {
    lang: "en",
    loglineID: "29f71c01-5ae1-4b01-b729-e17488538e15",
    storyPlanID: "29f71c01-5ae1-4b01-b729-e17488538e15",
  };

  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });

  it("returns successful response", async () => {
    const res: z.infer<typeof BeatsSheetIdea> = {
      lang: "en",
      content: [
        {
          key: "beat-1",
          title: "Introduction",
          content: "The protagonist is introduced to the reader.",
        },
      ],
    };

    const nockBeatsSheet = nockAPI
      .post("/beats-sheet/generate", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, res);

    const apiRes = await generateBeatsSheet("access-token", defaultForm);
    expect(apiRes).toEqual(res);

    expect(nockBeatsSheet.isDone()).toBe(true);
  });

  it("returns unauthorized", async () => {
    const nockBeatsSheet = nockAPI
      .post("/beats-sheet/generate", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(401, undefined);

    const apiRes = await generateBeatsSheet("access-token", defaultForm).catch((e) => e);
    expect(isUnauthorizedError(apiRes)).toBe(true);
    expect(nockBeatsSheet.isDone()).toBe(true);
  });

  it("returns not found", async () => {
    const nockBeatsSheet = nockAPI
      .post("/beats-sheet/generate", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(404, undefined);

    const apiRes = await generateBeatsSheet("access-token", defaultForm).catch((e) => e);
    expect(isNotFoundError(apiRes)).toBe(true);
    expect(nockBeatsSheet.isDone()).toBe(true);
  });

  it("returns internal", async () => {
    const nockBeatsSheet = nockAPI
      .post("/beats-sheet/generate", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(501, "crash");

    const apiRes = await generateBeatsSheet("access-token", defaultForm).catch((e) => e);
    expect(isInternalError(apiRes)).toBe(true);
    expect(nockBeatsSheet.isDone()).toBe(true);
  });
});

describe("regenerate beats", () => {
  let nockAPI: nock.Scope;

  const defaultForm: z.infer<typeof RegenerateBeatForm> = {
    beatsSheetID: "29f71c01-5ae1-4b01-b729-e17488538e15",
    regenerateKeys: ["beat-1"],
  };

  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });

  it("returns successful response", async () => {
    const res: z.infer<typeof BeatsSheet> = {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      lang: "en",
      loglineID: "29f71c01-5ae1-4b01-b729-e17488538e15",
      storyPlanID: "29f71c01-5ae1-4b01-b729-e17488538e15",
      content: [
        {
          key: "beat-1",
          title: "Introduction",
          content: "The protagonist is introduced to the reader.",
        },
      ],
      createdAt: new Date("2022-01-01T00:00:00Z"),
    };

    const rawRes = {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      lang: "en",
      loglineID: "29f71c01-5ae1-4b01-b729-e17488538e15",
      storyPlanID: "29f71c01-5ae1-4b01-b729-e17488538e15",
      content: [
        {
          key: "beat-1",
          title: "Introduction",
          content: "The protagonist is introduced to the reader.",
        },
      ],
      createdAt: "2022-01-01T00:00:00Z",
    };

    const nockBeatsSheet = nockAPI
      .patch("/beats-sheet/regenerate", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, rawRes);

    const apiRes = await regenerateBeats("access-token", defaultForm);
    expect(apiRes).toEqual(res);

    expect(nockBeatsSheet.isDone()).toBe(true);
  });

  it("returns unauthorized", async () => {
    const nockBeatsSheet = nockAPI
      .patch("/beats-sheet/regenerate", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(401, undefined);

    const apiRes = await regenerateBeats("access-token", defaultForm).catch((e) => e);
    expect(isUnauthorizedError(apiRes)).toBe(true);
    expect(nockBeatsSheet.isDone()).toBe(true);
  });

  it("returns not found", async () => {
    const nockBeatsSheet = nockAPI
      .patch("/beats-sheet/regenerate", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(404, undefined);

    const apiRes = await regenerateBeats("access-token", defaultForm).catch((e) => e);
    expect(isNotFoundError(apiRes)).toBe(true);
    expect(nockBeatsSheet.isDone()).toBe(true);
  });

  it("returns internal", async () => {
    const nockBeatsSheet = nockAPI
      .patch("/beats-sheet/regenerate", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(501, "crash");

    const apiRes = await regenerateBeats("access-token", defaultForm).catch((e) => e);
    expect(isInternalError(apiRes)).toBe(true);
    expect(nockBeatsSheet.isDone()).toBe(true);
  });
});

describe("expand beat", () => {
  let nockAPI: nock.Scope;

  const defaultForm: z.infer<typeof ExpandBeatForm> = {
    beatsSheetID: "29f71c01-5ae1-4b01-b729-e17488538e15",
    targetKey: "beat-1",
  };

  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });

  it("returns successful response", async () => {
    const res: z.infer<typeof Beat> = {
      key: "beat-1",
      title: "Introduction",
      content: "The protagonist is introduced to the reader.",
    };

    const nockBeatsSheet = nockAPI
      .patch("/beats-sheet/expand", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, res);

    const apiRes = await expandBeat("access-token", defaultForm);
    expect(apiRes).toEqual(res);

    expect(nockBeatsSheet.isDone()).toBe(true);
  });

  it("returns unauthorized", async () => {
    const nockBeatsSheet = nockAPI
      .patch("/beats-sheet/expand", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(401, undefined);

    const apiRes = await expandBeat("access-token", defaultForm).catch((e) => e);
    expect(isUnauthorizedError(apiRes)).toBe(true);
    expect(nockBeatsSheet.isDone()).toBe(true);
  });

  it("returns not found", async () => {
    const nockBeatsSheet = nockAPI
      .patch("/beats-sheet/expand", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(404, undefined);

    const apiRes = await expandBeat("access-token", defaultForm).catch((e) => e);
    expect(isNotFoundError(apiRes)).toBe(true);
    expect(nockBeatsSheet.isDone()).toBe(true);
  });

  it("returns unprocessable entity", async () => {
    const nockBeatsSheet = nockAPI
      .patch("/beats-sheet/expand", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(422, undefined);

    const apiRes = await expandBeat("access-token", defaultForm).catch((e) => e);
    expect(isValidationError(apiRes)).toBe(true);
    expect(nockBeatsSheet.isDone()).toBe(true);
  });

  it("returns internal", async () => {
    const nockBeatsSheet = nockAPI
      .patch("/beats-sheet/expand", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(501, "crash");

    const apiRes = await expandBeat("access-token", defaultForm).catch((e) => e);
    expect(isInternalError(apiRes)).toBe(true);
    expect(nockBeatsSheet.isDone()).toBe(true);
  });
});
