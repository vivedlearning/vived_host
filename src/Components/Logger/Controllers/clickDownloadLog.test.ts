import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockDownloadLogUC } from "../Mocks/MockDownloadLogUC";
import { clickDownloadLog } from "./clickDownloadLog";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

  const mockUC = makeMockDownloadLogUC(appObjects);

  return { appObjects, mockUC };
}

describe("Click Download File", () => {
  it("Triggers the uc", () => {
    const { appObjects, mockUC } = makeTestRig();

    clickDownloadLog(appObjects);

    expect(mockUC.doDownload).toBeCalled();
  });
});
