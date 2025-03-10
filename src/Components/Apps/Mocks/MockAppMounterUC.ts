import { AppObject } from "@vived/core";
import { MounterUC } from "../UCs/Mounters";

export class MockAppMounterUC extends MounterUC {
  mountLatestVersion = jest.fn();
  unmount = jest.fn();
  loadScriptIntoDocument = jest.fn();
  getAppInterface = jest.fn();
  mount = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, MounterUC.type);
  }
}
