import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";
import { HostStateMachine } from "../Entities";

export abstract class DeleteStateUC extends AppObjectUC {
  static type = "DeleteStateUC";

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<DeleteStateUC>(DeleteStateUC.type, appObjects);
  }

  abstract deleteState(id: string): void;
}

export function makeDeleteStateUC(appObject: AppObject): DeleteStateUC {
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

  constructor(appObject: AppObject) {
    super(appObject, DeleteStateUC.type);
    this.appObjects.registerSingleton(this);
  }
}
