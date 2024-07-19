import {
  getSingletonComponent,
  HostAppObject,
  HostAppObjectRepo,
  HostAppObjectUC
} from "../../../HostAppObject";
import { HostStateMachine } from "../Entities";

export abstract class DeleteStateUC extends HostAppObjectUC {
  static type = "DeleteStateUC";

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<DeleteStateUC>(DeleteStateUC.type, appObjects);
  }

  abstract deleteState(id: string): void;
}

export function makeDeleteStateUC(appObject: HostAppObject): DeleteStateUC {
  return new DeleteStateUCImp(appObject);
}

class DeleteStateUCImp extends DeleteStateUC {
  private get stateMachine() {
    return this.getCachedLocalComponent<HostStateMachine>(
      HostStateMachine.type
    );
  }

  deleteState = (id: string): void => {
    if (!this.stateMachine) return;

    const state = this.stateMachine.getStateByID(id);
    if (this.stateMachine.hasState(id)) {
      this.stateMachine.deleteState(id);
    } else {
      this.warn("Unable to find state to delete");
      return;
    }
  };

  constructor(appObject: HostAppObject) {
    super(appObject, DeleteStateUC.type);
    this.appObjects.registerSingleton(this);
  }
}
