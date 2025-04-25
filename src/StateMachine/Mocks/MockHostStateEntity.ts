import { AppObject, AppObjectRepo } from "@vived/core";
import {
  ChallengeResponse,
  HostStateEntity,
  StreamState
} from "../Entities/HostStateEntity";

export class MockHostStateEntity extends HostStateEntity {
  streamState: StreamState = StreamState.INIT;
  get id() {
    return this.appObject.id;
  }
  name = "State Name";
  assets = [];
  expectedResponse = ChallengeResponse.NONE;
  appID = "AppID";
  getDTO = jest.fn();
  setDTO = jest.fn();

  get stateData(): object {
    return { foo: "bar" };
  }

  setStateData = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, HostStateEntity.type);
  }
}

export function makeMockHostStateEntity(id: string, appObjects: AppObjectRepo) {
  return new MockHostStateEntity(appObjects.getOrCreate(id));
}
