import { MockQueryClient } from "../../__test__/mocks/query_client";
import { server } from "../../__test__/utils/setup";
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

import { http } from "@a-novel/nodelib/msw";

import { act } from "react";

import { QueryClient } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
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

    server.use(
      http
        .put("http://localhost:3000/logline")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .bodyJSON(defaultForm, HttpResponse.error())
        .resolve(() => HttpResponse.json(rawRes))
    );

    const hook = renderHook((accessToken) => CreateLogline.useAPI(accessToken), {
      initialProps: "access-token",
      wrapper: QueryWrapper(queryClient),
    });

    await act(async () => {
      const apiRes = await hook.result.current.mutateAsync(defaultForm);
      expect(apiRes).toEqual(res);
    });
  });
});

describe("get logline", () => {
  const defaultParams: z.infer<typeof GetLoglineParams> = {
    id: "29f71c01-5ae1-4b01-b729-e17488538e15",
    slug: "my-story",
  };

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

    server.use(
      http
        .get("http://localhost:3000/logline")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .searchParams(
          new URLSearchParams({ id: defaultParams.id!, slug: defaultParams.slug! }),
          true,
          HttpResponse.error()
        )
        .resolve(() => HttpResponse.json(rawRes))
    );

    const hook = renderHook(() => GetLogline.useAPI("access-token", defaultParams), {
      wrapper: QueryWrapper(queryClient),
    });

    await waitFor(() => {
      expect(hook.result.current.data).toEqual(res);
    });
  });
});

describe("get all loglines", () => {
  const defaultParams: z.infer<typeof GetAllLoglinesParams> = {
    limit: 1,
  };

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

    server.use(
      http
        .get("http://localhost:3000/loglines")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .searchParams(new URLSearchParams({ limit: "1" }), true, HttpResponse.error())
        .resolve(() => HttpResponse.json(rawRes.slice(0, 1)))
    );

    const hook = renderHook(() => GetAllLoglines.useAPI("access-token", defaultParams), {
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
        .get("http://localhost:3000/loglines")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .searchParams(new URLSearchParams({ limit: "1" }), true)
        .resolve(() => HttpResponse.json(rawRes.slice(0, 1))),
      http
        .get("http://localhost:3000/loglines")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .searchParams(new URLSearchParams({ limit: "1", offset: "1" }), true)
        .resolve(() => HttpResponse.json(rawRes.slice(1, 2))),
      http
        .get("http://localhost:3000/loglines")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .searchParams(new URLSearchParams({ limit: "1", offset: "2" }), true)
        .resolve(() => HttpResponse.json(rawRes.slice(2, 3)))
    );

    const hook = renderHook(() => GetAllLoglines.useAPI("access-token", defaultParams, { maxPages: 2 }), {
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
        .get("http://localhost:3000/loglines")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .searchParams(new URLSearchParams({ limit: "10" }), true)
        .resolve(() => HttpResponse.json(rawRes.slice(0, 1))),
      http
        .get("http://localhost:3000/loglines")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .searchParams(new URLSearchParams({ limit: "10", offset: "1" }), true)
        .resolve(() => HttpResponse.json(rawRes.slice(1, 2))),
      http
        .get("http://localhost:3000/loglines")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .searchParams(new URLSearchParams({ limit: "10", offset: "2" }), true)
        .resolve(() => HttpResponse.json(rawRes.slice(2, 3)))
    );

    const hook = renderHook(() => GetAllLoglines.useAPI("access-token", { limit: 10 }, { maxPages: 2 }), {
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

describe("generate loglines", () => {
  const defaultForm: z.infer<typeof GenerateLoglinesForm> = {
    lang: "en",
    count: 5,
    theme: "fantasy",
  };

  it("returns successful response", async () => {
    const res: z.infer<typeof LoglineIdea>[] = [
      {
        lang: "en",
        name: "My Story",
        content: "A story about a hero's journey.",
      },
    ];

    const queryClient = new QueryClient(MockQueryClient);

    server.use(
      http
        .post("http://localhost:3000/loglines/generate")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .bodyJSON(defaultForm, HttpResponse.error())
        .resolve(() => HttpResponse.json(res))
    );

    const hook = renderHook((accessToken) => GenerateLoglines.useAPI(accessToken), {
      initialProps: "access-token",
      wrapper: QueryWrapper(queryClient),
    });

    await act(async () => {
      const apiRes = await hook.result.current.mutateAsync(defaultForm);
      expect(apiRes).toEqual(res);
    });
  });
});

describe("expand logline", () => {
  const defaultForm: z.infer<typeof LoglineIdea> = {
    lang: "en",
    name: "My Story",
    content: "A story about a hero's journey.",
  };

  it("returns successful response", async () => {
    const res: z.infer<typeof LoglineIdea> = {
      lang: "en",
      name: "My Story",
      content: "A story about a hero's journey, with twists and turns that lead to unexpected outcomes.",
    };

    const queryClient = new QueryClient(MockQueryClient);

    server.use(
      http
        .post("http://localhost:3000/logline/expand")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .bodyJSON(defaultForm, HttpResponse.error())
        .resolve(() => HttpResponse.json(res))
    );

    const hook = renderHook((accessToken) => ExpandLogline.useAPI(accessToken), {
      initialProps: "access-token",
      wrapper: QueryWrapper(queryClient),
    });

    await act(async () => {
      const apiRes = await hook.result.current.mutateAsync(defaultForm);
      expect(apiRes).toEqual(res);
    });
  });
});
