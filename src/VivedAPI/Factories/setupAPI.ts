import { AppObjectRepo, DomainFactoryRepo } from "@vived/core";
import { VivedAPIFactory } from "./VivedAPIFactory";

/**
 * Sets up the VIVED API system using the domain factory pattern
 *
 * @param appObjects The application's object repository
 */
export function setupAPI(appObjects: AppObjectRepo) {
  const vivedAPIAO = appObjects.getOrCreate("VIVED API");

  // Create DomainFactoryRepo if it doesn't exist
  let domainFactoryRepo = DomainFactoryRepo.get(appObjects);
  if (!domainFactoryRepo) {
    const domainFactoryRepoAO = appObjects.getOrCreate("DomainFactoryRepo");
    domainFactoryRepo = new DomainFactoryRepo(domainFactoryRepoAO);
  }

  // Create the factory with the VIVED API AppObject
  new VivedAPIFactory(vivedAPIAO);

  // Trigger setup for all registered domain factories
  domainFactoryRepo.setupDomain();
}
