import { AppObjectRepo } from "@vived/core";
import { makeSnackbarRepo } from "../Entities";
import { makeSnackbarPM } from "../PMs";

/**
 * Sets up the Snackbar feature by creating its entity and presentation manager
 * This is the main entry point for initializing the Snackbar system
 * 
 * @param appObjects The application object repository
 */
export function setupSnackbar(appObjects: AppObjectRepo): void {
  const ao = appObjects.getOrCreate("Snackbar");

  // Entities
  makeSnackbarRepo(ao);

  // PMs
  makeSnackbarPM(ao);
}
