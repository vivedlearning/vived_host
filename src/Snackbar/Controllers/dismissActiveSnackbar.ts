import { AppObjectRepo } from "@vived/core";
import { SnackbarRepo } from "../Entities/SnackbarRepo";

/**
 * Dismisses the currently active snackbar, if any exists
 *
 * @param appObjects The application object repository
 */
export function dismissActiveSnackbar(appObjects: AppObjectRepo): void {
  const repo = SnackbarRepo.get(appObjects);
  if (repo) {
    repo.dismissActiveSnackbar();
  } else {
    appObjects.submitError(
      "dismissActiveSnackbar",
      "Unable to find SnackbarRepo"
    );
  }
}
