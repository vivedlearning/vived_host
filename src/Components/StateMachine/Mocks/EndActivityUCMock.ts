import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { EndActivityUC } from "../UCs/EndActivityUC";

export class EndActivityUCMock extends EndActivityUC {
  end = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, EndActivityUC.type);
  }
}

export function makeEndActivityUCMock(appObjects: HostAppObjectRepo) {
  return new EndActivityUCMock(appObjects.getOrCreate("EndActivityUCMock"));
}
