import {
  getSingletonComponent,
  HostAppObject,
  HostAppObjectRepo,
  HostAppObjectUC
} from "../../../HostAppObject";
import { generateUniqueID } from "../../../Utilities";
import {
  Dialog,
  DialogMarkDownEditorDTO,
  DialogQueue,
  MarkDownEditorDialogEntity
} from "../Entities";

export abstract class MakeMarkdownDialogUC extends HostAppObjectUC {
  static type = "MakeMarkdownDialogUC";

  abstract make(dto: DialogMarkDownEditorDTO): void;
  abstract factory(data: DialogMarkDownEditorDTO): MarkDownEditorDialogEntity;

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<MakeMarkdownDialogUC>(
      MakeMarkdownDialogUC.type,
      appObjects
    );
  }

  static make(dto: DialogMarkDownEditorDTO, appObjects: HostAppObjectRepo) {
    const uc = MakeMarkdownDialogUC.get(appObjects);
    uc?.make(dto);
  }
}

export function makeMakeMarkdownDialogUC(
  appObject: HostAppObject
): MakeMarkdownDialogUC {
  return new MakeMarkdownDialogUCImp(appObject);
}

class MakeMarkdownDialogUCImp extends MakeMarkdownDialogUC {
  private get dialogRepo() {
    return this.getCachedSingleton<DialogQueue>(DialogQueue.type);
  }

  factory(data: DialogMarkDownEditorDTO): MarkDownEditorDialogEntity {
    const ao = this.appObjects.getOrCreate(generateUniqueID());
    const entity = new MarkDownEditorDialogEntity(data, ao);
    return entity;
  }

  make(dto: DialogMarkDownEditorDTO): void {
    if (!this.dialogRepo) return;

    const dialog = this.factory(dto) as Dialog;
    this.dialogRepo.submitDialog(dialog);
  }

  constructor(appObject: HostAppObject) {
    super(appObject, MakeMarkdownDialogUC.type);
    this.appObjects.registerSingleton(this);
  }
}
