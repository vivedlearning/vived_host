import { AppObject, AppObjectRepo } from "@vived/core";
import { EndActivityUC } from "../UCs/EndActivity/EndActivityUC";

export class EndActivityUCMock extends EndActivityUC {
  end = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, EndActivityUC.type);
  }
}

export function makeEndActivityUCMock(appObjects: AppObjectRepo) {
  return new EndActivityUCMock(appObjects.getOrCreate("EndActivityUCMock"));
}
