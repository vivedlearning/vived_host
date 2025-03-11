import { makeAppObjectRepo } from "@vived/core";
import {
  makeMockMakeAlertDialogUC,
  makeMockMakeConfirmDialogUC,
  makeMockMakeSpinnerDialogUC,
  SpinnerDialogEntity
} from "../../Dialog";
import { makeMockDeleteAssetOnAPIUC } from "../../VivedAPI";
import { makeAppAssets } from "../Entities/AppAssetsEntity";
import { makeAssetEntity } from "../Entities/AssetEntity";
import { makeAssetRepo } from "../Entities/AssetRepo";
import { DeleteAssetUC, makeDeleteAssetUC } from "./DeleteAssetUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();

  const appAssets = makeAppAssets(appObjects.getOrCreate("AppAsset"));
  const assetRepo = makeAssetRepo(appObjects.getOrCreate("AppAsset"));

  const assetAO = appObjects.getOrCreate("asset1");
  const asset = makeAssetEntity(assetAO);

  assetRepo.add(asset);

  appAssets.add("asset1");

  const mockDelete = makeMockDeleteAssetOnAPIUC(appObjects);

  const mockMakeAlert = makeMockMakeAlertDialogUC(appObjects);
  const mockConfirm = makeMockMakeConfirmDialogUC(appObjects);

  const mockSpinner = new SpinnerDialogEntity(
    { message: "", title: "" },
    appObjects.getOrCreate("Spinner")
  );
  const mockMakeSpinner = makeMockMakeSpinnerDialogUC(appObjects);
  mockMakeSpinner.make.mockReturnValue(mockSpinner);

  const uc = makeDeleteAssetUC(assetAO);

  return {
    asset,
    appAssets,
    uc,
    mockDelete,
    appObjects,
    assetRepo,
    mockMakeAlert,
    mockConfirm,
    mockMakeSpinner,
    mockSpinner
  };
}

describe("Delete Asset", () => {
  it("Calls the Delete from API UC as expected", async () => {
    const { uc, mockDelete } = makeTestRig();

    await uc.delete();

    expect(mockDelete.doDelete).toBeCalledWith("asset1");
  });

  it("Shows a spinner", () => {
    const { uc, mockMakeSpinner } = makeTestRig();

    uc.delete();

    expect(mockMakeSpinner.make).toBeCalled();
  });

  it("Hides the spinner when completed", async () => {
    const { uc, mockSpinner } = makeTestRig();
    mockSpinner.close = jest.fn();

    await uc.delete();

    expect(mockSpinner.close).toBeCalled();
  });

  it("Shows an alert if rejected", async () => {
    const { uc, mockDelete, mockMakeAlert } = makeTestRig();
    uc.error = jest.fn();
    mockDelete.doDelete.mockRejectedValue(new Error("Some Post Error"));

    await uc.delete();

    expect(mockMakeAlert.make).toBeCalled();
  });

  it("Hides the spinner when rejected", async () => {
    const { uc, mockDelete, mockSpinner } = makeTestRig();
    uc.error = jest.fn();
    mockDelete.doDelete.mockRejectedValue(new Error("Some Post Error"));

    mockSpinner.close = jest.fn();

    await uc.delete();

    expect(mockSpinner.close).toBeCalled();
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
    const { uc, mockConfirm } = makeTestRig();

    uc.deleteWithConfirm();

    expect(mockConfirm.make).toBeCalled();
  });
});
