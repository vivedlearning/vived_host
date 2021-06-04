import { SnackbarUC } from "./Boundary";
import { SnackbarUCImp } from "./UseCaseImp";

export * from "./Boundary";
export function makeSnackbarUC(): SnackbarUC {
  return new SnackbarUCImp();
}