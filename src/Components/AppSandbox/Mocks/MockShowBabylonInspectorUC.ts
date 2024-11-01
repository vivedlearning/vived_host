import { HostAppObject } from "../../../HostAppObject";
import { ShowBabylonInspectorUC } from "../UCs/ShowBabylonInspectorUC";

export class MockShowBabylonInspectorUC extends ShowBabylonInspectorUC {
  hide = jest.fn();
  toggleShow = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, ShowBabylonInspectorUC.type);
  }
}
