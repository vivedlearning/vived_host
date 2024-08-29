import { HostAppObjectRepo } from "../../../HostAppObject";
import { generateUniqueID } from "../../../Utilities";
import { DialogMarkDownEditorDTO, MarkDownEditorDialogEntity } from "../Entities";
import { makeMarkDownEditorDialogPM } from "../PMs";

export function makeMarkdownEditorFactory(appObjects: HostAppObjectRepo) {
  return function markdownEditorFactory(data: DialogMarkDownEditorDTO): MarkDownEditorDialogEntity {
    const ao = appObjects.getOrCreate(generateUniqueID());

    const entity = new MarkDownEditorDialogEntity(data, ao);
    makeMarkDownEditorDialogPM(ao);
    return entity;
  };
}
