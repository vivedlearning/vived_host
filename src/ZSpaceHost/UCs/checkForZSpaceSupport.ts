import { AppObjectRepo } from "@vived/core";
import { ZSpaceHostEntity } from "../Entities/ZSpaceHost";

/**
 * Checks if the current browser environment supports WebXR and zSpace hardware
 *
 * This utility function:
 * 1. Checks if navigator.xr is available (WebXR API support)
 * 2. Tests if 'immersive-vr' sessions are supported (required for zSpace)
 * 3. Updates the ZSpaceHostEntity.isSupported property based on results
 *
 * Usage:
 * ```typescript
 * // Typically called during application initialization:
 * import { checkForWebXRSupport } from "@vived/host/ZSpaceHost/UCs";
 *
 * async function initializeApp(appObjects) {
 *   // Check for zSpace hardware support
 *   await checkForWebXRSupport(appObjects);
 *
 *   // Get the current support status
 *   const zSpace = ZSpaceHostEntity.get(appObjects);
 *   if (zSpace?.isSupported) {
 *     console.log("zSpace hardware is supported");
 *   } else {
 *     console.log("zSpace hardware is not supported, using fallback mode");
 *   }
 * }
 * ```
 *
 * Important notes:
 * - This function should be called during application initialization
 * - It returns a Promise that resolves when the check is complete
 * - To observe changes in support status, use the ZSpaceIsActivePM
 * - If hardware is not supported, you may want to enable emulation mode
 *
 * @param appObjects - The AppObjectRepo instance
 * @returns A Promise that resolves when the check is complete
 */
export function checkForWebXRSupport(appObjects: AppObjectRepo): Promise<void> {
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
