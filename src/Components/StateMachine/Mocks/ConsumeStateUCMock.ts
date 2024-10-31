import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { ConsumeStateUC } from "../UCs/ConsumeStateUC";

export class ConsumeStateUCMock extends ConsumeStateUC {
  consume = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, ConsumeStateUC.type);
  }
}

export function makeConsumeStateUCMock(appObjects: HostAppObjectRepo) {
  return new ConsumeStateUCMock(appObjects.getOrCreate("ConsumeStateUCMock"));
}
