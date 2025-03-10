import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";
import { HostStateMachine } from "../Entities";

export abstract class DuplicateStateUC extends AppObjectUC {
  static type = "DuplicateStateUC";

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<DuplicateStateUC>(
      DuplicateStateUC.type,
      appObjects
    );
  }

  abstract duplicateState(id: string): void;
}

export function makeDuplicateStateUC(appObject: AppObject): DuplicateStateUC {
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

    const state = this.stateMachine.getStateByID(id);
    if (!state) {
      this.warn("Unable to find state to duplicate");
      return;
    }

    const newState = this.stateMachine.createNewState();
    const dto = state.getDTO();
    dto.id = newState.id;
    dto.name = dto.name + " Copy";
    newState.setDTO(dto);
  };

  constructor(appObject: AppObject) {
    super(appObject, DuplicateStateUC.type);

    this.appObjects.registerSingleton(this);
  }
}
