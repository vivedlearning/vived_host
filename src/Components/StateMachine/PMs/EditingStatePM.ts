import {
  getSingletonComponent,
  AppObject,
  AppObjectPM,
  AppObjectRepo
} from "@vived/core";
import { HostEditingStateEntity } from "../Entities";

export interface EditingStateVM {
  isEditing: boolean;
  isNewState: boolean;
  hasChanges: boolean;
}

export const defaultIsEditingStateVM: EditingStateVM = {
  hasChanges: false,
  isEditing: false,
  isNewState: false
};

export abstract class EditingStatePM extends AppObjectPM<EditingStateVM> {
  static type = "EditingStatePM";

  static get(appObjects: AppObjectRepo): EditingStatePM | undefined {
    return getSingletonComponent(EditingStatePM.type, appObjects);
  }
}

export function makeEditingStatePM(appObject: AppObject) {
  return new EditingStatePMImp(appObject);
}

class EditingStatePMImp extends EditingStatePM {
  private get editingEntity() {
    return this.getCachedSingleton<HostEditingStateEntity>(
      HostEditingStateEntity.type
    );
  }

  vmsAreEqual(a: EditingStateVM, b: EditingStateVM): boolean {
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

  constructor(appObject: AppObject) {
    super(appObject, EditingStatePM.type);
    this.editingEntity?.addChangeObserver(this.onEntityChange);
    this.onEntityChange();
    this.appObjects.registerSingleton(this);
  }
}
