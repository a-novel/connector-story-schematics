import { MockQueryClient } from "../../__test__/mocks/query_client";
import { server } from "../../__test__/utils/setup";
import { QueryWrapper } from "../../__test__/utils/wrapper";
import {
  Beat,
  BeatsSheet,
  BeatsSheetIdea,
  BeatsSheetPreview,
  CreateBeatsSheetForm,
  ExpandBeatForm,
  GenerateBeatsSheetForm,
  GetAllBeatsSheetsParams,
  GetBeatsSheetParams,
  RegenerateBeatForm,
} from "../api";
import {
  CreateBeatsSheet,
  ExpandBeat,
  GenerateBeatsSheet,
  GetAllBeatsSheets,
  GetBeatsSheet,
  RegenerateBeats,
} from "./index";

import { http } from "@a-novel/nodelib/msw";

import { act } from "react";

import { QueryClient } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
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

  it("returns successful response", async () => {
    const res: z.infer<typeof BeatsSheet> = {
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
    };

    const rawRes = {
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
    };

    const queryClient = new QueryClient(MockQueryClient);

    server.use(
      http
        .put("http://localhost:3000/beats-sheet")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .bodyJSON(defaultForm, HttpResponse.error())
        .resolve(() => HttpResponse.json(rawRes))
    );

    const hook = renderHook((accessToken) => CreateBeatsSheet.useAPI(accessToken), {
      initialProps: "access-token",
      wrapper: QueryWrapper(queryClient),
    });

    await act(async () => {
      const apiRes = await hook.result.current.mutateAsync(defaultForm);
      expect(apiRes).toEqual(res);
    });
  });
});

describe("get beats sheet", () => {
  const defaultParams: z.infer<typeof GetBeatsSheetParams> = {
    beatsSheetID: "29f71c01-5ae1-4b01-b729-e17488538e15",
  };

  it("returns successful response", async () => {
    const res: z.infer<typeof BeatsSheet> = {
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
    };

    const rawRes = {
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
    };

    const queryClient = new QueryClient(MockQueryClient);

    server.use(
      http
        .get("http://localhost:3000/beats-sheet")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .searchParams(new URLSearchParams({ beatsSheetID: defaultParams.beatsSheetID }), true, HttpResponse.error())
        .resolve(() => HttpResponse.json(rawRes))
    );

    const hook = renderHook(() => GetBeatsSheet.useAPI("access-token", defaultParams), {
      wrapper: QueryWrapper(queryClient),
    });

    await waitFor(() => {
      expect(hook.result.current.data).toEqual(res);
    });
  });
});

