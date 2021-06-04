import { DialogUC } from "./Boundary";
import { DialogUCImp } from "./UseCaseImp";

export * from "./Boundary";

export function makeDialogUC(): DialogUC {
  return new DialogUCImp();
}