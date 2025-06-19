import { MockQueryClient } from "../../__test__/mocks/query_client";
import { genericSetup } from "../../__test__/utils/setup";
import { QueryWrapper } from "../../__test__/utils/wrapper";
import {
  LoglinePreview,
  CreateLoglineForm,
  GetAllLoglinesParams,
  GetLoglineParams,
  Logline,
  GenerateLoglinesForm,
  LoglineIdea,
} from "../api";
import { CreateLogline, ExpandLogline, GenerateLoglines, GetAllLoglines, GetLogline } from "./index";

import { act } from "react";

import { QueryClient } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import nock from "nock";
import { describe, expect, it } from "vitest";
import { z } from "zod";

describe("create logline", () => {
  let nockAPI: nock.Scope;

  const defaultForm: z.infer<typeof CreateLoglineForm> = {
    lang: "en",
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
      lang: "en",
      userID: "29f71c01-5ae1-4b01-b729-e17488538e15",
      slug: "my-story",
      name: "My Story",
      content: "A story about a hero's journey.",
      createdAt: new Date("2022-01-01T00:00:00Z"),
    };

    const rawRes = {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      lang: "en",
      userID: "29f71c01-5ae1-4b01-b729-e17488538e15",
      slug: "my-story",
      name: "My Story",
      content: "A story about a hero's journey.",
      createdAt: "2022-01-01T00:00:00Z",
    };

    const queryClient = new QueryClient(MockQueryClient);

    const nockLogline = nockAPI
      .put("/logline", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, rawRes);

    const hook = renderHook((accessToken) => CreateLogline.useAPI(accessToken), {
      initialProps: "access-token",
      wrapper: QueryWrapper(queryClient),
    });

    await act(async () => {
      const apiRes = await hook.result.current.mutateAsync(defaultForm);
      expect(apiRes).toEqual(res);
    });

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
      lang: "en",
      userID: "29f71c01-5ae1-4b01-b729-e17488538e15",
      slug: "my-story",
      name: "My Story",
      content: "A story about a hero's journey.",
      createdAt: new Date("2022-01-01T00:00:00Z"),
    };

    const rawRes = {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      lang: "en",
      userID: "29f71c01-5ae1-4b01-b729-e17488538e15",
      slug: "my-story",
      name: "My Story",
      content: "A story about a hero's journey.",
      createdAt: "2022-01-01T00:00:00Z",
    };

    const queryClient = new QueryClient(MockQueryClient);

    const nockLogline = nockAPI
      .get(`/logline?id=${defaultParams.id}&slug=${defaultParams.slug}`, undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes);

    const hook = renderHook(() => GetLogline.useAPI("access-token", defaultParams), {
      wrapper: QueryWrapper(queryClient),
    });

    await waitFor(() => {
      expect(nockLogline.isDone()).toBe(true);
    });
    expect(hook.result.current.data).toEqual(res);
  });
});

describe("get all loglines", () => {
  let nockAPI: nock.Scope;

  const defaultParams: z.infer<typeof GetAllLoglinesParams> = {
    limit: 1,
  };

  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });
  const res: z.infer<typeof LoglinePreview>[] = [
    {
      lang: "en",
      slug: "my-story",
      name: "My Story",
      content: "A story about a hero's journey.",
      createdAt: new Date("2022-01-01T00:00:00Z"),
    },
    {
      lang: "en",
      slug: "my-second-story",
      name: "My Second Story",
      content: "A story about a hero's journey.",
      createdAt: new Date("2022-01-02T00:00:00Z"),
    },
    {
      lang: "en",
      slug: "my-third-story",
      name: "My Third Story",
      content: "A story about a hero's journey.",
      createdAt: new Date("2022-01-03T00:00:00Z"),
    },
  ];

  const rawRes = [
    {
      lang: "en",
      slug: "my-story",
      name: "My Story",
      content: "A story about a hero's journey.",
      createdAt: "2022-01-01T00:00:00Z",
    },
    {
      lang: "en",
      slug: "my-second-story",
      name: "My Second Story",
      content: "A story about a hero's journey.",
      createdAt: "2022-01-02T00:00:00Z",
    },
    {
      lang: "en",
      slug: "my-third-story",
      name: "My Third Story",
      content: "A story about a hero's journey.",
      createdAt: "2022-01-03T00:00:00Z",
    },
  ];

  it("returns first page", async () => {
    const queryClient = new QueryClient(MockQueryClient);

    const nockUsers = nockAPI
      .get("/loglines?limit=1", undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes.slice(0, 1));

    const hook = renderHook(() => GetAllLoglines.useAPI("access-token", defaultParams), {
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
      .get("/loglines?limit=1", undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes.slice(0, 1));

    const hook = renderHook(() => GetAllLoglines.useAPI("access-token", defaultParams, { maxPages: 2 }), {
      wrapper: QueryWrapper(queryClient),
    });

    await waitFor(() => {
      expect(nockUsers.isDone()).toBe(true);
      expect(hook.result.current.data?.pages.flat()).toEqual(res.slice(0, 1));
    });

    nockUsers = nockAPI
      .get("/loglines?limit=1&offset=1", undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes.slice(1, 2))
      .get("/loglines?limit=1&offset=2", undefined, {
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
      .get("/loglines?limit=10", undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes.slice(0, 1));

    const hook = renderHook(() => GetAllLoglines.useAPI("access-token", { limit: 10 }, { maxPages: 2 }), {
      wrapper: QueryWrapper(queryClient),
    });

    await waitFor(() => {
      expect(nockUsers.isDone()).toBe(true);
      expect(hook.result.current.data?.pages.flat()).toEqual(res.slice(0, 1));
    });

    nockUsers = nockAPI
      .get("/loglines?limit=10&offset=1", undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes.slice(1, 2))
      .get("/loglines?limit=10&offset=2", undefined, {
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
      .get("/loglines?limit=10", undefined, {
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

describe("generate loglines", () => {
  let nockAPI: nock.Scope;

  const defaultForm: z.infer<typeof GenerateLoglinesForm> = {
    lang: "en",
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
        lang: "en",
        name: "My Story",
        content: "A story about a hero's journey.",
      },
    ];

    const queryClient = new QueryClient(MockQueryClient);

    const nockLogline = nockAPI
      .post("/loglines/generate", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, res);

    const hook = renderHook((accessToken) => GenerateLoglines.useAPI(accessToken), {
      initialProps: "access-token",
      wrapper: QueryWrapper(queryClient),
    });

    await act(async () => {
      const apiRes = await hook.result.current.mutateAsync(defaultForm);
      expect(apiRes).toEqual(res);
    });

    expect(nockLogline.isDone()).toBe(true);
  });
});

describe("expand logline", () => {
  let nockAPI: nock.Scope;

  const defaultForm: z.infer<typeof LoglineIdea> = {
    lang: "en",
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
      lang: "en",
      name: "My Story",
      content: "A story about a hero's journey, with twists and turns that lead to unexpected outcomes.",
    };

    const queryClient = new QueryClient(MockQueryClient);

    const nockLogline = nockAPI
      .post("/logline/expand", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, res);

    const hook = renderHook((accessToken) => ExpandLogline.useAPI(accessToken), {
      initialProps: "access-token",
      wrapper: QueryWrapper(queryClient),
    });

    await act(async () => {
      const apiRes = await hook.result.current.mutateAsync(defaultForm);
      expect(apiRes).toEqual(res);
    });

    expect(nockLogline.isDone()).toBe(true);
  });
});
