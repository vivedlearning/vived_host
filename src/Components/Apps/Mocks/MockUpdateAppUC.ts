import { HostAppObject } from "../../../HostAppObject";
import { UpdateAppUC } from "../UCs/UpdateAppUC";

export class MockUpdateAppUC extends UpdateAppUC {
  updateApp = jest.fn().mockResolvedValue(undefined);

  constructor(appObject: HostAppObject) {
    super(appObject, UpdateAppUC.type);
  }
}
