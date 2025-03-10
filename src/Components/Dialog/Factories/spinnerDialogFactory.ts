import { AppObjectRepo, generateUniqueID } from "@vived/core";
import { DialogSpinnerDTO, SpinnerDialogEntity } from "../Entities";
import { makeSpinnerDialogPM } from "../PMs";

export function makeSpinnerFactory(appObjects: AppObjectRepo) {
  return function spinnerFactory(data: DialogSpinnerDTO): SpinnerDialogEntity {
    const ao = appObjects.getOrCreate(generateUniqueID());

    const entity = new SpinnerDialogEntity(data, ao);
    makeSpinnerDialogPM(ao);
    return entity;
  };
}
