import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { NewStateUC } from "../UCs/NewState/NewStateUC";

export class NewStateUCMock extends NewStateUC {
  createState = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, NewStateUC.type);
  }
}

export function makeNewStateUCMock(appObjects: HostAppObjectRepo) {
  return new NewStateUCMock(appObjects.getOrCreate("NewStateUCMock"));
}
