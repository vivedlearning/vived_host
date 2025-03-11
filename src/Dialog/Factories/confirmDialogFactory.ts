import { AppObjectRepo, generateUniqueID } from "@vived/core";
import { ConfirmDialogEntity, DialogConfirmDTO } from "../Entities";
import { makeConfirmDialogPM } from "../PMs";

export function makeConfirmFactory(appObjects: AppObjectRepo) {
  return function confirmFactory(data: DialogConfirmDTO): ConfirmDialogEntity {
    const ao = appObjects.getOrCreate(generateUniqueID());

    const entity = new ConfirmDialogEntity(data, ao);
    makeConfirmDialogPM(ao);
    return entity;
  };
}
