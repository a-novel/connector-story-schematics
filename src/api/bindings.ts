import { z } from "zod";

// Mappings for the story-schematics API.
// https://a-novel.github.io/service-story-schematics/

export const BINDINGS_VALIDATION = {
  SLUG: { MIN: 1, MAX: 1024 },
  BEAT: {
    KEY: { MIN: 1, MAX: 128 },
    TITLE: { MIN: 1, MAX: 512 },
    CONTENT: { MIN: 1, MAX: 16384 },
  },
  BEATS_SHEET: {
    BEATS: { MIN: 1, MAX: 128 },
  },
  LOGLINE: {
    NAME: { MIN: 1, MAX: 512 },
    CONTENT: { MIN: 1, MAX: 16384 },
  },
  BEAT_DEFINITION: {
    KEY: { MIN: 1, MAX: 128 },
    NAME: { MIN: 1, MAX: 512 },
    KEY_POINTS: { MIN: 1, MAX: 128 },
    PURPOSE: { MIN: 1, MAX: 8192 },
    MIN_SCENES: { MIN: 0, MAX: 10 },
    MAX_SCENES: { MIN: 0, MAX: 10 },
  },
  STORY_PLAN: {
    NAME: { MIN: 1, MAX: 512 },
    DESCRIPTION: { MIN: 1, MAX: 4096 },
    BEATS: { MIN: 1, MAX: 128 },
  },
  GENERATE_LOGLINES: {
    COUNT: { MIN: 1, MAX: 10 },
    THEME: { MIN: 1, MAX: 16384 },
  },
  STORY_PLANS: {
    LIMIT: { MIN: 1, MAX: 100 },
    OFFSET: { MIN: 0 },
  },
  LOGLINES: {
    LIMIT: { MIN: 1, MAX: 100 },
    OFFSET: { MIN: 0 },
  },
  BEATS_SHEETS: {
    LIMIT: { MIN: 1, MAX: 100 },
    OFFSET: { MIN: 0 },
  },
};

// =====================================================================================================================
// DEFINITIONS
// =====================================================================================================================

/**
 * The token used to authenticate the session. This token can be passed as a header to http requests on
 * protected routes.
 */
export const Token = z.string();

/**
 * The unique identifier of the user.
 */
export const UserID = z.uuid();

/**
 * The unique identifier of the logline.
 */
export const LoglineID = z.uuid();

/**
 * The unique identifier of the story plan.
 */
export const StoryPlanID = z.uuid();

/**
 * The unique identifier of the beats sheet.
 */
export const BeatsSheetID = z.uuid();

export const Lang = z.enum(["en", "fr"]);

/**
 * A string that can be used as a URL slug.
 */
export const Slug = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  .min(BINDINGS_VALIDATION.SLUG.MIN)
  .max(BINDINGS_VALIDATION.SLUG.MAX);

export const BeatKey = z.string().min(BINDINGS_VALIDATION.BEAT.KEY.MIN).max(BINDINGS_VALIDATION.BEAT.KEY.MAX);

/**
 * A beat is a single unit of a story, representing an action through a sequence of scenes.
 */
export const Beat = z.object({
  /**
   * Unique identifier of the beat in a story plan.
   */
  key: BeatKey,
  /**
   * The title of the beat.
   */
  title: z.string().min(1).max(BINDINGS_VALIDATION.BEAT.TITLE.MAX).max(BINDINGS_VALIDATION.BEAT.TITLE.MAX),
  /**
   * The content of the beat.
   */
  content: z.string().min(BINDINGS_VALIDATION.BEAT.CONTENT.MIN).max(BINDINGS_VALIDATION.BEAT.CONTENT.MAX),
});

/**
 * A beats sheet is a detailed outline of a story, breaking it down into its individual beats.
 */
export const BeatsSheet = z.object({
  id: BeatsSheetID,
  loglineID: LoglineID,
  storyPlanID: StoryPlanID,
  lang: Lang,
  content: z.array(Beat).min(BINDINGS_VALIDATION.BEATS_SHEET.BEATS.MIN).max(BINDINGS_VALIDATION.BEATS_SHEET.BEATS.MAX),
  createdAt: z.iso.datetime().transform((value) => new Date(value)),
});

export const BeatsSheetIdea = z.object({
  lang: Lang,
  content: z.array(Beat).min(BINDINGS_VALIDATION.BEATS_SHEET.BEATS.MIN).max(BINDINGS_VALIDATION.BEATS_SHEET.BEATS.MAX),
});

export const BeatsSheetPreview = z.object({
  id: BeatsSheetID,
  lang: Lang,
  createdAt: z.iso.datetime().transform((value) => new Date(value)),
});

/**
 * A logline is a brief summary of a story, used to quickly convey its essence.
 */
