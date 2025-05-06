import { genericSetup } from "../../__test__/utils/setup";
import {
  CreateLoglineForm,
  GenerateLoglinesForm,
  GetAllLoglinesParams,
  GetLoglineParams,
  Logline,
  LoglineIdea,
  LoglinePreview,
  isInternalError,
  isNotFoundError,
  isUnauthorizedError,
  createLogline,
  expandLogline,
  generateLoglines,
  getAllLoglines,
  getLogline,
} from "./index";

import nock from "nock";
import { describe, expect, it } from "vitest";
import { z } from "zod";

describe("create logline", () => {
  let nockAPI: nock.Scope;

  const defaultForm: z.infer<typeof CreateLoglineForm> = {
    slug: "my-story",
    name: "My Story",
    content: "A story about a hero's journey.",
  };

  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });

  it("returns successful response", async () => {
    const res: z.infer<typeof Logline> = {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      userID: "29f71c01-5ae1-4b01-b729-e17488538e15",
      slug: "my-story",
      name: "My Story",
      content: "A story about a hero's journey.",
      createdAt: new Date("2022-01-01T00:00:00Z"),
    };

    const rawRes = {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      userID: "29f71c01-5ae1-4b01-b729-e17488538e15",
      slug: "my-story",
      name: "My Story",
      content: "A story about a hero's journey.",
      createdAt: "2022-01-01T00:00:00Z",
    };

    const nockLogline = nockAPI
      .put("/logline", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, rawRes);

    const apiRes = await createLogline("access-token", defaultForm);
    expect(apiRes).toEqual(res);

    expect(nockLogline.isDone()).toBe(true);
  });

  it("returns unauthorized", async () => {
    const nockLogline = nockAPI
      .put("/logline", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(401, undefined);

    const apiRes = await createLogline("access-token", defaultForm).catch((e) => e);
    expect(isUnauthorizedError(apiRes)).toBe(true);
    expect(nockLogline.isDone()).toBe(true);
  });

  it("returns internal", async () => {
    const nockLogline = nockAPI
      .put("/logline", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(501, "crash");

    const apiRes = await createLogline("access-token", defaultForm).catch((e) => e);
    expect(isInternalError(apiRes)).toBe(true);
    expect(nockLogline.isDone()).toBe(true);
  });
});

