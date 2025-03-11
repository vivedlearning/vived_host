import { AppObjectRepo, generateUniqueID } from "@vived/core";
import {
  DialogMarkDownEditorDTO,
  MarkDownEditorDialogEntity
} from "../Entities";
import { makeMarkDownEditorDialogPM } from "../PMs";

export function makeMarkdownEditorFactory(appObjects: AppObjectRepo) {
  return function markdownEditorFactory(
    data: DialogMarkDownEditorDTO
  ): MarkDownEditorDialogEntity {
    const ao = appObjects.getOrCreate(generateUniqueID());

    const entity = new MarkDownEditorDialogEntity(data, ao);
    makeMarkDownEditorDialogPM(ao);
    return entity;
  };
}
