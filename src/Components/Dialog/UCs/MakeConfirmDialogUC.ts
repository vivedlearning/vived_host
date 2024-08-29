import {
  getSingletonComponent,
  HostAppObject,
  HostAppObjectRepo,
  HostAppObjectUC
} from "../../../HostAppObject";
import { generateUniqueID } from "../../../Utilities";
import {
  ConfirmDialogEntity,
  Dialog,
  DialogConfirmDTO,
  DialogQueue
} from "../Entities";

export abstract class MakeConfirmDialogUC extends HostAppObjectUC {
  static type = "MakeConfirmDialogUC";

  abstract make(dto: DialogConfirmDTO): void;
  abstract factory(data: DialogConfirmDTO): ConfirmDialogEntity;

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<MakeConfirmDialogUC>(
      MakeConfirmDialogUC.type,
      appObjects
    );
  }

  static make(dto: DialogConfirmDTO, appObjects: HostAppObjectRepo) {
    const uc = MakeConfirmDialogUC.get(appObjects);
    uc?.make(dto);
  }
}

export function makeMakeConfirmDialogUC(
  appObject: HostAppObject
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

  constructor(appObject: HostAppObject) {
    super(appObject, MakeConfirmDialogUC.type);
    this.appObjects.registerSingleton(this);
  }
}
