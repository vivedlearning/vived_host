import { AppObject, AppObjectPM, AppObjectRepo } from "@vived/core";
import { AppRepoEntity } from "../../Apps/Entities/AppRepo";
import { HostStateEntity } from "../Entities/HostStateEntity";
import { HostStateMachine } from "../Entities/HostStateMachine";

export interface HostStateVM {
  readonly id: string;
  readonly name: string;
  readonly data: object;
  readonly isActive: boolean;
  readonly appName: string;
  readonly canBumpBackwards: boolean;
  readonly canBumpForward: boolean;
  readonly index: number;
}

export abstract class HostStatePM extends AppObjectPM<HostStateVM> {
  static readonly type = "HostStatePM";

  // Default view model
  static readonly defaultVM: HostStateVM = {
    id: "",
    name: "",
    data: {},
    isActive: false,
    appName: "",
    canBumpBackwards: false,
    canBumpForward: false,
    index: -1
  };

  // Non-singleton getter pattern
  static getById(
    id: string,
    appObjects: AppObjectRepo
  ): HostStatePM | undefined {
    return appObjects.get(id)?.getComponent<HostStatePM>(HostStatePM.type);
  }
}

export function makeHostStatePM(appObject: AppObject): HostStatePM {
  return new HostStatePMImp(appObject);
}

class HostStatePMImp extends HostStatePM {
  // Get the entity from the same AppObject
  private get hostStateEntity() {
    return this.getCachedLocalComponent<HostStateEntity>(HostStateEntity.type);
  }

  // Get the state machine which is a singleton
  private get hostStateMachine() {
    return this.getCachedSingleton<HostStateMachine>(HostStateMachine.type);
  }

  // Get the app repo which is a singleton
  private get appRepo() {
    return this.getCachedSingleton<AppRepoEntity>(AppRepoEntity.type);
  }

  // Required equality check method for view models
  vmsAreEqual(a: HostStateVM, b: HostStateVM): boolean {
    if (a.id !== b.id) return false;
    if (a.name !== b.name) return false;
    if (a.isActive !== b.isActive) return false;
    if (a.appName !== b.appName) return false;
    if (a.canBumpBackwards !== b.canBumpBackwards) return false;
    if (a.canBumpForward !== b.canBumpForward) return false;
    if (a.index !== b.index) return false;

    // Deep comparison for the data object
    const aData = JSON.stringify(a.data);
    const bData = JSON.stringify(b.data);
    if (aData !== bData) return false;

    return true;
  }

  // Handler for entity changes
  private onEntityChange = (): void => {
    this.updateViewModel();
  };

  // Handler for state machine changes
  private onStateMachineChange = (): void => {
    this.updateViewModel();
  };

  private updateViewModel(): void {
    const entity = this.hostStateEntity;
    const stateMachine = this.hostStateMachine;
    const appRepo = this.appRepo;

    if (!entity) {
      this.doUpdateView(HostStatePM.defaultVM);
      return;
    }

    // Check if this state is the active one in the state machine
    const isActive = stateMachine?.activeState === entity.id;

    // Look up the app name using the appID from the state entity
    let appName = "";
    if (appRepo && entity.appID) {
      const app = appRepo.getApp(entity.appID);
      if (app) {
        appName = app.name;
      }
    }

    // Determine if the state can be bumped backwards or forwards
    let canBumpBackwards = false;
    let canBumpForward = false;
    let index = -1;

    if (stateMachine) {
      const stateIndex = stateMachine.getStateIndex(entity.id);
      if (stateIndex !== undefined) {
        index = stateIndex;
        // Can bump backwards if index > 0
        canBumpBackwards = stateIndex > 0;
        // Can bump forward if index < length-1
        canBumpForward = stateIndex < stateMachine.stateCount - 1;
      }
    }

    // Create a new immutable view model based on entity state
    const newVM: HostStateVM = {
      id: entity.id,
      name: entity.name,
      data: entity.stateData,
      isActive: isActive || false,
      appName,
      canBumpBackwards,
      canBumpForward,
      index
    };

    // Update the view with the new view model
    this.doUpdateView(newVM);
  }

  dispose = (): void => {
    this.hostStateEntity?.removeChangeObserver(this.onEntityChange);
    this.hostStateMachine?.removeChangeObserver(this.onStateMachineChange);
    super.dispose();
  };

  constructor(appObject: AppObject) {
    super(appObject, HostStatePM.type);

    // Subscribe to entity changes
    this.hostStateEntity?.addChangeObserver(this.onEntityChange);

    // Subscribe to state machine changes
    this.hostStateMachine?.addChangeObserver(this.onStateMachineChange);

    // Initialize the view model
    this.updateViewModel();
  }
}
