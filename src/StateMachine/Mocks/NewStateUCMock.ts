import { AppObject, AppObjectRepo } from "@vived/core";
import { NewStateUC } from "../UCs/NewState/NewStateUC";

export class NewStateUCMock extends NewStateUC {
  createState = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, NewStateUC.type);
  }
}

export function makeNewStateUCMock(appObjects: AppObjectRepo) {
  return new NewStateUCMock(appObjects.getOrCreate("NewStateUCMock"));
}
