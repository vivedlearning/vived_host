import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { SavePersistentStatesUC } from "../UCs/SavePersistentStates";

export class SavePersistentStatesMock extends SavePersistentStatesUC {
  saveLocally = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, SavePersistentStatesUC.type);
  }
}

export function makeSavePersistentStatesMock(appObjects: HostAppObjectRepo) {
  return new SavePersistentStatesMock(
    appObjects.getOrCreate("SavePersistentStatesMock")
  );
}
