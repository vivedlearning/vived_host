import {
  getSingletonComponent,
  HostAppObject,
  HostAppObjectPM,
  HostAppObjectRepo
} from "../../../HostAppObject";
import { HostEditingStateEntity } from "../Entities";

export interface IsEditingStateVM {
  isEditing: boolean;
  isNewState: boolean;
  hasChanges: boolean;
}

export const defaultIsEditingStateVM: IsEditingStateVM = {
  hasChanges: false,
  isEditing: false,
  isNewState: false
};

export abstract class IsEditingStatePM extends HostAppObjectPM<IsEditingStateVM> {
  static type = "IsEditingStatePM";

  static get(appObjects: HostAppObjectRepo): IsEditingStatePM | undefined {
    return getSingletonComponent(IsEditingStatePM.type, appObjects);
  }
}

export function makeIsEditingStatePM(appObject: HostAppObject) {
  return new IsEditingStatePMImp(appObject);
}

class IsEditingStatePMImp extends IsEditingStatePM {
  private get editingEntity() {
    return this.getCachedSingleton<HostEditingStateEntity>(
      HostEditingStateEntity.type
    );
  }

  vmsAreEqual(a: IsEditingStateVM, b: IsEditingStateVM): boolean {
    if (a.isEditing !== b.isEditing) return false;
    if (a.isNewState !== b.isNewState) return false;
    if (a.hasChanges !== b.hasChanges) return false;

    return true;
  }

  private onEntityChange = () => {
    if (!this.editingEntity) return;

    const isEditing = this.editingEntity.isEditing;
    const isNewState = this.editingEntity.isNewState;
    const hasChanges = this.editingEntity.somethingHasChanged;

    this.doUpdateView({
      isEditing,
      isNewState,
      hasChanges
    });
  };

  constructor(appObject: HostAppObject) {
    super(appObject, IsEditingStatePM.type);
    this.editingEntity?.addChangeObserver(this.onEntityChange);
    this.onEntityChange();
    this.appObjects.registerSingleton(this);
  }
}
