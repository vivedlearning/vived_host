import { makeAppObjectRepo } from "@vived/core";
import { makeAppAssets } from "../Entities/AppAssetsEntity";
import {
  ShowArchivedAppAssetPM,
  makeShowArchivedAppAssetPM
} from "./ShowArchivedAppAssetPM";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const ao = appObjects.getOrCreate("asset1");
  const appAssets = makeAppAssets(ao);

  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const pm = makeShowArchivedAppAssetPM(ao);

  const doUpdateSpy = jest.spyOn(pm, "doUpdateView");

  return { pm, appObjects, ao, appAssets, doUpdateSpy, registerSingletonSpy };
}

describe("Show Archived App Asset PM", () => {
  it("Registers as the singleton", () => {
    const { registerSingletonSpy, pm } = makeTestRig();
    expect(registerSingletonSpy).toBeCalledWith(pm);
  });

  it("Gets the singleton", () => {
    const { appObjects, pm } = makeTestRig();

    expect(ShowArchivedAppAssetPM.get(appObjects)).toEqual(pm);
  });

  it("Checks for equal VMs", () => {
    const { pm } = makeTestRig();

    expect(pm.vmsAreEqual(true, true)).toEqual(true);
    expect(pm.vmsAreEqual(false, false)).toEqual(true);

    expect(pm.vmsAreEqual(false, true)).toEqual(false);
    expect(pm.vmsAreEqual(true, false)).toEqual(false);
  });

  it("Warns if added to an object that does not have an AppAssetEntity", () => {
    const { appObjects } = makeTestRig();

    const ao = appObjects.getOrCreate("someAppObject");
    appObjects.submitWarning = jest.fn();

    makeShowArchivedAppAssetPM(ao);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Instantiates the last VM", () => {
    const { pm } = makeTestRig();

    expect(pm.lastVM).not.toBeUndefined();
  });

  it("Updates the VM when the App Assets Entity changes", () => {
    const { doUpdateSpy, appAssets } = makeTestRig();

    doUpdateSpy.mockClear();

    appAssets.showArchived = true;

    expect(doUpdateSpy).toBeCalledWith(true);

    doUpdateSpy.mockClear();

    appAssets.showArchived = false;

    expect(doUpdateSpy).toBeCalledWith(false);
  });
});