export const Logline = z.object({
  id: LoglineID,
  userID: UserID,
  slug: Slug,
  lang: Lang,
  name: z.string().min(BINDINGS_VALIDATION.LOGLINE.NAME.MIN).max(BINDINGS_VALIDATION.LOGLINE.NAME.MAX),
  content: z.string().min(BINDINGS_VALIDATION.LOGLINE.CONTENT.MIN).max(BINDINGS_VALIDATION.LOGLINE.CONTENT.MAX),
  createdAt: z.iso.datetime().transform((value) => new Date(value)),
});

export const LoglinePreview = z.object({
  slug: Slug,
  lang: Lang,
  name: z.string().min(BINDINGS_VALIDATION.LOGLINE.NAME.MIN).max(BINDINGS_VALIDATION.LOGLINE.NAME.MAX),
  content: z.string().min(BINDINGS_VALIDATION.LOGLINE.CONTENT.MIN).max(BINDINGS_VALIDATION.LOGLINE.CONTENT.MAX),
  createdAt: z.iso.datetime().transform((value) => new Date(value)),
});

export const LoglineIdea = z.object({
  lang: Lang,
  name: z.string().min(BINDINGS_VALIDATION.LOGLINE.NAME.MIN).max(BINDINGS_VALIDATION.LOGLINE.NAME.MAX),
  content: z.string().min(BINDINGS_VALIDATION.LOGLINE.CONTENT.MIN).max(BINDINGS_VALIDATION.LOGLINE.CONTENT.MAX),
});

/**
 * A beat is a key event in a story that drives the plot forward. It is used to structure the story and ensure its
 * coherence. A beat describes the content of a beat.
 */
export const BeatDefinition = z
  .object({
    key: z.string().min(BINDINGS_VALIDATION.BEAT_DEFINITION.KEY.MIN).max(BINDINGS_VALIDATION.BEAT_DEFINITION.KEY.MAX),
    name: z
      .string()
      .min(BINDINGS_VALIDATION.BEAT_DEFINITION.NAME.MIN)
      .max(BINDINGS_VALIDATION.BEAT_DEFINITION.NAME.MAX),
    keyPoints: z
      .array(z.string().min(1).max(512))
      .min(BINDINGS_VALIDATION.BEAT_DEFINITION.KEY_POINTS.MIN)
      .max(BINDINGS_VALIDATION.BEAT_DEFINITION.KEY_POINTS.MAX),
    purpose: z
      .string()
      .min(BINDINGS_VALIDATION.BEAT_DEFINITION.PURPOSE.MIN)
      .max(BINDINGS_VALIDATION.BEAT_DEFINITION.PURPOSE.MAX),
    minScenes: z
      .number()
      .min(BINDINGS_VALIDATION.BEAT_DEFINITION.MIN_SCENES.MIN)
      .max(BINDINGS_VALIDATION.BEAT_DEFINITION.MIN_SCENES.MAX),
    maxScenes: z
      .number()
      .min(BINDINGS_VALIDATION.BEAT_DEFINITION.MAX_SCENES.MIN)
      .max(BINDINGS_VALIDATION.BEAT_DEFINITION.MAX_SCENES.MAX),
  })
  .refine((data) => data.minScenes <= data.maxScenes);

/**
 * A story plan structures the output of the story schematics service. It describes the different beats of a story,
 * controlling its final shape.
 */
export const StoryPlan = z.object({
  id: StoryPlanID,
  slug: Slug,
  lang: Lang,
  name: z.string().min(BINDINGS_VALIDATION.STORY_PLAN.NAME.MIN).max(BINDINGS_VALIDATION.STORY_PLAN.NAME.MAX),
  description: z
    .string()
    .min(BINDINGS_VALIDATION.STORY_PLAN.DESCRIPTION.MIN)
    .max(BINDINGS_VALIDATION.STORY_PLAN.DESCRIPTION.MAX),
  beats: z
    .array(BeatDefinition)
    .min(BINDINGS_VALIDATION.STORY_PLAN.BEATS.MIN)
    .max(BINDINGS_VALIDATION.STORY_PLAN.BEATS.MAX),
  createdAt: z.iso.datetime().transform((value) => new Date(value)),
});

export const StoryPlanPreview = z.object({
  id: StoryPlanID,
  slug: Slug,
  lang: Lang,
  name: z.string().min(BINDINGS_VALIDATION.STORY_PLAN.NAME.MIN).max(BINDINGS_VALIDATION.STORY_PLAN.NAME.MAX),
  description: z
    .string()
    .min(BINDINGS_VALIDATION.STORY_PLAN.DESCRIPTION.MIN)
    .max(BINDINGS_VALIDATION.STORY_PLAN.DESCRIPTION.MAX),
  createdAt: z.iso.datetime().transform((value) => new Date(value)),
});

