import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockDownloadAssetFileUC } from "../Mocks/MockDownloadAssetFileUC";
import { downloadAssetFile } from "./downloadAssetFile";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

  const mockDownload = makeMockDownloadAssetFileUC(appObjects);

  return {
    appObjects,
    mockDownload
  };
}

describe("New App Asset Controller", () => {
  it("Calls the UC as expected", () => {
    const { appObjects, mockDownload } = makeTestRig();

    downloadAssetFile(mockDownload.appObject.id, appObjects);

    expect(mockDownload.download).toBeCalled();
  });
});
