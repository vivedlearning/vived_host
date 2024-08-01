import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { ChallengeResponse, HostStateEntity } from "../Entities";

export class MockHostStateEntity extends HostStateEntity {
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

  constructor(appObject: HostAppObject) {
    super(appObject, HostStateEntity.type);
  }
}

export function makeMockHostStateEntity(
  id: string,
  appObjects: HostAppObjectRepo
) {
  return new MockHostStateEntity(appObjects.getOrCreate(id));
}
