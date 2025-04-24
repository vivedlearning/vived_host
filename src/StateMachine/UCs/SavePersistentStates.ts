import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";
import { HostStateMachine } from "../Entities";
import { SandboxStateData } from "./setSandboxStatesFromData";

export abstract class SavePersistentStatesUC extends AppObjectUC {
  static type = "SavePersistentStatesUC";

  abstract saveLocally(): void;

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<SavePersistentStatesUC>(
      SavePersistentStatesUC.type,
      appObjects
    );
  }
}

export function makeSavePersistentStatesUC(
  appObject: AppObject
): SavePersistentStatesUC {
  return new SavePersistentStatesUCImp(appObject);
}

class SavePersistentStatesUCImp extends SavePersistentStatesUC {
  private get stateMachine() {
    return this.getCachedSingleton<HostStateMachine>(HostStateMachine.type);
  }

  saveLocally = (): void => {
    if (!this.stateMachine) return;

    const states: SandboxStateData[] = [];
    this.stateMachine.states.forEach((stateID) => {
      const state = this.stateMachine?.getStateByID(stateID);
      if (state) {
        const rVal: SandboxStateData = {
          assets: state.assets,
          data: state.stateData,
          id: state.id,
          name: state.name
        };

        states.push(rVal);
      }
    });

    const statesData = JSON.stringify(states);
    const a = document.createElement("a");
    const file = new Blob([statesData], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = "persistentStates.json";
    a.click();
  };

  constructor(appObject: AppObject) {
    super(appObject, SavePersistentStatesUC.type);
    this.appObjects.registerSingleton(this);
  }
}
