import { AppObject } from "@vived/core";
import { UpdateAppUC } from "../UCs/UpdateAppUC";

export class MockUpdateAppUC extends UpdateAppUC {
  updateApp = jest.fn().mockResolvedValue(undefined);

  constructor(appObject: AppObject) {
    super(appObject, UpdateAppUC.type);
  }
}
