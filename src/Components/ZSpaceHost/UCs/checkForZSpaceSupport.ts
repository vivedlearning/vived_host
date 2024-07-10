import { HostAppObjectRepo } from "../../../HostAppObject";
import { ZSpaceHostEntity } from "../Entities/ZSpaceHost";

export function checkForWebXRSupport(
  appObjects: HostAppObjectRepo
): Promise<void> {
  return new Promise<void>((resolve) => {
    const zSpace = ZSpaceHostEntity.get(appObjects);
    if (!zSpace) {
      appObjects.submitError(
        "checkForWebXRSupport",
        "Unable to find ZSpaceHostEntity"
      );
      return;
    }

    const xr: any = (navigator as any).xr;

    if (!xr) {
      zSpace.isSupported = false;
      resolve();
    } else {
      xr.isSessionSupported("immersive-vr")
        .then((isSupported: boolean) => {
          zSpace.isSupported = isSupported;
          resolve();
        })
        .catch(() => {
          zSpace.isSupported = false;
          resolve();
        });
    }
  });
}
