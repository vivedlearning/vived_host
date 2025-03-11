import { makeAppObjectRepo } from "@vived/core";
import { makeAppSandboxEntity, SandboxState } from "../../AppSandbox/Entities";
import { SpinnerDialogEntity } from "../../Dialog/Entities/Spinner";
import {
  makeMockMakeAlertDialogUC,
  makeMockMakeSpinnerDialogUC
} from "../../Dialog/Mocks";
import { PatchAssetMetaDTO } from "../../VivedAPI/UCs/PatchAssetMetaUC";
import { makeMockPatchAssetMetaUC } from "../../VivedAPI/Mocks/MockPatchAssetMetaUC";
import { makeAppAssets, makeAssetEntity } from "../Entities";
import {
  makeUpdateAppAssetMetaUC,
  UpdateAppAssetMetaDTO,
  UpdateAppAssetMetaUC
} from "./UpdateAppAssetMetaUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();

  const appAssets = makeAppAssets(appObjects.getOrCreate("AppAsset"));
  const sandbox = makeAppSandboxEntity(appObjects.getOrCreate("Sandbox"));

  const assetAO = appObjects.getOrCreate("asset1");
  const asset = makeAssetEntity(assetAO);
  asset.archived = false;

  appAssets.add("asset1");

  const mockPatch = makeMockPatchAssetMetaUC(appObjects);

  const spinner = new SpinnerDialogEntity(
    {
      message: "msg",
      title: "title"
    },
    appObjects.getOrCreate("Spinner")
  );
  const mockMakeSpinner = makeMockMakeSpinnerDialogUC(appObjects);
  mockMakeSpinner.make.mockReturnValue(spinner);

  const mockMakeAlert = makeMockMakeAlertDialogUC(appObjects);

  const uc = makeUpdateAppAssetMetaUC(assetAO);

  return {
    asset,
    appAssets,
    uc,
    mockPatch,
    appObjects,
    spinner,
    mockMakeAlert,
    mockMakeSpinner,
    sandbox
  };
}

function makeDTO(): UpdateAppAssetMetaDTO {
  return {
    name: "Name",
    archived: true,
    description: "Desc"
  };
}

describe("Archive Asset", () => {
  it("Sets the asset to the dto", async () => {
    const { uc, asset } = makeTestRig();

    asset.name = "";
    asset.archived = false;
    asset.description = "";

    expect(asset.archived).toEqual(false);

    await uc.updateMeta(makeDTO());

    expect(asset.archived).toEqual(true);
    expect(asset.name).toEqual("Name");
    expect(asset.description).toEqual("Desc");
  });

  it("Calls the Patch UC as expected", async () => {
    const { uc, mockPatch } = makeTestRig();

    const data = makeDTO();
    await uc.updateMeta(makeDTO());

    const patchDTO: PatchAssetMetaDTO = {
      archived: data.archived,
      description: data.description,
      id: "asset1",
      name: data.name
    };

    expect(mockPatch.doPatch).toBeCalledWith(patchDTO);
  });

  it("Shows a spinner", () => {
    const { uc, mockMakeSpinner } = makeTestRig();

    uc.updateMeta(makeDTO());

    expect(mockMakeSpinner.make).toBeCalled();
  });

  it("Hides the spinner when completed", async () => {
    const { uc, spinner } = makeTestRig();
    spinner.close = jest.fn();

    await uc.updateMeta(makeDTO());

    expect(spinner.close).toBeCalled();
  });

  it("Shows an alert if rejected", async () => {
    const { uc, mockPatch, mockMakeAlert } = makeTestRig();
    uc.error = jest.fn();
    mockPatch.doPatch.mockRejectedValue(new Error("Some Post Error"));

    await uc.updateMeta(makeDTO());

    expect(mockMakeAlert.make).toBeCalled();
  });

  it("Hides the spinner when rejected", async () => {
    const { uc, mockPatch, spinner } = makeTestRig();
    uc.error = jest.fn();
    mockPatch.doPatch.mockRejectedValue(new Error("Some Post Error"));
    spinner.close = jest.fn();

    await uc.updateMeta(makeDTO());

    expect(spinner.close).toBeCalled();
  });

  it("Warns if it cannot find the app object by ID when getting", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    UpdateAppAssetMetaUC.get("unknownID", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Warns if the App Object does not have the UC when getting", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    appObjects.getOrCreate("anAppObject");
    UpdateAppAssetMetaUC.get("anAppObject", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Returns the UC when getting", () => {
    const { appObjects, uc } = makeTestRig();

    const returnedUC = UpdateAppAssetMetaUC.get("asset1", appObjects);

    expect(returnedUC).toEqual(uc);
  });

  it("Sets the sandbox state", async () => {
    const { uc, sandbox } = makeTestRig();

    sandbox.state = SandboxState.EDIT_ASSET;

    await uc.updateMeta(makeDTO());

    expect(sandbox.state).toEqual(SandboxState.MOUNTED);
  });
});
