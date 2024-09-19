export interface StartActivityEventPayload {
  channelID: string;
  activityID: string;
  slides: {
    id: string;
    name: string;
    appID: string;
  }[];
  name: string;
}

export interface CompleteActivityEventPayload {
  channelID: string;
  activityID: string;
  completedAllSlides: boolean;
}

export interface StopSlideEventPayload {
  channelID: string;
  activityID: string;
  appID: string;
  slideID: string;
}

export interface StartSlideEventPayload {
  channelID: string;
  activityID: string;
  appID: string;
  slideID: string;
}

export enum EventType {
  MOUNT_PLAYER = "MOUNT_PLAYER",
  UNMOUNT_PLAYER = "UNMOUNT_PLAYER",
  APP_REQUESTED = "APP_REQUESTED",
  APP_READY = "APP_READY",
  ASSET_REQUESTED = "ASSET_REQUESTED",
  ASSET_RECEIVED = "ASSET_RECEIVED",
  SLIDE_START = "SLIDE_START",
  SLIDE_STOP = "SLIDE_STOP",
  START_ACTIVITY = "START_ACTIVITY",
  ACTIVITY_COMPLETED = "ACTIVITY_COMPLETED",
  ACTIVITY_PUBLISHED = "ACTIVITY_PUBLISHED"
}
