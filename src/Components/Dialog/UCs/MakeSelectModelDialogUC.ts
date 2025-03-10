import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";
import { generateUniqueID } from "@vived/core";
import { Dialog, DialogQueue, SelectModelDialogEntity } from "../Entities";

export abstract class MakeSelectModelDialogUC extends AppObjectUC {
  static type = "MakeSelectModelDialogUC";

  abstract make(): void;
  abstract factory(): SelectModelDialogEntity;

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<MakeSelectModelDialogUC>(
      MakeSelectModelDialogUC.type,
      appObjects
    );
  }

  static make(appObjects: AppObjectRepo) {
    const uc = MakeSelectModelDialogUC.get(appObjects);
    uc?.make();
  }
}

export function makeMakeSelectModelDialogUC(
  appObject: AppObject
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

  constructor(appObject: AppObject) {
    super(appObject, MakeSelectModelDialogUC.type);
    this.appObjects.registerSingleton(this);
  }
}
