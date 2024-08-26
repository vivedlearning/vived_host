import { HostAppObject } from "../../../HostAppObject";
import { MounterUC } from "../UCs/MounterUC";

export class MockAppMounterUC extends MounterUC {
  unmount = jest.fn();
  loadScriptIntoDocument = jest.fn();
  getAppInterface = jest.fn();
  mount = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, MounterUC.type);
  }
}
