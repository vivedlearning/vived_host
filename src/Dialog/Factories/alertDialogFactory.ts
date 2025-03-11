import { AppObjectRepo, generateUniqueID } from "@vived/core";
import { AlertDialogEntity, DialogAlertDTO } from "../Entities";
import { makeAlertDialogPM } from "../PMs";

export function makeAlertFactory(appObjects: AppObjectRepo) {
  return function alertFactory(data: DialogAlertDTO): AlertDialogEntity {
    const ao = appObjects.getOrCreate(generateUniqueID());

    const entity = new AlertDialogEntity(data, ao);
    makeAlertDialogPM(ao);
    return entity;
  };
}
