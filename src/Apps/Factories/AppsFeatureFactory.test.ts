import { makeAppObjectRepo, DomainFactoryRepo } from "@vived/core";
import { AppsFeatureFactory } from "./AppsFeatureFactory";
import { AppRepoEntity } from "../Entities/AppRepo";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();

  // Create DomainFactoryRepo
  const domainFactoryRepoAO = appObjects.getOrCreate("DomainFactoryRepo");
  new DomainFactoryRepo(domainFactoryRepoAO);

  return { appObjects };
}

describe("AppsFeatureFactory", () => {
  it("should create all required components when instantiated", () => {
    const { appObjects } = makeTestRig();

    // Create the factory
    const appsAO = appObjects.getOrCreate("Apps");
    new AppsFeatureFactory(appsAO);

    // Trigger setup for all domain factories
    const domainFactoryRepo = DomainFactoryRepo.get(appObjects);
    domainFactoryRepo?.setupDomain();

    // Verify that the singleton components are registered
    const appRepo = AppRepoEntity.get(appObjects);
    expect(appRepo).toBeDefined();
  });

  it("should set up the app factory correctly", () => {
    const { appObjects } = makeTestRig();

    const appsAO = appObjects.getOrCreate("Apps");
    new AppsFeatureFactory(appsAO);

    // Trigger setup for all domain factories
    const domainFactoryRepo = DomainFactoryRepo.get(appObjects);
    domainFactoryRepo?.setupDomain();

    const appRepo = AppRepoEntity.get(appObjects);
    expect(appRepo?.appFactory).toBeDefined();

    // Test that the app factory creates apps with proper components
    const testApp = appRepo?.appFactory("test-app");
    expect(testApp).toBeDefined();
    expect(testApp?.id).toBe("test-app");
  });
});
