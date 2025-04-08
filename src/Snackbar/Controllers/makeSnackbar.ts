import { AppObjectRepo } from "@vived/core";
import { SnackbarAction, SnackbarRepo } from "../Entities/SnackbarRepo";

export function makeSnackbar(
  appObjects: AppObjectRepo,
  message: string,
  snackbarAction?: SnackbarAction,
  durationInSeconds?: number
) {
  const repo = SnackbarRepo.get(appObjects);
  if (repo) {
    repo.makeSnackbar(message, snackbarAction, durationInSeconds);
  } else {
    appObjects.submitError("makeSnackbar", "Unable to find SnackbarRepo");
  }
}
