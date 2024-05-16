import { HostAppObjectRepo } from "../../../HostAppObject";
import { generateUniqueID } from "../../../Utilities";
import { AlertDialogEntity, DialogAlertDTO } from "../Entities";
import { AlertDialogPM } from "../PMs";

export function makeAlertFactory(appObjects: HostAppObjectRepo) {
  return function (data: DialogAlertDTO): AlertDialogEntity {
    const ao = appObjects.getOrCreate(generateUniqueID());

    const entity = new AlertDialogEntity(data, ao);
    new AlertDialogPM(ao);
    return entity;
  };
}
