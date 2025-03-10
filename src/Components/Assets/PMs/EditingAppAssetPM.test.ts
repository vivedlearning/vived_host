import { makeAppObjectRepo } from "@vived/core";
import { makeAppAssets } from "../Entities/AppAssetsEntity";
import { makeAssetEntity } from "../Entities/AssetEntity";
import {
  EditingAppAssetPM,
  EditingAppAssetVM,
  makeEditingAppAssetPM
} from "./EditingAppAssetPM";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const ao = appObjects.getOrCreate("asset1");
  const appAssets = makeAppAssets(ao);

  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const pm = makeEditingAppAssetPM(ao);

  const doUpdateSpy = jest.spyOn(pm, "doUpdateView");

  return { pm, appObjects, ao, appAssets, doUpdateSpy, registerSingletonSpy };
}

describe("Editing App Asset PM", () => {
  it("Registers as the singleton", () => {
    const { registerSingletonSpy, pm } = makeTestRig();
    expect(registerSingletonSpy).toBeCalledWith(pm);
  });

  it("Gets the singleton", () => {
    const { appObjects, pm } = makeTestRig();

    expect(EditingAppAssetPM.get(appObjects)).toEqual(pm);
  });

  it("Checks for equal VMs", () => {
    const { pm } = makeTestRig();

    const vm1: EditingAppAssetVM = {
      id: "asset1",
      archived: true,
      description: "description",
      filename: "filename",
      name: "name"
    };

    const vm2 = { ...vm1 };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(true);
    expect(pm.vmsAreEqual(undefined, undefined)).toEqual(true);

    expect(pm.vmsAreEqual(undefined, vm2)).toEqual(false);
    expect(pm.vmsAreEqual(vm2, undefined)).toEqual(false);
  });

  it("Checks for a change in the id", () => {
    const { pm } = makeTestRig();

    const vm1: EditingAppAssetVM = {
      id: "asset1",
      archived: true,
      description: "description",
      filename: "filename",
      name: "name"
    };

    const vm2 = { ...vm1, id: "changed" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the description", () => {
    const { pm } = makeTestRig();

    const vm1: EditingAppAssetVM = {
      id: "asset1",
      archived: true,
      description: "description",
      filename: "filename",
      name: "name"
    };

    const vm2 = { ...vm1, description: "changed" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the filename", () => {
    const { pm } = makeTestRig();

    const vm1: EditingAppAssetVM = {
      id: "asset1",
      archived: true,
      description: "description",
      filename: "filename",
      name: "name"
    };

    const vm2 = { ...vm1, filename: "changed" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the name", () => {
    const { pm } = makeTestRig();

    const vm1: EditingAppAssetVM = {
      id: "asset1",
      archived: true,
      description: "description",
      filename: "filename",
      name: "name"
    };

    const vm2 = { ...vm1, name: "changed" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the archived", () => {
    const { pm } = makeTestRig();

    const vm1: EditingAppAssetVM = {
      id: "asset1",
      archived: true,
      description: "description",
      filename: "filename",
      name: "name"
    };

    const vm2 = { ...vm1, archived: false };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Warns if added to an object that does not have an AppAssetEntity", () => {
    const { appObjects } = makeTestRig();

    const ao = appObjects.getOrCreate("someAppObject");
    appObjects.submitWarning = jest.fn();

    makeEditingAppAssetPM(ao);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Updates the VM when the App Assets Entity changes", () => {
    const { doUpdateSpy, appAssets, appObjects } = makeTestRig();

    doUpdateSpy.mockClear();

    appAssets.editingAsset = makeAssetEntity(appObjects.getOrCreate("asset1"));

    expect(doUpdateSpy).toBeCalled();

    doUpdateSpy.mockClear();

    appAssets.editingAsset = undefined;

    expect(doUpdateSpy).toBeCalledWith(undefined);
  });

  it("Uses the selected asset id", () => {
    const { appAssets, appObjects, pm } = makeTestRig();

    const asset = makeAssetEntity(appObjects.getOrCreate("asset1"));
    appAssets.editingAsset = asset;

    expect(pm.lastVM?.id).toEqual("asset1");
  });

  it("Uses the selected asset name", () => {
    const { appAssets, appObjects, pm } = makeTestRig();

    const asset = makeAssetEntity(appObjects.getOrCreate("asset1"));
    appAssets.editingAsset = asset;

    asset.name = "Some Name";

    expect(pm.lastVM?.name).toEqual("Some Name");
  });

  it("Uses the selected asset description", () => {
    const { appAssets, appObjects, pm } = makeTestRig();

    const asset = makeAssetEntity(appObjects.getOrCreate("asset1"));
    appAssets.editingAsset = asset;

    asset.description = "Some description";

    expect(pm.lastVM?.description).toEqual("Some description");
  });

  it("Uses the selected asset filename", () => {
    const { appAssets, appObjects, pm } = makeTestRig();

    const asset = makeAssetEntity(appObjects.getOrCreate("asset1"));
    appAssets.editingAsset = asset;

    asset.filename = "Some filename";

    expect(pm.lastVM?.filename).toEqual("Some filename");
  });

  it("Uses the selected asset archived flag", () => {
    const { appAssets, appObjects, pm } = makeTestRig();

    const asset = makeAssetEntity(appObjects.getOrCreate("asset1"));
    appAssets.editingAsset = asset;

    asset.archived = true;

    expect(pm.lastVM?.archived).toEqual(true);

    asset.archived = false;

    expect(pm.lastVM?.archived).toEqual(false);
  });
});
