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

export interface PublishActivityEventPayload {
  channelID: string;
  activityID: string;
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

export interface MountPlayerEventPayload {
  channelID: string;
  activityID: string;
}

export interface UnmountPlayerEventPayload {
  channelID: string;
  activityID: string;
}

export interface AppRequestedEventPayload {
  channelID: string;
  activityID: string;
  appID: string;
}

export interface AppReadyEventPayload {
  channelID: string;
  activityID: string;
  appID: string;
}

export interface AssetRequestedEventPayload {
  channelID: string;
  activityID: string;
  assetID: string;
}

export interface AssetReceivedEventPayload {
  channelID: string;
  activityID: string;
  assetID: string;
}
