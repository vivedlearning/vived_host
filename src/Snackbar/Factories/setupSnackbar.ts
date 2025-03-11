import { AppObjectRepo } from "@vived/core";
import { makeSnackbarRepo } from "../Entities";
import { makeSnackbarPM } from "../PMs";

export function setupSnackbar(appObjects: AppObjectRepo) {
  const ao = appObjects.getOrCreate("Snackbar");

  // Entities
  makeSnackbarRepo(ao);

  // PMs
  makeSnackbarPM(ao);
}
