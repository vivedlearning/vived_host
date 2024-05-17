
import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { AlertDialogEntity, makeDialogQueue, SpinnerDialogEntity } from "../../Dialog";
import { makeMockPatchAssetIsArchivedUC } from "../../VivedAPI";
import { makeAppAssets } from "../Entities/AppAssetsEntity";
import { makeAssetEntity } from "../Entities/AssetEntity";
import { ArchiveAssetUC, makeArchiveAssetUC } from "./ArchiveAssetUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

  const appAssets = makeAppAssets(appObjects.getOrCreate("AppAsset"));

  const assetAO = appObjects.getOrCreate("asset1");
  const asset = makeAssetEntity(assetAO);
  asset.archived = false;

  appAssets.add("asset1");

  const mockPatch = makeMockPatchAssetIsArchivedUC(appObjects);

  const dialogQueue = makeDialogQueue(appObjects.getOrCreate("Dialog"));

  const spinner = new SpinnerDialogEntity(
    {
      message: "msg",
      title: "title"
    },
    appObjects.getOrCreate("Spinner")
  );
  dialogQueue.spinnerDialogFactory = jest.fn().mockReturnValue(spinner);

  const alert = new AlertDialogEntity(
    {
      message: "msg",
      title: "title",
      buttonLabel: "btm"
    },
    appObjects.getOrCreate("Alert")
  );
  dialogQueue.alertDialogFactory = jest.fn().mockReturnValue(alert);

  const uc = makeArchiveAssetUC(assetAO);

  return {
    asset,
    appAssets,
    uc,
    mockPatch,
    appObjects,
    spinner,
    alert,
    dialogQueue
  };
}

describe("Archive Asset", () => {
  it("Sets the asset to the archived state", async () => {
    const { uc, asset } = makeTestRig();

    expect(asset.archived).toEqual(false);

    await uc.setArchived(true);

    expect(asset.archived).toEqual(true);
  });

  it("Resolves without posting if the archived state matches the current state", async () => {
    const { uc, mockPatch } = makeTestRig();

    await uc.setArchived(false);

    expect(mockPatch.doPatch).not.toBeCalled();
  });

  it("Triggers the notify on the app assets", async () => {
    const { appAssets, uc } = makeTestRig();
    appAssets.notifyOnChange = jest.fn();
    await uc.setArchived(true);

    expect(appAssets.notifyOnChange).toBeCalled();
  });

  it("Calls the Patch UC as expected", async () => {
    const { uc, mockPatch } = makeTestRig();

    await uc.setArchived(true);

    expect(mockPatch.doPatch).toBeCalledWith("asset1", true);
  });

  it("Shows a spinner", () => {
    const { uc, dialogQueue, spinner } = makeTestRig();

    dialogQueue.submitDialog = jest.fn();

    uc.setArchived(true);

    expect(dialogQueue.submitDialog).toBeCalledWith(spinner);
  });

  it("Hides the spinner when completed", async () => {
    const { uc, spinner } = makeTestRig();
    spinner.close = jest.fn();

    await uc.setArchived(true);

    expect(spinner.close).toBeCalled();
  });

  it("Shows an alert if rejected", async () => {
    const { uc, dialogQueue, mockPatch, alert } = makeTestRig();
    uc.error = jest.fn();
    mockPatch.doPatch.mockRejectedValue(new Error("Some Post Error"));
    dialogQueue.submitDialog = jest.fn();

    await uc.setArchived(true);

    expect(dialogQueue.submitDialog).toBeCalledWith(alert);
  });

  it("Hides the spinner when rejected", async () => {
    const { uc, mockPatch, spinner } = makeTestRig();
    uc.error = jest.fn();
    mockPatch.doPatch.mockRejectedValue(new Error("Some Post Error"));
    spinner.close = jest.fn();

    await uc.setArchived(true);

    expect(spinner.close).toBeCalled();
  });

  it("Warns if it cannot find the app object by ID when getting", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    ArchiveAssetUC.get("unknownID", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Warns if the App Object does not have the UC when getting", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    appObjects.getOrCreate("anAppObject");
    ArchiveAssetUC.get("anAppObject", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Returns the UC when getting", () => {
    const { appObjects, uc } = makeTestRig();

    const returnedUC = ArchiveAssetUC.get("asset1", appObjects);

    expect(returnedUC).toEqual(uc);
  });
});
