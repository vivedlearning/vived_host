import {
  getSingletonComponent,
  HostAppObject,
  HostAppObjectRepo,
  HostAppObjectUC
} from "../../../HostAppObject";
import { HostStateMachine } from "../Entities";

export abstract class SavePersistentStatesUC extends HostAppObjectUC {
  static type = "SavePersistentStatesUC";

  abstract saveLocally(): void;

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<SavePersistentStatesUC>(
      SavePersistentStatesUC.type,
      appObjects
    );
  }
}

export function makeSavePersistentStatesUC(
  appObject: HostAppObject
): SavePersistentStatesUC {
  return new SavePersistentStatesUCImp(appObject);
}

class SavePersistentStatesUCImp extends SavePersistentStatesUC {
  private get stateMachine() {
    return this.getCachedSingleton<HostStateMachine>(
      HostStateMachine.type
    );
  }

  saveLocally = (): void => {
    if (!this.stateMachine) return;

    const states = this.stateMachine.states;
    const statesData = JSON.stringify(states);
    const a = document.createElement("a");
    const file = new Blob([statesData], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = "persistentStates.json";
    a.click();
  };

  constructor(appObject: HostAppObject) {
    super(appObject, SavePersistentStatesUC.type);
    this.appObjects.registerSingleton(this);
  }
}