export const CreateBeatsSheetForm = z.object({
  lang: Lang,
  loglineID: LoglineID,
  storyPlanID: StoryPlanID,
  content: z.array(Beat).min(BINDINGS_VALIDATION.BEATS_SHEET.BEATS.MIN).max(BINDINGS_VALIDATION.BEATS_SHEET.BEATS.MAX),
});

export const CreateLoglineForm = z.object({
  slug: Slug,
  lang: Lang,
  name: z.string().min(BINDINGS_VALIDATION.LOGLINE.NAME.MIN).max(BINDINGS_VALIDATION.LOGLINE.NAME.MAX),
  content: z.string().min(BINDINGS_VALIDATION.LOGLINE.CONTENT.MIN).max(BINDINGS_VALIDATION.LOGLINE.CONTENT.MAX),
});

export const CreateStoryPlanForm = z.object({
  slug: Slug,
  lang: Lang,
  name: z.string().min(BINDINGS_VALIDATION.STORY_PLAN.NAME.MIN).max(BINDINGS_VALIDATION.STORY_PLAN.NAME.MAX),
  description: z
    .string()
    .min(BINDINGS_VALIDATION.STORY_PLAN.DESCRIPTION.MIN)
    .max(BINDINGS_VALIDATION.STORY_PLAN.DESCRIPTION.MAX),
  beats: z
    .array(BeatDefinition)
    .min(BINDINGS_VALIDATION.STORY_PLAN.BEATS.MIN)
    .max(BINDINGS_VALIDATION.STORY_PLAN.BEATS.MAX),
});

export const ExpandBeatForm = z.object({
  beatsSheetID: BeatsSheetID,
  targetKey: BeatKey,
});

export const GenerateBeatsSheetForm = z.object({
  lang: Lang,
  loglineID: LoglineID,
  storyPlanID: StoryPlanID,
});

export const GenerateLoglinesForm = z.object({
  lang: Lang,
  count: z
    .number()
    .min(BINDINGS_VALIDATION.GENERATE_LOGLINES.COUNT.MIN)
    .max(BINDINGS_VALIDATION.GENERATE_LOGLINES.COUNT.MAX),
  theme: z
    .string()
    .min(BINDINGS_VALIDATION.GENERATE_LOGLINES.THEME.MIN)
    .max(BINDINGS_VALIDATION.GENERATE_LOGLINES.THEME.MAX),
});

export const RegenerateBeatForm = z.object({
  beatsSheetID: BeatsSheetID,
  regenerateKeys: BeatKey.array(),
});

export const UpdateStoryPlanForm = z.object({
  slug: Slug,
  lang: Lang,
  name: z.string().min(BINDINGS_VALIDATION.STORY_PLAN.NAME.MIN).max(BINDINGS_VALIDATION.STORY_PLAN.NAME.MAX),
  description: z
    .string()
    .min(BINDINGS_VALIDATION.STORY_PLAN.DESCRIPTION.MIN)
    .max(BINDINGS_VALIDATION.STORY_PLAN.DESCRIPTION.MAX),
  beats: z
    .array(BeatDefinition)
    .min(BINDINGS_VALIDATION.STORY_PLAN.BEATS.MIN)
    .max(BINDINGS_VALIDATION.STORY_PLAN.BEATS.MAX),
});

// =====================================================================================================================
// PARAMETERS
// =====================================================================================================================

export const GetStoryPlanParams = z.object({
  id: StoryPlanID.optional(),
  slug: Slug.optional(),
});

export const GetAllStoryPlansParams = z.object({
  limit: z
    .number()
    .min(BINDINGS_VALIDATION.STORY_PLANS.LIMIT.MIN)
    .max(BINDINGS_VALIDATION.STORY_PLANS.LIMIT.MAX)
    .optional(),
  offset: z.number().min(BINDINGS_VALIDATION.STORY_PLANS.OFFSET.MIN).optional(),
});

export const GetLoglineParams = z.object({
  id: LoglineID.optional(),
  slug: Slug.optional(),
});

export const GetAllLoglinesParams = z.object({
  limit: z.number().min(BINDINGS_VALIDATION.LOGLINES.LIMIT.MIN).max(BINDINGS_VALIDATION.LOGLINES.LIMIT.MAX).optional(),
  offset: z.number().min(BINDINGS_VALIDATION.LOGLINES.OFFSET.MIN).optional(),
});

export const GetBeatsSheetParams = z.object({
  beatsSheetID: BeatsSheetID,
});

export const GetAllBeatsSheetsParams = z.object({
  loglineID: LoglineID,
  limit: z
    .number()
    .min(BINDINGS_VALIDATION.BEATS_SHEETS.LIMIT.MIN)
    .max(BINDINGS_VALIDATION.BEATS_SHEETS.LIMIT.MAX)
    .optional(),
  offset: z.number().min(BINDINGS_VALIDATION.BEATS_SHEETS.OFFSET.MIN).optional(),
});
