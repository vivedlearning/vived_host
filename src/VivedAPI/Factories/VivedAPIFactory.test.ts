import { makeAppObjectRepo } from "@vived/core";
import { VivedAPIFactory } from "./VivedAPIFactory";
import { setupVivedAPIForSandbox } from "./setupVivedAPIForSandbox";
import { VivedAPIEntity } from "../Entities";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  return { appObjects };
}

describe("VivedAPIFactory", () => {
  it("should create all required components when instantiated", () => {
    const { appObjects } = makeTestRig();

    // Create the factory
    new VivedAPIFactory(appObjects);

    // Verify that the required AppObject was created
    expect(appObjects.has("VIVED API")).toBe(true);

    // Verify that the singleton component is registered
    const vivedAPI = VivedAPIEntity.get(appObjects);
    expect(vivedAPI).toBeDefined();
  });

  it("should initialize the factory with the correct name", () => {
    const { appObjects } = makeTestRig();

    const factory = new VivedAPIFactory(appObjects);

    expect(factory.factoryName).toBe("VivedAPIFactory");
  });

  it("should call setup methods in the correct order", () => {
    const { appObjects } = makeTestRig();

    const factory = new VivedAPIFactory(appObjects);

    // Verify the setup was successful by checking that components exist
    const vivedAPI = VivedAPIEntity.get(appObjects);
    expect(vivedAPI).toBeDefined();

    // Verify the AppObject was created
    expect(appObjects.has("VIVED API")).toBe(true);
  });

  it("should maintain the same functionality as setupVivedAPIForSandbox", () => {
    const { appObjects } = makeTestRig();

    // Set up using the new factory
    new VivedAPIFactory(appObjects);

    // Verify core functionality
    const vivedAPI = VivedAPIEntity.get(appObjects);
    expect(vivedAPI).toBeDefined();
    expect(vivedAPI?.baseUrl).toBeDefined();
    expect(vivedAPI?.userToken).toBeDefined();
  });

  it("should produce equivalent results to setupVivedAPIForSandbox", () => {
    // Test the factory approach
    const factoryAppObjects = makeAppObjectRepo();
    new VivedAPIFactory(factoryAppObjects);

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
