import { AppObjectRepo } from "@vived/core";
import { VivedAPIFactory } from "./VivedAPIFactory";

/**
 * Sets up the VIVED API system using the domain factory pattern
 *
 * @param appObjects The application's object repository
 */
export function setupAPI(appObjects: AppObjectRepo) {
  const vivedAPIAO = appObjects.getOrCreate("VIVED API");
  new VivedAPIFactory(appObjects);
}
