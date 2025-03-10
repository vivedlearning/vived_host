import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";
import { generateUniqueID } from "@vived/core";
import {
  ConfirmDialogEntity,
  Dialog,
  DialogConfirmDTO,
  DialogQueue
} from "../Entities";

export abstract class MakeConfirmDialogUC extends AppObjectUC {
  static type = "MakeConfirmDialogUC";

  abstract make(dto: DialogConfirmDTO): void;
  abstract factory(data: DialogConfirmDTO): ConfirmDialogEntity;

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<MakeConfirmDialogUC>(
      MakeConfirmDialogUC.type,
      appObjects
    );
  }

  static make(dto: DialogConfirmDTO, appObjects: AppObjectRepo) {
    const uc = MakeConfirmDialogUC.get(appObjects);
    uc?.make(dto);
  }
}

export function makeMakeConfirmDialogUC(
  appObject: AppObject
): MakeConfirmDialogUC {
  return new MakeConfirmDialogUCImp(appObject);
}

class MakeConfirmDialogUCImp extends MakeConfirmDialogUC {
  private get dialogRepo() {
    return this.getCachedSingleton<DialogQueue>(DialogQueue.type);
  }

  factory(data: DialogConfirmDTO): ConfirmDialogEntity {
    const ao = this.appObjects.getOrCreate(generateUniqueID());
    const entity = new ConfirmDialogEntity(data, ao);
    return entity;
  }

  make(dto: DialogConfirmDTO): void {
    if (!this.dialogRepo) return;

    const dialog = this.factory(dto) as Dialog;
    this.dialogRepo.submitDialog(dialog);
  }

  constructor(appObject: AppObject) {
    super(appObject, MakeConfirmDialogUC.type);
    this.appObjects.registerSingleton(this);
  }
}
