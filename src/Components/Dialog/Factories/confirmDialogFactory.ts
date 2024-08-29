import { HostAppObjectRepo } from "../../../HostAppObject";
import { generateUniqueID } from "../../../Utilities";
import { ConfirmDialogEntity, DialogConfirmDTO } from "../Entities";
import { makeConfirmDialogPM } from "../PMs";

export function makeConfirmFactory(appObjects: HostAppObjectRepo) {
  return function confirmFactory(data: DialogConfirmDTO): ConfirmDialogEntity {
    const ao = appObjects.getOrCreate(generateUniqueID());

    const entity = new ConfirmDialogEntity(data, ao);
    makeConfirmDialogPM(ao);
    return entity;
  };
}
