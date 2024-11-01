import { IsZSpaceAvailableAction } from "../../../Handler";

export function makeIsZSpaceAvailableAction(): IsZSpaceAvailableAction {
  return function (cb: (isZSpaceAvailable: boolean) => void): void {
    cb(true);
  };
}
