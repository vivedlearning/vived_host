import {
  getSingletonComponent,
  HostAppObject,
  HostAppObjectRepo,
  HostAppObjectUC
} from "../../../HostAppObject";
import { generateUniqueID } from "../../../Utilities";
import { Dialog, DialogQueue, SelectModelDialogEntity } from "../Entities";

export abstract class MakeSelectModelDialogUC extends HostAppObjectUC {
  static type = "MakeSelectModelDialogUC";

  abstract make(): void;
  abstract factory(): SelectModelDialogEntity;

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<MakeSelectModelDialogUC>(
      MakeSelectModelDialogUC.type,
      appObjects
    );
  }

  static make(appObjects: HostAppObjectRepo) {
    const uc = MakeSelectModelDialogUC.get(appObjects);
    uc?.make();
  }
}

export function makeMakeSelectModelDialogUC(
  appObject: HostAppObject
): MakeSelectModelDialogUC {
  return new MakeSelectModelDialogUCImp(appObject);
}

class MakeSelectModelDialogUCImp extends MakeSelectModelDialogUC {
  private get dialogRepo() {
    return this.getCachedSingleton<DialogQueue>(DialogQueue.type);
  }

  factory(): SelectModelDialogEntity {
    const ao = this.appObjects.getOrCreate(generateUniqueID());
    const entity = new SelectModelDialogEntity(ao);
    return entity;
  }

  make(): void {
    if (!this.dialogRepo) return;

    const dialog = this.factory() as Dialog;
    this.dialogRepo.submitDialog(dialog);
  }

  constructor(appObject: HostAppObject) {
    super(appObject, MakeSelectModelDialogUC.type);
    this.appObjects.registerSingleton(this);
  }
}
