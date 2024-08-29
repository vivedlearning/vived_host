import { makeHostAppObjectRepo } from "../../../HostAppObject";
import {
  AlertDialogEntity,
  ConfirmDialogEntity,
  makeDialogQueue,
  makeMockMakeAlertDialogUC,
  SpinnerDialogEntity
} from "../../Dialog";
import { makeMockDeleteAssetOnAPIUC } from "../../VivedAPI";
import { makeAppAssets } from "../Entities/AppAssetsEntity";
import { makeAssetEntity } from "../Entities/AssetEntity";
import { makeAssetRepo } from "../Entities/AssetRepo";
import { DeleteAssetUC, makeDeleteAssetUC } from "./DeleteAssetUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

  const appAssets = makeAppAssets(appObjects.getOrCreate("AppAsset"));
  const assetRepo = makeAssetRepo(appObjects.getOrCreate("AppAsset"));

  const assetAO = appObjects.getOrCreate("asset1");
  const asset = makeAssetEntity(assetAO);

  assetRepo.add(asset);

  appAssets.add("asset1");

  const mockDelete = makeMockDeleteAssetOnAPIUC(appObjects);

  const dialogQueue = makeDialogQueue(appObjects.getOrCreate("Dialog"));

  const spinner = new SpinnerDialogEntity(
    {
      message: "msg",
      title: "title"
    },
    appObjects.getOrCreate("Spinner")
  );
  dialogQueue.spinnerDialogFactory = jest.fn().mockReturnValue(spinner);

  const mockMakeAlert = makeMockMakeAlertDialogUC(appObjects);

  const confirm = new ConfirmDialogEntity(
    {
      message: "msg",
      title: "title",
      cancelButtonLabel: "btm",
      confirmButtonLabel: "bnt"
    },
    appObjects.getOrCreate("Confirm")
  );
  dialogQueue.confirmDialogFactory = jest.fn().mockReturnValue(confirm);

  const uc = makeDeleteAssetUC(assetAO);

  return {
    asset,
    appAssets,
    uc,
    mockDelete,
    appObjects,
    assetRepo,
    spinner,
    mockMakeAlert,
    dialogQueue,
    confirm
  };
}

describe("Delete Asset", () => {
  it("Calls the Delete from API UC as expected", async () => {
    const { uc, mockDelete } = makeTestRig();

    await uc.delete();

    expect(mockDelete.doDelete).toBeCalledWith("asset1");
  });

  it("Shows a spinner", () => {
    const { uc, dialogQueue, spinner } = makeTestRig();

    dialogQueue.submitDialog = jest.fn();

    uc.delete();

    expect(dialogQueue.submitDialog).toBeCalledWith(spinner);
  });

  it("Hides the spinner when completed", async () => {
    const { uc, spinner } = makeTestRig();
    spinner.close = jest.fn();

    await uc.delete();

    expect(spinner.close).toBeCalled();
  });

  it("Shows an alert if rejected", async () => {
    const { uc, dialogQueue, mockDelete, mockMakeAlert } = makeTestRig();
    uc.error = jest.fn();
    mockDelete.doDelete.mockRejectedValue(new Error("Some Post Error"));
    dialogQueue.submitDialog = jest.fn();

    await uc.delete();

    expect(mockMakeAlert.make).toBeCalled();
  });

  it("Hides the spinner when rejected", async () => {
    const { uc, mockDelete, spinner } = makeTestRig();
    uc.error = jest.fn();
    mockDelete.doDelete.mockRejectedValue(new Error("Some Post Error"));

    spinner.close = jest.fn();

    await uc.delete();

    expect(spinner.close).toBeCalled();
  });

  it("Warns if it cannot find the app object by ID when getting", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    DeleteAssetUC.get("unknownID", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Warns if the App Object does not have the UC when getting", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    appObjects.getOrCreate("anAppObject");
    DeleteAssetUC.get("anAppObject", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Returns the UC when getting", () => {
    const { appObjects, uc } = makeTestRig();

    const returnedUC = DeleteAssetUC.get("asset1", appObjects);

    expect(returnedUC).toEqual(uc);
  });

  it("Removed from app assets", async () => {
    const { appAssets, uc } = makeTestRig();

    expect(appAssets.has("asset1")).toEqual(true);

    await uc.delete();

    expect(appAssets.has("asset1")).toEqual(false);
  });

  it("Remove from asset repo", async () => {
    const { assetRepo, uc } = makeTestRig();

    expect(assetRepo.has("asset1")).toEqual(true);

    await uc.delete();

    expect(assetRepo.has("asset1")).toEqual(false);
  });

  it("Shows a confirmation", () => {
    const { uc, dialogQueue, confirm } = makeTestRig();

    dialogQueue.submitDialog = jest.fn();

    uc.deleteWithConfirm();

    expect(dialogQueue.submitDialog).toBeCalledWith(confirm);
  });
});
