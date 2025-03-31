import { AppObject, AppObjectRepo, makeAppObjectRepo } from "@vived/core";
import {
  HostStateEntity,
  makeHostStateEntity
} from "../Entities/HostStateEntity";
import { HostStatePM, HostStateVM, makeHostStatePM } from "./HostStatePM";

describe("HostStatePM", () => {
  let appObjects: AppObjectRepo;
  let appObject: AppObject;
  let entity: HostStateEntity;
  let pm: HostStatePM;
  const testId = "test-state-id";

  beforeEach(() => {
    // Set up the test environment
    appObjects = makeAppObjectRepo();
    appObject = appObjects.getOrCreate(testId);

    // Create and add the entity to the same AppObject
    entity = makeHostStateEntity(appObject);

    // Create the PM on the same AppObject
    pm = makeHostStatePM(appObject);
  });

  it("should initialize with a view model", () => {
    expect(pm.lastVM).not.toBeUndefined();
    expect(pm.lastVM?.id).toBe(testId);
  });

  it("should update view when entity changes", () => {
    const spy = jest.spyOn(pm, "doUpdateView");

    entity.notifyOnChange();

    expect(spy).toHaveBeenCalled();
  });

  it("should reflect entity properties in view model", () => {
    const testName = "test state";
    const testData = { key: "value" };

    entity.name = testName;
    entity.setStateData(testData);

    expect(pm.lastVM?.id).toBe(testId);
    expect(pm.lastVM?.name).toBe(testName);
    expect(pm.lastVM?.data).toEqual(testData);
  });

  it("should return true when comparing identical view models in vmsAreEqual", () => {
    const vm1: HostStateVM = { id: "same", name: "same", data: { test: 123 } };
    const vm2: HostStateVM = { id: "same", name: "same", data: { test: 123 } };

    expect(pm.vmsAreEqual(vm1, vm2)).toBe(true);
  });

  it("should return false when comparing different view models in vmsAreEqual", () => {
    const vm1: HostStateVM = { id: "same", name: "same", data: { test: 123 } };
    const vm2: HostStateVM = {
      id: "different",
      name: "same",
      data: { test: 123 }
    };
    const vm3: HostStateVM = {
      id: "same",
      name: "different",
      data: { test: 123 }
    };
    const vm4: HostStateVM = { id: "same", name: "same", data: { test: 456 } };

    expect(pm.vmsAreEqual(vm1, vm2)).toBe(false);
    expect(pm.vmsAreEqual(vm1, vm3)).toBe(false);
    expect(pm.vmsAreEqual(vm1, vm4)).toBe(false);
  });

  it("should be available via static getById", () => {
    const retrievedPM = HostStatePM.getById(testId, appObjects);
    expect(retrievedPM).toBe(pm);
  });

  it("should clean up observers on dispose", () => {
    // Spy on removeChangeObserver
    const spy = jest.spyOn(entity, "removeChangeObserver");

    // Dispose the PM
    pm.dispose();

    // Should have called removeChangeObserver
    expect(spy).toHaveBeenCalledWith(expect.any(Function));

    // PM should no longer be attached to the AppObject
    expect(appObject.getComponent(HostStatePM.type)).toBeUndefined();
  });
});
