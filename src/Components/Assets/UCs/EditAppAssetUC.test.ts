import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeAppSandboxEntity, SandboxState } from "../../AppSandbox";
import { makeAppAssets, makeAssetEntity, makeAssetRepo } from "../Entities";
import { makeEditAppAsset } from "./EditAppAssetUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

  const sandbox = makeAppSandboxEntity(appObjects.getOrCreate("Sandbox"));

  const appAssets = makeAppAssets(appObjects.getOrCreate("AppAsset"));
  const assetRepo = makeAssetRepo(appObjects.getOrCreate("AssetRepo"));

  const asset1 = makeAssetEntity(appObjects.getOrCreate("asset1"));
  assetRepo.add(asset1);

  const uc = makeEditAppAsset(appObjects.getOrCreate("AssetRepo"));

  return { uc, asset1, appAssets, appObjects, sandbox };
}

describe("Edit App Asset", () => {
  it("Sets the asset as the edited one", () => {
    const { appAssets, uc, asset1 } = makeTestRig();

    expect(appAssets.editingAsset).toBeUndefined();
    uc.editAsset("asset1");

    expect(appAssets.editingAsset).toEqual(asset1);
  });

  it("Sets the sandbox state", () => {
    const { sandbox, uc } = makeTestRig();

    sandbox.state = SandboxState.PLAYING;

    uc.editAsset("asset1");

    expect(sandbox.state).toEqual(SandboxState.EDIT_ASSET);
  });

  it("Does not set or changes the state if the asset is not an app asset", () => {
    const { appAssets, uc } = makeTestRig();
    uc.warn = jest.fn(); //Suppresses the console

    uc.editAsset("someOtherAsset");

    expect(appAssets.editingAsset).toBeUndefined();
  });

  it("Warns if the asset is not an app asset", () => {
    const { appObjects, uc } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    uc.editAsset("someOtherAsset");

    expect(appObjects.submitWarning).toBeCalled();
  });
});