describe("get logline", () => {
  let nockAPI: nock.Scope;

  const defaultParams: z.infer<typeof GetLoglineParams> = {
    id: "29f71c01-5ae1-4b01-b729-e17488538e15",
    slug: "my-story",
  };

  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });

  it("returns successful response", async () => {
    const res: z.infer<typeof Logline> = {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      userID: "29f71c01-5ae1-4b01-b729-e17488538e15",
      slug: "my-story",
      name: "My Story",
      content: "A story about a hero's journey.",
      createdAt: new Date("2022-01-01T00:00:00Z"),
    };

    const rawRes = {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      userID: "29f71c01-5ae1-4b01-b729-e17488538e15",
      slug: "my-story",
      name: "My Story",
      content: "A story about a hero's journey.",
      createdAt: "2022-01-01T00:00:00Z",
    };

    const nockLogline = nockAPI
      .get(`/logline?id=${defaultParams.id}&slug=${defaultParams.slug}`, undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes);

    const apiRes = await getLogline("access-token", defaultParams);
    expect(apiRes).toEqual(res);

    expect(nockLogline.isDone()).toBe(true);
  });

  it("returns unauthorized", async () => {
    const nockLogline = nockAPI
      .get(`/logline?id=${defaultParams.id}&slug=${defaultParams.slug}`, undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(401, undefined);

    const apiRes = await getLogline("access-token", defaultParams).catch((e) => e);
    expect(isUnauthorizedError(apiRes)).toBe(true);
    expect(nockLogline.isDone()).toBe(true);
  });

  it("returns not found", async () => {
    const nockLogline = nockAPI
      .get(`/logline?id=${defaultParams.id}&slug=${defaultParams.slug}`, undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(404, undefined);

    const apiRes = await getLogline("access-token", defaultParams).catch((e) => e);
    expect(isNotFoundError(apiRes)).toBe(true);
    expect(nockLogline.isDone()).toBe(true);
  });

  it("returns internal", async () => {
    const nockLogline = nockAPI
      .get(`/logline?id=${defaultParams.id}&slug=${defaultParams.slug}`, undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(501, "crash");

    const apiRes = await getLogline("access-token", defaultParams).catch((e) => e);
    expect(isInternalError(apiRes)).toBe(true);
    expect(nockLogline.isDone()).toBe(true);
  });
});

describe("get all loglines", () => {
  let nockAPI: nock.Scope;

  const defaultParams: z.infer<typeof GetAllLoglinesParams> = {
    limit: 100,
  };

  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });

  it("returns successful response", async () => {
    const res: z.infer<typeof LoglinePreview>[] = [
      {
        slug: "my-story",
        name: "My Story",
        content: "A story about a hero's journey.",
        createdAt: new Date("2022-01-01T00:00:00Z"),
      },
    ];

    const rawRes = [
      {
        slug: "my-story",
        name: "My Story",
        content: "A story about a hero's journey.",
        createdAt: "2022-01-01T00:00:00Z",
      },
    ];

    const nockLogline = nockAPI
      .get(`/loglines?limit=${defaultParams.limit}`, undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes);

    const apiRes = await getAllLoglines("access-token", defaultParams);
    expect(apiRes).toEqual(res);

    expect(nockLogline.isDone()).toBe(true);
  });

  it("returns unauthorized", async () => {
    const nockLogline = nockAPI
      .get(`/loglines?limit=${defaultParams.limit}`, undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(401, undefined);

    const apiRes = await getAllLoglines("access-token", defaultParams).catch((e) => e);
    expect(isUnauthorizedError(apiRes)).toBe(true);
    expect(nockLogline.isDone()).toBe(true);
  });

  it("returns internal", async () => {
    const nockLogline = nockAPI
      .get(`/loglines?limit=${defaultParams.limit}`, undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(501, "crash");

    const apiRes = await getAllLoglines("access-token", defaultParams).catch((e) => e);
    expect(isInternalError(apiRes)).toBe(true);
    expect(nockLogline.isDone()).toBe(true);
  });
});

describe("generate loglines", () => {
  let nockAPI: nock.Scope;

  const defaultForm: z.infer<typeof GenerateLoglinesForm> = {
    count: 5,
    theme: "fantasy",
  };

  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });

  it("returns successful response", async () => {
    const res: z.infer<typeof LoglineIdea>[] = [
      {
        name: "My Story",
        content: "A story about a hero's journey.",
      },
    ];

    const nockLogline = nockAPI
      .post("/loglines/generate", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, res);

    const apiRes = await generateLoglines("access-token", defaultForm);
    expect(apiRes).toEqual(res);

    expect(nockLogline.isDone()).toBe(true);
  });

  it("returns unauthorized", async () => {
    const nockLogline = nockAPI
      .post("/loglines/generate", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(401, undefined);

    const apiRes = await generateLoglines("access-token", defaultForm).catch((e) => e);
    expect(isUnauthorizedError(apiRes)).toBe(true);
    expect(nockLogline.isDone()).toBe(true);
  });

  it("returns internal", async () => {
    const nockLogline = nockAPI
      .post("/loglines/generate", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(501, "crash");

    const apiRes = await generateLoglines("access-token", defaultForm).catch((e) => e);
    expect(isInternalError(apiRes)).toBe(true);
    expect(nockLogline.isDone()).toBe(true);
  });
});

describe("expand logline", () => {
  let nockAPI: nock.Scope;

  const defaultForm: z.infer<typeof LoglineIdea> = {
    name: "My Story",
    content: "A story about a hero's journey.",
  };

  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });

  it("returns successful response", async () => {
    const res: z.infer<typeof LoglineIdea> = {
      name: "My Story",
      content: "A story about a hero's journey, with twists and turns that lead to unexpected outcomes.",
    };

    const nockLogline = nockAPI
      .post("/logline/expand", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, res);

    const apiRes = await expandLogline("access-token", defaultForm);
    expect(apiRes).toEqual(res);

    expect(nockLogline.isDone()).toBe(true);
  });

  it("returns unauthorized", async () => {
    const nockLogline = nockAPI
      .post("/logline/expand", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(401, undefined);

    const apiRes = await expandLogline("access-token", defaultForm).catch((e) => e);
    expect(isUnauthorizedError(apiRes)).toBe(true);
    expect(nockLogline.isDone()).toBe(true);
  });

  it("returns internal", async () => {
    const nockLogline = nockAPI
      .post("/logline/expand", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(501, "crash");

    const apiRes = await expandLogline("access-token", defaultForm).catch((e) => e);
    expect(isInternalError(apiRes)).toBe(true);
    expect(nockLogline.isDone()).toBe(true);
  });
});
