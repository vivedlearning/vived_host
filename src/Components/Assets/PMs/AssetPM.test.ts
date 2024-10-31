import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeAssetEntity } from "../Entities/AssetEntity";
import { AssetPM, AssetVM, makeAppAssetListPM } from "./AssetPM";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("asset1");
  const asset = makeAssetEntity(ao);

  const pm = makeAppAssetListPM(ao);

  const doUpdateSpy = jest.spyOn(pm, "doUpdateView");

  return { pm, appObjects, ao, asset, doUpdateSpy };
}

describe("Asset PM", () => {
  it("Gets by ID", () => {
    const { pm, appObjects } = makeTestRig();

    expect(AssetPM.getByID("asset1", appObjects)).toEqual(pm);
  });

  it("Warns if the App Object cannot be found", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    AssetPM.getByID("someAppObject", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Warns if the App Object does not have a PM", () => {
    const { appObjects } = makeTestRig();

    appObjects.getOrCreate("someAppObject");
    appObjects.submitWarning = jest.fn();

    AssetPM.getByID("someAppObject", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Warns if added to an object that does not have an AssetEntity", () => {
    const { appObjects } = makeTestRig();

    const ao = appObjects.getOrCreate("someAppObject");
    appObjects.submitWarning = jest.fn();

    makeAppAssetListPM(ao);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Checks for equal VMs", () => {
    const { pm } = makeTestRig();

    const vm1: AssetVM = {
      archived: true,
      description: "an asset",
      id: "asset id",
      name: "asset name"
    };

    const vm2 = { ...vm1 };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(true);
  });

  it("Checks for a change in the archived flag", () => {
    const { pm } = makeTestRig();

    const vm1: AssetVM = {
      archived: true,
      description: "an asset",
      id: "asset id",
      name: "asset name"
    };

    const vm2 = { ...vm1, archived: false };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the description", () => {
    const { pm } = makeTestRig();

    const vm1: AssetVM = {
      archived: true,
      description: "an asset",
      id: "asset id",
      name: "asset name"
    };

    const vm2 = { ...vm1, description: "Something else" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the name", () => {
    const { pm } = makeTestRig();

    const vm1: AssetVM = {
      archived: true,
      description: "an asset",
      id: "asset id",
      name: "asset name"
    };

    const vm2 = { ...vm1, name: "Something else" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the id", () => {
    const { pm } = makeTestRig();

    const vm1: AssetVM = {
      archived: true,
      description: "an asset",
      id: "asset id",
      name: "asset name"
    };

    const vm2 = { ...vm1, id: "Something else" };

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

  it("Sets the ID in the VM", () => {
    const { pm, asset } = makeTestRig();
    expect(pm.lastVM?.id).toEqual(asset.id);
  });

  it("Sets the name in the VM", () => {
    const { pm, asset } = makeTestRig();
    asset.name = "Some Name";
    expect(pm.lastVM?.name).toEqual("Some Name");
  });

  it("Sets the description in the VM", () => {
    const { pm, asset } = makeTestRig();
    asset.description = "Some Description";
    expect(pm.lastVM?.description).toEqual("Some Description");
  });

  it("Sets the archived flag in the VM", () => {
    const { pm, asset } = makeTestRig();
    asset.archived = true;
    expect(pm.lastVM?.archived).toEqual(true);

    asset.archived = false;
    expect(pm.lastVM?.archived).toEqual(false);
  });
});
