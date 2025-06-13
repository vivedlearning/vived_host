import { AppObjectRepo } from "@vived/core";
import { AssetsFactory } from "./AssetsFactory";

/**
 * Sets up the Assets system using the domain factory pattern
 *
 * @param appObjects The application's object repository
 */
export function setupAssets(appObjects: AppObjectRepo) {
  const assetsAO = appObjects.getOrCreate("Assets Domain");
  new AssetsFactory(assetsAO);
}
