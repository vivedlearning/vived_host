import { AppObjectRepo } from "@vived/core";
import { SnackbarRepo } from "../Entities/SnackbarRepo";

/**
 * Executes the action of the currently active snackbar, if it has one
 * Also dismisses the snackbar after executing the action
 *
 * @param appObjects The application object repository
 */
export function callActiveSnackbarAction(appObjects: AppObjectRepo): void {
  const repo = SnackbarRepo.get(appObjects);
  if (repo) {
    repo.callActiveSnackbarAction();
  } else {
    appObjects.submitError(
      "callActiveSnackbarAction",
      "Unable to find SnackbarRepo"
    );
  }
}
