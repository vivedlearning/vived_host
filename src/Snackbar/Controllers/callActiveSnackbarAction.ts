import { AppObjectRepo } from "@vived/core";
import { SnackbarRepo } from "../Entities/SnackbarRepo";

export function callActiveSnackbarAction(appObjects: AppObjectRepo) {
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
