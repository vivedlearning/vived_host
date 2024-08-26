import { HostAppObject } from "../../../HostAppObject";
import { AppPM } from "../PMs/AppPM";

export class MockAppPM extends AppPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, AppPM.type);
  }
}
