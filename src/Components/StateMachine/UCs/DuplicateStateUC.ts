import {
  getSingletonComponent,
  HostAppObject,
  HostAppObjectRepo,
  HostAppObjectUC
} from "../../../HostAppObject";
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

  constructor(appObject: HostAppObject) {
    super(appObject, DuplicateStateUC.type);

    this.appObjects.registerSingleton(this);
  }
}
