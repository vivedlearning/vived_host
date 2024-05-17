import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { AlertDialogEntity, makeDialogQueue, SpinnerDialogEntity } from "../../Dialog";
import { mockMockPatchAssetFileUC } from "../../VivedAPI";
import { makeAssetEntity } from "../Entities/AssetEntity";
import { makeUpdateAssetFileUC, UpdateAssetFileUC } from "./UpdateAssetFileUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

  const assetAO = appObjects.getOrCreate("asset1");
  const asset = makeAssetEntity(assetAO);
  const mockSetAssetFile = jest.fn();
  asset.setFile = mockSetAssetFile;

  const mockPatch = mockMockPatchAssetFileUC(appObjects);
  mockPatch.doPatch.mockResolvedValue("new.filename");

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

  const uc = makeUpdateAssetFileUC(assetAO);

  return {
    asset,
    uc,
    mockPatch,
    appObjects,
    mockSetAssetFile,
    spinner,
    alert,
    dialogQueue
  };
}

describe("Archive Asset", () => {
  it("Sets the asset's file'", async () => {
    const { uc, mockSetAssetFile } = makeTestRig();

    const mockFile = new File([], "file.name");
    await uc.updateFile(mockFile);

    expect(mockSetAssetFile).toBeCalledWith(mockFile);
  });

  it("Sets the asset's filename'", async () => {
    const { uc, asset } = makeTestRig();

    asset.filename = "something";

    const mockFile = new File([], "file.name");
    await uc.updateFile(mockFile);

    expect(asset.filename).toEqual("new.filename");
  });

  it("Calls the Patch UC as expected", async () => {
    const { uc, mockPatch, asset } = makeTestRig();

    const mockFile = new File([], "file.name");
    await uc.updateFile(mockFile);

    expect(mockPatch.doPatch).toBeCalledWith(asset.id, mockFile);
  });

  it("Shows a spinner", () => {
    const { uc, dialogQueue, spinner } = makeTestRig();

    dialogQueue.submitDialog = jest.fn();

    const mockFile = new File([], "file.name");
    uc.updateFile(mockFile);

    expect(dialogQueue.submitDialog).toBeCalledWith(spinner);
  });

  it("Hides the spinner when completed", async () => {
    const { uc, spinner } = makeTestRig();
    spinner.close = jest.fn();

    const mockFile = new File([], "file.name");
    await uc.updateFile(mockFile);

    expect(spinner.close).toBeCalled();
  });

  it("Shows an alert if rejected", async () => {
    const { uc, dialogQueue, mockPatch, alert } = makeTestRig();
    uc.error = jest.fn();
    mockPatch.doPatch.mockRejectedValue(new Error("Some Post Error"));
    dialogQueue.submitDialog = jest.fn();

    const mockFile = new File([], "file.name");
    await uc.updateFile(mockFile);

    expect(dialogQueue.submitDialog).toBeCalledWith(alert);
  });

  it("Hides the spinner when rejected", async () => {
    const { uc, mockPatch, spinner } = makeTestRig();
    uc.error = jest.fn();
    mockPatch.doPatch.mockRejectedValue(new Error("Some Post Error"));
    spinner.close = jest.fn();

    const mockFile = new File([], "file.name");
    await uc.updateFile(mockFile);

    expect(spinner.close).toBeCalled();
  });

  it("Warns if it cannot find the app object by ID when getting", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    UpdateAssetFileUC.get("unknownID", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Warns if the App Object does not have the UC when getting", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    appObjects.getOrCreate("anAppObject");
    UpdateAssetFileUC.get("anAppObject", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Returns the UC when getting", () => {
    const { appObjects, uc } = makeTestRig();

    const returnedUC = UpdateAssetFileUC.get("asset1", appObjects);

    expect(returnedUC).toEqual(uc);
  });
});
