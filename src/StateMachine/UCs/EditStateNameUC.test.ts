import { AppObject, AppObjectRepo, makeAppObjectRepo } from "@vived/core";
import {
  HostStateEntity,
  makeHostStateEntity
} from "../Entities/HostStateEntity";
import { EditStateNameUC, makeEditStateNameUC } from "./EditStateNameUC";

describe("EditStateNameUC", () => {
  let appObjects: AppObjectRepo;
  let appObject: AppObject;
  let uc: EditStateNameUC;
  let entity: HostStateEntity;
  const testId = "test-state-id";
  const initialName = "Initial State Name";
  const newName = "Updated State Name";

  beforeEach(() => {
    // Create a fresh repository and app object for each test
    appObjects = makeAppObjectRepo();
    appObject = appObjects.getOrCreate(testId);

    // Create the entity on the same app object
    entity = makeHostStateEntity(appObject);
    entity.name = initialName;

    // Create the use case
    uc = makeEditStateNameUC(appObject);
  });

  it("should edit the state name in the entity", () => {
    // Test the main functionality
    uc.editStateName(newName);

    // Verify the entity was updated
    expect(entity.name).toBe(newName);
  });

  it("should log a warning when entity is not found", () => {
    // Create a new app object without the required entity
    const newAppObject = appObjects.getOrCreate("another-id");

    // Spy on the warn method
    const warnSpy = jest.spyOn(appObjects, "submitWarning");

    // Create a use case without the dependency
    const isolatedUC = makeEditStateNameUC(newAppObject);

    // Execute the use case
    isolatedUC.editStateName(newName);

    // Verify warning was logged
    expect(warnSpy).toHaveBeenCalled();
  });

  it("should be retrievable via static get method", () => {
    // Test the component access pattern
    const retrievedUC = EditStateNameUC.get(appObject);
    expect(retrievedUC).toBe(uc);
  });

  it("should be retrievable via static getById method", () => {
    // Test ID-based retrieval
    const retrievedUC = EditStateNameUC.getById(testId, appObjects);
    expect(retrievedUC).toBe(uc);
  });

  it("should return undefined when getById is called with non-existent id", () => {
    // Test graceful handling of missing components
    const retrievedUC = EditStateNameUC.getById("non-existent-id", appObjects);
    expect(retrievedUC).toBeUndefined();
  });
});
