import { AppObject } from "@vived/core";
import { ShowBabylonInspectorUC } from "../UCs/ShowBabylonInspectorUC";

export class MockShowBabylonInspectorUC extends ShowBabylonInspectorUC {
  hide = jest.fn();
  toggleShow = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, ShowBabylonInspectorUC.type);
  }
}
