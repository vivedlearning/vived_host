// filepath: c:\Users\amosp\Documents\WebGL\vivedlearning_host\src\Assets\PMs\AssetFilePM.test.ts
import { makeAppObjectRepo } from "@vived/core";
import { makeAssetEntity } from "../Entities/AssetEntity";
import { AssetFilePM, AssetFileVM, makeAssetFilePM } from "./AssetFilePM";

// Mock URL.createObjectURL since it's not available in the test environment
if (typeof URL.createObjectURL === "undefined") {
  Object.defineProperty(URL, "createObjectURL", {
    value: jest
      .fn()
      .mockImplementation((file) => `mock-blob-url-for-${file.name}`)
  });
}

/**
 * Creates the test environment for the AssetFilePM tests
 * @returns Testing objects including PM, entity, and spy functions
 */
function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const ao = appObjects.getOrCreate("asset1");
  const asset = makeAssetEntity(ao);

  const pm = makeAssetFilePM(ao);

  const doUpdateSpy = jest.spyOn(pm, "doUpdateView");

  return { pm, appObjects, ao, asset, doUpdateSpy };
}

describe("AssetFile PM", () => {
  it("Gets by ID", () => {
    const { pm, appObjects } = makeTestRig();

    expect(AssetFilePM.getByID("asset1", appObjects)).toEqual(pm);
  });

  it("Warns if the App Object cannot be found", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    AssetFilePM.getByID("someAppObject", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Warns if the App Object does not have a PM", () => {
    const { appObjects } = makeTestRig();

    appObjects.getOrCreate("someAppObject");
    appObjects.submitWarning = jest.fn();

    AssetFilePM.getByID("someAppObject", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Warns if added to an object that does not have an AssetEntity", () => {
    const { appObjects } = makeTestRig();

    const ao = appObjects.getOrCreate("someAppObject");
    appObjects.submitWarning = jest.fn();

    makeAssetFilePM(ao);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Checks for equal VMs", () => {
    const { pm } = makeTestRig();

    const vm1: AssetFileVM = {
      blobURL: "blob:url",
      isFetchingFile: false,
      fileHasBeenFetched: true,
      fetchError: undefined
    };

    const vm2 = { ...vm1 };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(true);
  });

  it("Checks for a change in the blobURL", () => {
    const { pm } = makeTestRig();

    const vm1: AssetFileVM = {
      blobURL: "blob:url1",
      isFetchingFile: false,
      fileHasBeenFetched: true,
      fetchError: undefined
    };

    const vm2 = { ...vm1, blobURL: "blob:url2" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in isFetchingFile", () => {
    const { pm } = makeTestRig();

    const vm1: AssetFileVM = {
      blobURL: "blob:url",
      isFetchingFile: false,
      fileHasBeenFetched: true,
      fetchError: undefined
    };

    const vm2 = { ...vm1, isFetchingFile: true };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in fileHasBeenFetched", () => {
    const { pm } = makeTestRig();

    const vm1: AssetFileVM = {
      blobURL: "blob:url",
      isFetchingFile: false,
      fileHasBeenFetched: true,
      fetchError: undefined
    };

    const vm2 = { ...vm1, fileHasBeenFetched: false };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in fetchError", () => {
    const { pm } = makeTestRig();

    const vm1: AssetFileVM = {
      blobURL: "blob:url",
      isFetchingFile: false,
      fileHasBeenFetched: true,
      fetchError: undefined
    };

    const vm2 = { ...vm1, fetchError: new Error("Test error") };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Updates when the asset changes", () => {
    const { doUpdateSpy, asset } = makeTestRig();

    doUpdateSpy.mockClear();
    asset.notifyOnChange();

    expect(doUpdateSpy).toBeCalled();
  });

  it("Instantiates VM", () => {
    const { pm } = makeTestRig();

    expect(pm.lastVM).not.toBeUndefined();
  });

  it("Sets the blobURL in the VM", () => {
    const { pm, asset } = makeTestRig();

    // Setup a file to test blobURL
    const file = new File(["test"], "test.txt", { type: "text/plain" });
    asset.setFile(file);

    expect(pm.lastVM?.blobURL).toEqual(asset.blobURL);
  });

  it("Sets isFetchingFile in the VM", () => {
    const { pm, asset } = makeTestRig();

    asset.isFetchingFile = true;
    expect(pm.lastVM?.isFetchingFile).toEqual(true);

    asset.isFetchingFile = false;
    expect(pm.lastVM?.isFetchingFile).toEqual(false);
  });

  it("Sets fileHasBeenFetched in the VM", () => {
    const { pm, asset } = makeTestRig();

    // Initially false without a file
    expect(pm.lastVM?.fileHasBeenFetched).toEqual(false);

    // Set a file to make fileHasBeenFetched true
    const file = new File(["test"], "test.txt", { type: "text/plain" });
    asset.setFile(file);

    expect(pm.lastVM?.fileHasBeenFetched).toEqual(true);
  });

  it("Sets fetchError in the VM", () => {
    const { pm, asset } = makeTestRig();

    // Initially undefined
    expect(pm.lastVM?.fetchError).toBeUndefined();

    // Set an error
    const testError = new Error("Test error");
    asset.fetchError = testError;

    expect(pm.lastVM?.fetchError).toEqual(testError);
  });

  it("Disposes observers", () => {
    const { pm, asset } = makeTestRig();

    const removeObserverSpy = jest.spyOn(asset, "removeChangeObserver");

    pm.dispose();

    expect(removeObserverSpy).toBeCalled();
  });
});
