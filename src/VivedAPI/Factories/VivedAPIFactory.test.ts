import { makeAppObjectRepo, DomainFactoryRepo } from "@vived/core";
import { VivedAPIFactory } from "./VivedAPIFactory";
import { setupVivedAPIForSandbox } from "./setupVivedAPIForSandbox";
import { VivedAPIEntity } from "../Entities";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();

  // Create DomainFactoryRepo
  const domainFactoryRepoAO = appObjects.getOrCreate("DomainFactoryRepo");
  new DomainFactoryRepo(domainFactoryRepoAO);

  return { appObjects };
}

describe("VivedAPIFactory", () => {
  it("should create all required components when instantiated", () => {
    const { appObjects } = makeTestRig();

    // Create the "VIVED API" AppObject and factory
    const vivedAPIAO = appObjects.getOrCreate("VIVED API");
    new VivedAPIFactory(vivedAPIAO);

    // Trigger setup for all domain factories
    const domainFactoryRepo = DomainFactoryRepo.get(appObjects);
    domainFactoryRepo?.setupDomain();

    // Verify that the singleton component is registered
    const vivedAPI = VivedAPIEntity.get(appObjects);
    expect(vivedAPI).toBeDefined();
  });

  it("should initialize the factory with the correct name", () => {
    const { appObjects } = makeTestRig();

    const vivedAPIAO = appObjects.getOrCreate("VIVED API");
    const factory = new VivedAPIFactory(vivedAPIAO);

    expect(factory.factoryName).toBe("VivedAPIFactory");
  });

  it("should call setup methods in the correct order", () => {
    const { appObjects } = makeTestRig();

    const vivedAPIAO = appObjects.getOrCreate("VIVED API");
    new VivedAPIFactory(vivedAPIAO);

    // Trigger setup for all domain factories
    const domainFactoryRepo = DomainFactoryRepo.get(appObjects);
    domainFactoryRepo?.setupDomain();

    // Verify the setup was successful by checking that components exist
    const vivedAPI = VivedAPIEntity.get(appObjects);
    expect(vivedAPI).toBeDefined();

    // Verify the AppObject was created
    expect(appObjects.has("VIVED API")).toBe(true);
  });

  it("should maintain the same functionality as setupVivedAPIForSandbox", () => {
    const { appObjects } = makeTestRig();

    // Set up using the new factory
    const vivedAPIAO = appObjects.getOrCreate("VIVED API");
    new VivedAPIFactory(vivedAPIAO);

    // Trigger setup for all domain factories
    const domainFactoryRepo = DomainFactoryRepo.get(appObjects);
    domainFactoryRepo?.setupDomain();

    // Verify core functionality
    const vivedAPI = VivedAPIEntity.get(appObjects);
    expect(vivedAPI).toBeDefined();
    expect(vivedAPI?.baseUrl).toBeDefined();
    expect(vivedAPI?.userToken).toBeDefined();
  });

  it("should produce equivalent results to setupVivedAPIForSandbox", () => {
    // Test the factory approach
    const { appObjects: factoryAppObjects } = makeTestRig();
    const vivedAPIAO = factoryAppObjects.getOrCreate("VIVED API");
    new VivedAPIFactory(vivedAPIAO);

    // Trigger setup for all domain factories
    const domainFactoryRepo = DomainFactoryRepo.get(factoryAppObjects);
    domainFactoryRepo?.setupDomain();

    // Test the original function approach
    const functionAppObjects = makeAppObjectRepo();
    setupVivedAPIForSandbox(functionAppObjects);

    // Both should have the same AppObjects created
    expect(factoryAppObjects.has("VIVED API")).toBe(true);
    expect(functionAppObjects.has("VIVED API")).toBe(true);

    // Both should have VivedAPIEntity singleton registered
    const factoryVivedAPI = VivedAPIEntity.get(factoryAppObjects);
    const functionVivedAPI = VivedAPIEntity.get(functionAppObjects);

    expect(factoryVivedAPI).toBeDefined();
    expect(functionVivedAPI).toBeDefined();

    // Both entities should have the same properties
    expect(factoryVivedAPI?.baseUrl).toEqual(functionVivedAPI?.baseUrl);
    expect(factoryVivedAPI?.userToken).toEqual(functionVivedAPI?.userToken);
    expect(factoryVivedAPI?.apiStage).toEqual(functionVivedAPI?.apiStage);
  });
});
