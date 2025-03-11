import { AppObject } from "@vived/core";
import { DispatchIsAuthoringUC } from "../UCs";

export class MockDispatchIsAuthoringUC extends DispatchIsAuthoringUC {
  doDispatch = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, DispatchIsAuthoringUC.type);
  }
}