describe("get all beats sheets", () => {
  const defaultParams: z.infer<typeof GetAllBeatsSheetsParams> = {
    loglineID: "29f71c01-5ae1-4b01-b729-e17488538e15",
    limit: 1,
  };

  const res: z.infer<typeof BeatsSheetPreview>[] = [
    {
      lang: "en",
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      createdAt: new Date("2022-01-01T00:00:00Z"),
    },
    {
      lang: "en",
      id: "abcd1234-abcd-1234-abcd-1234567890ab",
      createdAt: new Date("2022-01-02T00:00:00Z"),
    },
    {
      lang: "en",
      id: "94b4d288-dbff-4eca-805a-f45311a34e15",
      createdAt: new Date("2022-01-03T00:00:00Z"),
    },
  ];

  const rawRes = [
    {
      lang: "en",
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      createdAt: "2022-01-01T00:00:00Z",
    },
    {
      lang: "en",
      id: "abcd1234-abcd-1234-abcd-1234567890ab",
      createdAt: "2022-01-02T00:00:00Z",
    },
    {
      lang: "en",
      id: "94b4d288-dbff-4eca-805a-f45311a34e15",
      createdAt: "2022-01-03T00:00:00Z",
    },
  ];

  it("returns first page", async () => {
    const queryClient = new QueryClient(MockQueryClient);

    server.use(
      http
        .get("http://localhost:3000/beats-sheets")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .searchParams(
          new URLSearchParams({ loglineID: defaultParams.loglineID, limit: "1" }),
          true,
          HttpResponse.error()
        )
        .resolve(() => HttpResponse.json(rawRes.slice(0, 1)))
    );

    const hook = renderHook(() => GetAllBeatsSheets.useAPI("access-token", defaultParams), {
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
        .get("http://localhost:3000/beats-sheets")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .searchParams(new URLSearchParams({ loglineID: defaultParams.loglineID, limit: "1" }), true)
        .resolve(() => HttpResponse.json(rawRes.slice(0, 1))),
      http
        .get("http://localhost:3000/beats-sheets")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .searchParams(new URLSearchParams({ loglineID: defaultParams.loglineID, limit: "1", offset: "1" }), true)
        .resolve(() => HttpResponse.json(rawRes.slice(1, 2))),
      http
        .get("http://localhost:3000/beats-sheets")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .searchParams(new URLSearchParams({ loglineID: defaultParams.loglineID, limit: "1", offset: "2" }), true)
        .resolve(() => HttpResponse.json(rawRes.slice(2, 3)))
    );

    const hook = renderHook(() => GetAllBeatsSheets.useAPI("access-token", defaultParams, { maxPages: 2 }), {
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
        .get("http://localhost:3000/beats-sheets")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .searchParams(new URLSearchParams({ loglineID: defaultParams.loglineID, limit: "10" }), true)
        .resolve(() => HttpResponse.json(rawRes.slice(0, 1))),
      http
        .get("http://localhost:3000/beats-sheets")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .searchParams(new URLSearchParams({ loglineID: defaultParams.loglineID, limit: "10", offset: "1" }), true)
        .resolve(() => HttpResponse.json(rawRes.slice(1, 2))),
      http
        .get("http://localhost:3000/beats-sheets")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .searchParams(new URLSearchParams({ loglineID: defaultParams.loglineID, limit: "10", offset: "2" }), true)
        .resolve(() => HttpResponse.json(rawRes.slice(2, 3)))
    );

    const hook = renderHook(
      () =>
        GetAllBeatsSheets.useAPI(
          "access-token",
          { limit: 10, loglineID: "29f71c01-5ae1-4b01-b729-e17488538e15" },
          { maxPages: 2 }
        ),
      {
        wrapper: QueryWrapper(queryClient),
      }
    );

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

describe("generate beats sheet", () => {
  const defaultForm: z.infer<typeof GenerateBeatsSheetForm> = {
    lang: "en",
    loglineID: "29f71c01-5ae1-4b01-b729-e17488538e15",
  };

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

    const queryClient = new QueryClient(MockQueryClient);

    server.use(
      http
        .post("http://localhost:3000/beats-sheet/generate")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .bodyJSON(defaultForm, HttpResponse.error())
        .resolve(() => HttpResponse.json(res))
    );

    const hook = renderHook((accessToken) => GenerateBeatsSheet.useAPI(accessToken), {
      initialProps: "access-token",
      wrapper: QueryWrapper(queryClient),
    });

    await act(async () => {
      const apiRes = await hook.result.current.mutateAsync(defaultForm);
      expect(apiRes).toEqual(res);
    });
  });
});

describe("regenerate beats", () => {
  const defaultForm: z.infer<typeof RegenerateBeatForm> = {
    beatsSheetID: "29f71c01-5ae1-4b01-b729-e17488538e15",
    regenerateKeys: ["beat-1"],
  };

  it("returns successful response", async () => {
    const res: z.infer<typeof BeatsSheet> = {
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
    };

    const rawRes = {
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
    };

    const queryClient = new QueryClient(MockQueryClient);

    server.use(
      http
        .patch("http://localhost:3000/beats-sheet/regenerate")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .bodyJSON(defaultForm, HttpResponse.error())
        .resolve(() => HttpResponse.json(rawRes))
    );

    const hook = renderHook((accessToken) => RegenerateBeats.useAPI(accessToken), {
      initialProps: "access-token",
      wrapper: QueryWrapper(queryClient),
    });

    await act(async () => {
      const apiRes = await hook.result.current.mutateAsync(defaultForm);
      expect(apiRes).toEqual(res);
    });
  });
});

describe("expand beat", () => {
  const defaultForm: z.infer<typeof ExpandBeatForm> = {
    beatsSheetID: "29f71c01-5ae1-4b01-b729-e17488538e15",
    targetKey: "beat-1",
  };

  it("returns successful response", async () => {
    const res: z.infer<typeof Beat> = {
      key: "beat-1",
      title: "Introduction",
      content: "The protagonist is introduced to the reader.",
    };

    const queryClient = new QueryClient(MockQueryClient);

    server.use(
      http
        .patch("http://localhost:3000/beats-sheet/expand")
        .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
        .bodyJSON(defaultForm, HttpResponse.error())
        .resolve(() => HttpResponse.json(res))
    );

    const hook = renderHook((accessToken) => ExpandBeat.useAPI(accessToken), {
      initialProps: "access-token",
      wrapper: QueryWrapper(queryClient),
    });

    await act(async () => {
      const apiRes = await hook.result.current.mutateAsync(defaultForm);
      expect(apiRes).toEqual(res);
    });
  });
});
