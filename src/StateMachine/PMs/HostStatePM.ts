import { AppObject, AppObjectPM, AppObjectRepo } from "@vived/core";
import { HostStateEntity } from "../Entities/HostStateEntity";

export interface HostStateVM {
  readonly id: string;
  readonly name: string;
  readonly data: object;
}

export abstract class HostStatePM extends AppObjectPM<HostStateVM> {
  static readonly type = "HostStatePM";

  // Default view model
  static readonly defaultVM: HostStateVM = {
    id: "",
    name: "",
    data: {}
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

  // Required equality check method for view models
  vmsAreEqual(a: HostStateVM, b: HostStateVM): boolean {
    if (a.id !== b.id) return false;
    if (a.name !== b.name) return false;

    // Deep comparison for the data object
    const aData = JSON.stringify(a.data);
    const bData = JSON.stringify(b.data);
    if (aData !== bData) return false;

    return true;
  }

  // Handler for entity changes
  private onEntityChange = (): void => {
    const entity = this.hostStateEntity;

    if (!entity) {
      this.doUpdateView(HostStatePM.defaultVM);
      return;
    }

    // Create a new immutable view model based on entity state
    const newVM: HostStateVM = {
      id: entity.id,
      name: entity.name,
      data: entity.stateData
    };

    // Update the view with the new view model
    this.doUpdateView(newVM);
  };

  dispose = (): void => {
    this.hostStateEntity?.removeChangeObserver(this.onEntityChange);
    super.dispose();
  };

  constructor(appObject: AppObject) {
    super(appObject, HostStatePM.type);

    // Subscribe to entity changes
    this.hostStateEntity?.addChangeObserver(this.onEntityChange);

    // Initialize the view model
    this.onEntityChange();
  }
}
