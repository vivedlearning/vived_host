import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { GetAppUC } from "../UCs/GetAppUC";

export class MockGetAppUC extends GetAppUC {
  getApp = jest.fn()

  constructor(appObject: HostAppObject) {
    super(appObject, GetAppUC.type);
  }
}

export function makeMockFileUploadUC(appObjects: HostAppObjectRepo) {
  return new MockGetAppUC(appObjects.getOrCreate("MockGetAppUC"));
}
