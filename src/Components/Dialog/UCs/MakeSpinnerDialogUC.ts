import {
  getSingletonComponent,
  HostAppObject,
  HostAppObjectRepo,
  HostAppObjectUC
} from "../../../HostAppObject";
import { generateUniqueID } from "../../../Utilities";
import {
  Dialog,
  DialogQueue,
  DialogSpinnerDTO,
  SpinnerDialogEntity
} from "../Entities";

export abstract class MakeSpinnerDialogUC extends HostAppObjectUC {
  static type = "MakeSpinnerDialogUC";

  abstract make(dto: DialogSpinnerDTO): SpinnerDialogEntity | undefined;
  abstract factory(data: DialogSpinnerDTO): SpinnerDialogEntity;

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<MakeSpinnerDialogUC>(
      MakeSpinnerDialogUC.type,
      appObjects
    );
  }

  static make(
    dto: DialogSpinnerDTO,
    appObjects: HostAppObjectRepo
  ): SpinnerDialogEntity | undefined {
    const uc = MakeSpinnerDialogUC.get(appObjects);
    return uc?.make(dto);
  }
}

export function makeMakeSpinnerDialogUC(
  appObject: HostAppObject
): MakeSpinnerDialogUC {
  return new MakeSpinnerDialogUCImp(appObject);
}

class MakeSpinnerDialogUCImp extends MakeSpinnerDialogUC {
  private get dialogRepo() {
    return this.getCachedSingleton<DialogQueue>(DialogQueue.type);
  }

  factory(data: DialogSpinnerDTO): SpinnerDialogEntity {
    const ao = this.appObjects.getOrCreate(generateUniqueID());
    const entity = new SpinnerDialogEntity(data, ao);
    return entity;
  }

  make(dto: DialogSpinnerDTO): SpinnerDialogEntity | undefined {
    if (!this.dialogRepo) return;

    const dialog = this.factory(dto);
    this.dialogRepo.submitDialog(dialog as Dialog);

    return dialog;
  }

  constructor(appObject: HostAppObject) {
    super(appObject, MakeSpinnerDialogUC.type);
    this.appObjects.registerSingleton(this);
  }
}
