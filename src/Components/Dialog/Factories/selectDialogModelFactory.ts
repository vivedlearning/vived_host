import { HostAppObjectRepo } from "../../../HostAppObject";
import { generateUniqueID } from "../../../Utilities";
import { SelectModelDialogEntity } from "../Entities";

export function makeSelectModelFactory(appObjects: HostAppObjectRepo) {
  return function (): SelectModelDialogEntity {
    const ao = appObjects.getOrCreate(generateUniqueID());
    return new SelectModelDialogEntity(ao);
  };
}
