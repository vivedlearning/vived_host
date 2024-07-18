import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { ChallengeResponse, HostStateEntity } from "../Entities";

export class MockStateEntity extends HostStateEntity {
  getDTO = jest.fn();
  setDTO = jest.fn();
  get id(): string {
    return this.appObject.id;
  }
  name = "";
  assets = [];
  expectedResponse: ChallengeResponse | undefined;
  appID = "";
  get stateData() {
    return {};
  }
  setStateData = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, HostStateEntity.type);
  }
}

export function makeMockStateEntity(id: string, appObject: HostAppObjectRepo) {
  return new MockStateEntity(appObject.getOrCreate(id));
}
