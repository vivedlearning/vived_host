import { AppObjectRepo } from "@vived/core";
import { SnackbarAction, SnackbarRepo } from "../Entities/SnackbarRepo";

/**
 * Creates and displays a new snackbar notification
 *
 * @param appObjects The application object repository
 * @param message The message to display in the snackbar
 * @param snackbarAction Optional action button configuration with text and callback
 * @param durationInSeconds Optional duration in seconds before auto-dismissing (defaults to 4 seconds)
 */
export function makeSnackbar(
  appObjects: AppObjectRepo,
  message: string,
  snackbarAction?: SnackbarAction,
  durationInSeconds?: number
): void {
  const repo = SnackbarRepo.get(appObjects);
  if (repo) {
    repo.makeSnackbar(message, snackbarAction, durationInSeconds);
  } else {
    appObjects.submitError("makeSnackbar", "Unable to find SnackbarRepo");
  }
}
