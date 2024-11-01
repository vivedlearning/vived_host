import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { EditActiveStateUC } from "../UCs/EditActiveState/EditActiveStateUC";

export class MockEditActiveStateUC extends EditActiveStateUC {
  editActiveState = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, EditActiveStateUC.type);
  }
}

export function makeMockEditActiveStateUC(appObjects: HostAppObjectRepo) {
  return new MockEditActiveStateUC(
    appObjects.getOrCreate("MockEditActiveStateUC")
  );
}
