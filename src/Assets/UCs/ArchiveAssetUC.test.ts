import { makeAppObjectRepo } from "@vived/core";
import {
  makeDialogQueue,
  makeMockMakeAlertDialogUC,
  makeMockMakeSpinnerDialogUC,
  SpinnerDialogEntity
} from "../../Dialog";
import { makeMockPatchAssetIsArchivedUC } from "../../VivedAPI";
import { makeAppAssets } from "../Entities/AppAssetsEntity";
import { makeAssetEntity } from "../Entities/AssetEntity";
import { ArchiveAssetUC, makeArchiveAssetUC } from "./ArchiveAssetUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();

  const appAssets = makeAppAssets(appObjects.getOrCreate("AppAsset"));

  const assetAO = appObjects.getOrCreate("asset1");
  const asset = makeAssetEntity(assetAO);
  asset.archived = false;

  appAssets.add("asset1");

  const mockPatch = makeMockPatchAssetIsArchivedUC(appObjects);

  const mockSpinner = new SpinnerDialogEntity(
    { message: "", title: "" },
    appObjects.getOrCreate("Spinner")
  );
  const mockMakeSpinner = makeMockMakeSpinnerDialogUC(appObjects);
  mockMakeSpinner.make.mockReturnValue(mockSpinner);
  const mockMakeAlert = makeMockMakeAlertDialogUC(appObjects);

  const uc = makeArchiveAssetUC(assetAO);

  return {
    asset,
    appAssets,
    uc,
    mockPatch,
    appObjects,
    mockSpinner,
    mockMakeSpinner,
    mockMakeAlert
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
    const { uc, mockMakeSpinner } = makeTestRig();

    uc.setArchived(true);

    expect(mockMakeSpinner.make).toBeCalled();
  });

  it("Hides the spinner when completed", async () => {
    const { uc, mockSpinner } = makeTestRig();
    mockSpinner.close = jest.fn();

    await uc.setArchived(true);

    expect(mockSpinner.close).toBeCalled();
  });

  it("Shows an alert if rejected", async () => {
    const { uc, mockPatch, mockMakeAlert } = makeTestRig();
    uc.error = jest.fn();
    mockPatch.doPatch.mockRejectedValue(new Error("Some Post Error"));

    await uc.setArchived(true);

    expect(mockMakeAlert.make).toBeCalled();
  });

  it("Hides the spinner when rejected", async () => {
    const { uc, mockPatch, mockSpinner } = makeTestRig();
    uc.error = jest.fn();
    mockPatch.doPatch.mockRejectedValue(new Error("Some Post Error"));
    mockSpinner.close = jest.fn();

    await uc.setArchived(true);

    expect(mockSpinner.close).toBeCalled();
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
