import {
  getSingletonComponent,
  HostAppObject,
  HostAppObjectRepo,
  HostAppObjectUC
} from "../../../HostAppObject";
import { generateUniqueID } from "../../../Utilities";
import {
  Dialog,
  DialogAlertDTO,
  DialogQueue,
  AlertDialogEntity
} from "../Entities";

export abstract class MakeAlertDialogUC extends HostAppObjectUC {
  static type = "MakeAlertDialogUC";

  abstract make(dto: DialogAlertDTO): void;
  abstract factory(data: DialogAlertDTO): AlertDialogEntity;

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<MakeAlertDialogUC>(
      MakeAlertDialogUC.type,
      appObjects
    );
  }

  static make(dto: DialogAlertDTO, appObjects: HostAppObjectRepo) {
    const uc = MakeAlertDialogUC.get(appObjects);
    uc?.make(dto);
  }
}

export function makeMakeAlertDialogUC(
  appObject: HostAppObject
): MakeAlertDialogUC {
  return new MakeActivityDetailsDialogUCImp(appObject);
}

class MakeActivityDetailsDialogUCImp extends MakeAlertDialogUC {
  private get dialogRepo() {
    return this.getCachedSingleton<DialogQueue>(DialogQueue.type);
  }

  factory(data: DialogAlertDTO): AlertDialogEntity {
    const ao = this.appObjects.getOrCreate(generateUniqueID());
    const entity = new AlertDialogEntity(data, ao);
    return entity;
  }

  make(dto: DialogAlertDTO): void {
    if (!this.dialogRepo) return;

    const dialog = this.factory(dto) as Dialog;
    this.dialogRepo.submitDialog(dialog);
  }

  constructor(appObject: HostAppObject) {
    super(appObject, MakeAlertDialogUC.type);
    this.appObjects.registerSingleton(this);
  }
}
