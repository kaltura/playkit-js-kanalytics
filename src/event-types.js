//@flow
const EVENT_TYPES: { [event: string]: number } = {
  MEDIA_LOADED: 2,
  PLAY: 3,
  PLAY_REACHED_25: 4,
  PLAY_REACHED_50: 5,
  PLAY_REACHED_75: 6,
  PLAY_REACHED_100: 7,
  OPEN_EDIT: 8,
  OPEN_VIRAL: 9,
  OPEN_DOWNLOAD: 10,
  OPEN_REPORT: 11,
  OPEN_FULL_SCREEN: 14,
  CLOSE_FULL_SCREEN: 15,
  REPLAY: 16,
  SEEK: 17,
  OPEN_UPLOAD: 18,
  SAVE_PUBLISH: 19,
  CLOSE_EDITOR: 20,
  PRE_BUMPER_PLAYED: 21,
  POST_BUMPER_PLAYED: 22,
  BUMPER_CLICKED: 23,
  PREROLL_STARTED: 24,
  MIDROLL_STARTED: 25,
  POSTROLL_STARTED: 26,
  OVERLAY_STARTED: 27,
  PREROLL_CLICKED: 28,
  MIDROLL_CLICKED: 29,
  POSTROLL_CLICKED: 30,
  OVERLAY_CLICKED: 31,
  PREROLL_25: 32,
  PREROLL_50: 33,
  PREROLL_75: 34,
  MIDROLL_25: 35,
  MIDROLL_50: 36,
  MIDROLL_75: 37,
  POSTROLL_25: 38,
  POSTROLL_50: 39,
  POSTROLL_75: 40
};

export default EVENT_TYPES;
