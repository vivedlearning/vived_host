import { AppObjectRepo } from "@vived/core";
import { UpdateAppUC } from "../UCs/UpdateAppUC";

/**
 * Controller function to update an app to its latest version.
 *
 * This controller is used to trigger the app update process. It finds the
 * appropriate UpdateAppUC by the app's ID and calls its updateApp method.
 *
 * Usage in views:
 * ```typescript
 * import { updateApp } from "../Controllers/updateApp";
 *
 * // In a React component
 * const handleUpdateClick = () => {
 *   updateApp(appId, appObjects);
 * };
 * ```
 *
 * @param id - The ID of the app to update
 * @param appObjects - The app object repository
 */
export function updateApp(id: string, appObjects: AppObjectRepo) {
  const uc = UpdateAppUC.getByID(id, appObjects);
  if (!uc) {
    appObjects.submitError("updateApp", "Unable to find UpdateAppUC");
    return;
  }

  uc.updateApp();
}
