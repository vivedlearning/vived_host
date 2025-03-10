import { AppObjectRepo, generateUniqueID } from "@vived/core";
import { SelectModelDialogEntity } from "../Entities";

export function makeSelectModelFactory(appObjects: AppObjectRepo) {
  return function selectModelFactory(): SelectModelDialogEntity {
    const ao = appObjects.getOrCreate(generateUniqueID());
    return new SelectModelDialogEntity(ao);
  };
}
