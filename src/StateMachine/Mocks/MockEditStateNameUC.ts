import { AppObject, AppObjectRepo } from "@vived/core";
import { EditStateNameUC } from "../UCs/EditStateNameUC";

export class MockEditStateNameUC extends EditStateNameUC {
  editStateName = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, EditStateNameUC.type);
  }
}
