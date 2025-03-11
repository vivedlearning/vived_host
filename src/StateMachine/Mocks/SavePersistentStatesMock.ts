import { AppObject, AppObjectRepo } from "@vived/core";
import { SavePersistentStatesUC } from "../UCs/SavePersistentStates";

export class SavePersistentStatesMock extends SavePersistentStatesUC {
  saveLocally = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, SavePersistentStatesUC.type);
  }
}

export function makeSavePersistentStatesMock(appObjects: AppObjectRepo) {
  return new SavePersistentStatesMock(
    appObjects.getOrCreate("SavePersistentStatesMock")
  );
}
