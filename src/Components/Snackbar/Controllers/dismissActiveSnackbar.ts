import { AppObjectRepo } from "@vived/core";
import { SnackbarRepo } from "../Entities/SnackbarRepo";

export function dismissActiveSnackbar(appObjects: AppObjectRepo) {
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
