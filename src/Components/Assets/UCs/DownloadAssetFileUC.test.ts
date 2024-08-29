import { makeHostAppObjectRepo } from "../../../HostAppObject";
import {
  AlertDialogEntity,
  makeDialogQueue,
  makeMockMakeAlertDialogUC,
  SpinnerDialogEntity
} from "../../Dialog";
import { makeAssetEntity } from "../Entities/AssetEntity";
import {
  DownloadAssetFileUC,
  makeDownloadAssetFileUC
} from "./DownloadAssetFileUC";
import { makeMockGetAssetFileUC } from "../Mocks/MockGetAssetFileUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

  const assetAO = appObjects.getOrCreate("asset1");
  const asset = makeAssetEntity(assetAO);

  const mockGetFile = makeMockGetAssetFileUC(appObjects);
  const mockFile = new File([], "file.name");
  mockGetFile.getAssetFile.mockResolvedValue(mockFile);

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

  const uc = makeDownloadAssetFileUC(assetAO);

  const mockSaveLocally = jest.fn();
  uc.saveFileLocally = mockSaveLocally;

  return {
    asset,
    uc,
    mockGetFile,
    appObjects,
    mockFile,
    mockSaveLocally,
    spinner,
    mockMakeAlert,
    dialogQueue
  };
}

describe("Download Asset File", () => {
  it("Calls the Fetch asset file UC if the Asset does not have a file", async () => {
    const { uc, mockGetFile } = makeTestRig();

    await uc.download();

    expect(mockGetFile.getAssetFile).toBeCalledWith("asset1");
  });

  it("Saves the file after fetching", async () => {
    const { uc, mockSaveLocally } = makeTestRig();

    await uc.download();

    expect(mockSaveLocally).toBeCalled();
  });

  it("Shows a spinner if it needs to download the file", () => {
    const { uc, dialogQueue, spinner } = makeTestRig();

    dialogQueue.submitDialog = jest.fn();

    uc.download();

    expect(dialogQueue.submitDialog).toBeCalledWith(spinner);
  });

  it("Hides the spinner when completed", async () => {
    const { uc, spinner } = makeTestRig();
    spinner.close = jest.fn();

    await uc.download();

    expect(spinner.close).toBeCalled();
  });

  it("Shows an alert if rejected", async () => {
    const { uc, mockGetFile, dialogQueue, mockMakeAlert } = makeTestRig();
    uc.error = jest.fn();
    mockGetFile.getAssetFile.mockRejectedValue(new Error("Some Post Error"));
    dialogQueue.submitDialog = jest.fn();

    await uc.download();

    expect(mockMakeAlert.make).toBeCalled();
  });

  it("Hides the spinner when rejected", async () => {
    const { uc, mockGetFile, spinner } = makeTestRig();
    uc.error = jest.fn();
    mockGetFile.getAssetFile.mockRejectedValue(new Error("Some Post Error"));
    spinner.close = jest.fn();

    await uc.download();

    expect(spinner.close).toBeCalled();
  });

  it("Warns if it cannot find the app object by ID when getting", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    DownloadAssetFileUC.get("unknownID", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Warns if the App Object does not have the UC when getting", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    appObjects.getOrCreate("anAppObject");
    DownloadAssetFileUC.get("anAppObject", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Returns the UC when getting", () => {
    const { appObjects, uc } = makeTestRig();

    const returnedUC = DownloadAssetFileUC.get("asset1", appObjects);

    expect(returnedUC).toEqual(uc);
  });

  it("Doesn't download if the file exists", async () => {
    const { uc, mockGetFile, mockFile, asset, mockSaveLocally } = makeTestRig();

    URL.createObjectURL = jest.fn().mockResolvedValue("www.someurl.com");
    asset.setFile(mockFile);

    await uc.download();

    expect(mockGetFile.getAssetFile).not.toBeCalled();
    expect(mockSaveLocally).toBeCalled();
  });

  it("Doesn't show a spinner the file exists", async () => {
    const { uc, dialogQueue, mockFile, asset } = makeTestRig();

    dialogQueue.submitDialog = jest.fn();
    URL.createObjectURL = jest.fn().mockResolvedValue("www.someurl.com");
    asset.setFile(mockFile);

    await uc.download();

    expect(dialogQueue.submitDialog).toBeCalledTimes(0);
  });
});
