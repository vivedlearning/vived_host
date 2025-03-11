import { AppObject, AppObjectRepo } from "@vived/core";
import { ConsumeStateUC } from "../UCs/ConsumeState/ConsumeStateUC";

export class ConsumeStateUCMock extends ConsumeStateUC {
  consume = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, ConsumeStateUC.type);
  }
}

export function makeConsumeStateUCMock(appObjects: AppObjectRepo) {
  return new ConsumeStateUCMock(appObjects.getOrCreate("ConsumeStateUCMock"));
}
