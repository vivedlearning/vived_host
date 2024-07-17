import { getSingletonComponent, HostAppObject, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";
import { HostStateMachine } from "../Entities";

export abstract class DuplicateStateUC extends HostAppObjectUC {
  static type = "DuplicateStateUC";

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<DuplicateStateUC>(
      DuplicateStateUC.type,
      appObjects
    );
  }

  abstract duplicateState(id: string): void;
}

export function makeDuplicateStateUC(
  appObject: HostAppObject
): DuplicateStateUC {
  return new DuplicateStateUCImp(appObject);
}

class DuplicateStateUCImp extends DuplicateStateUC {
  private get stateMachine() {
    return this.getCachedLocalComponent<HostStateMachine>(
      HostStateMachine.type
    );
  }

  duplicateState = (id: string): void => {
    if (!this.stateMachine) return;

    const state = this.stateMachine.retrieveState(id);
    if (!state) {
      this.warn("Unable to find state to duplicate");
      return;
    }

    this.stateMachine.createState(
      state.name + " Copy",
      state.data,
      state.assets
    );
  };

  constructor(appObject: HostAppObject) {
    super(appObject, DuplicateStateUC.type);

    this.appObjects.registerSingleton(this);
  }
}
