import { AppObjectRepo, DomainFactoryRepo } from "@vived/core";
import { AssetsFactory } from "./AssetsFactory";

/**
 * Sets up the Assets system using the domain factory pattern
 *
 * @param appObjects The application's object repository
 */
export function setupAssets(appObjects: AppObjectRepo) {
  const assetsAO = appObjects.getOrCreate("Assets");

  // Create DomainFactoryRepo if it doesn't exist
  let domainFactoryRepo = DomainFactoryRepo.get(appObjects);
  if (!domainFactoryRepo) {
    const domainFactoryRepoAO = appObjects.getOrCreate("DomainFactoryRepo");
    domainFactoryRepo = new DomainFactoryRepo(domainFactoryRepoAO);
  }

  // Create the factory with the Assets AppObject
  new AssetsFactory(assetsAO);

  // Trigger setup for all registered domain factories
  domainFactoryRepo.setupDomain();
}
