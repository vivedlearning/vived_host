import { HostAppObjectRepo } from "../../../HostAppObject";
import { generateUniqueID } from "../../../Utilities";
import { DialogMarkDownEditorDTO, MarkDownEditorDialogEntity } from "../Entities";
import { MarkDownEditorDialogPM } from "../PMs";

export function makeMarkdownEditorFactory(appObjects: HostAppObjectRepo) {
  return function (data: DialogMarkDownEditorDTO): MarkDownEditorDialogEntity {
    const ao = appObjects.getOrCreate(generateUniqueID());

    const entity = new MarkDownEditorDialogEntity(data, ao);
    new MarkDownEditorDialogPM(ao);
    return entity;
  };
}
