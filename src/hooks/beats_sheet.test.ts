import { MockQueryClient } from "../../__test__/mocks/query_client";
import { genericSetup } from "../../__test__/utils/setup";
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

import { act } from "react";

import { QueryClient } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import nock from "nock";
import { describe, expect, it } from "vitest";
import { z } from "zod";

describe("create beats sheet", () => {
  let nockAPI: nock.Scope;

  const defaultForm: z.infer<typeof CreateBeatsSheetForm> = {
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

    const queryClient = new QueryClient(MockQueryClient);

    const nockBeatsSheet = nockAPI
      .put("/beats-sheet", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, rawRes);

    const hook = renderHook((accessToken) => CreateBeatsSheet.useAPI(accessToken), {
      initialProps: "access-token",
      wrapper: QueryWrapper(queryClient),
    });

    await act(async () => {
      const apiRes = await hook.result.current.mutateAsync(defaultForm);
      expect(apiRes).toEqual(res);
    });

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

    const queryClient = new QueryClient(MockQueryClient);

    const nockBeatsSheet = nockAPI
      .get(`/beats-sheet?beatsSheetID=${defaultParams.beatsSheetID}`, undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes);

    const hook = renderHook(() => GetBeatsSheet.useAPI("access-token", defaultParams), {
      wrapper: QueryWrapper(queryClient),
    });

    await waitFor(() => {
      expect(nockBeatsSheet.isDone()).toBe(true);
    });
    expect(hook.result.current.data).toEqual(res);
  });
});

describe("get all beats sheets", () => {
  let nockAPI: nock.Scope;

  const defaultParams: z.infer<typeof GetAllBeatsSheetsParams> = {
    loglineID: "29f71c01-5ae1-4b01-b729-e17488538e15",
    limit: 1,
  };

  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });
  const res: z.infer<typeof BeatsSheetPreview>[] = [
    {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      createdAt: new Date("2022-01-01T00:00:00Z"),
    },
    {
      id: "abcd1234-abcd-1234-abcd-1234567890ab",
      createdAt: new Date("2022-01-02T00:00:00Z"),
    },
    {
      id: "876f1234-5678-1234-5678-1234567890ab",
      createdAt: new Date("2022-01-03T00:00:00Z"),
    },
  ];

  const rawRes = [
    {
      id: "29f71c01-5ae1-4b01-b729-e17488538e15",
      createdAt: "2022-01-01T00:00:00Z",
    },
    {
      id: "abcd1234-abcd-1234-abcd-1234567890ab",
      createdAt: "2022-01-02T00:00:00Z",
    },
    {
      id: "876f1234-5678-1234-5678-1234567890ab",
      createdAt: "2022-01-03T00:00:00Z",
    },
  ];

  it("returns first page", async () => {
    const queryClient = new QueryClient(MockQueryClient);

    const nockUsers = nockAPI
      .get("/beats-sheets?loglineID=29f71c01-5ae1-4b01-b729-e17488538e15&limit=1", undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes.slice(0, 1));

    const hook = renderHook(() => GetAllBeatsSheets.useAPI("access-token", defaultParams), {
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
      .get("/beats-sheets?loglineID=29f71c01-5ae1-4b01-b729-e17488538e15&limit=1", undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes.slice(0, 1));

    const hook = renderHook(() => GetAllBeatsSheets.useAPI("access-token", defaultParams, { maxPages: 2 }), {
      wrapper: QueryWrapper(queryClient),
    });

    await waitFor(() => {
      expect(nockUsers.isDone()).toBe(true);
      expect(hook.result.current.data?.pages.flat()).toEqual(res.slice(0, 1));
    });

    nockUsers = nockAPI
      .get("/beats-sheets?loglineID=29f71c01-5ae1-4b01-b729-e17488538e15&limit=1&offset=1", undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes.slice(1, 2))
      .get("/beats-sheets?loglineID=29f71c01-5ae1-4b01-b729-e17488538e15&limit=1&offset=2", undefined, {
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
      .get("/beats-sheets?loglineID=29f71c01-5ae1-4b01-b729-e17488538e15&limit=10", undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes.slice(0, 1));

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
      expect(nockUsers.isDone()).toBe(true);
      expect(hook.result.current.data?.pages.flat()).toEqual(res.slice(0, 1));
    });

    nockUsers = nockAPI
      .get("/beats-sheets?loglineID=29f71c01-5ae1-4b01-b729-e17488538e15&limit=10&offset=1", undefined, {
        reqheaders: { Authorization: "Bearer access-token" },
      })
      .reply(200, rawRes.slice(1, 2))
      .get("/beats-sheets?loglineID=29f71c01-5ae1-4b01-b729-e17488538e15&limit=10&offset=2", undefined, {
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
      .get("/beats-sheets?loglineID=29f71c01-5ae1-4b01-b729-e17488538e15&limit=10", undefined, {
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

describe("generate beats sheet", () => {
  let nockAPI: nock.Scope;

  const defaultForm: z.infer<typeof GenerateBeatsSheetForm> = {
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
      content: [
        {
          key: "beat-1",
          title: "Introduction",
          content: "The protagonist is introduced to the reader.",
        },
      ],
    };

    const queryClient = new QueryClient(MockQueryClient);

    const nockBeatsSheet = nockAPI
      .post("/beats-sheet/generate", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, res);

    const hook = renderHook((accessToken) => GenerateBeatsSheet.useAPI(accessToken), {
      initialProps: "access-token",
      wrapper: QueryWrapper(queryClient),
    });

    await act(async () => {
      const apiRes = await hook.result.current.mutateAsync(defaultForm);
      expect(apiRes).toEqual(res);
    });

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

    const queryClient = new QueryClient(MockQueryClient);

    const nockBeatsSheet = nockAPI
      .patch("/beats-sheet/regenerate", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, rawRes);

    const hook = renderHook((accessToken) => RegenerateBeats.useAPI(accessToken), {
      initialProps: "access-token",
      wrapper: QueryWrapper(queryClient),
    });

    await act(async () => {
      const apiRes = await hook.result.current.mutateAsync(defaultForm);
      expect(apiRes).toEqual(res);
    });

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

    const queryClient = new QueryClient(MockQueryClient);

    const nockBeatsSheet = nockAPI
      .patch("/beats-sheet/expand", defaultForm, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, res);

    const hook = renderHook((accessToken) => ExpandBeat.useAPI(accessToken), {
      initialProps: "access-token",
      wrapper: QueryWrapper(queryClient),
    });

    await act(async () => {
      const apiRes = await hook.result.current.mutateAsync(defaultForm);
      expect(apiRes).toEqual(res);
    });

    expect(nockBeatsSheet.isDone()).toBe(true);
  });
});
