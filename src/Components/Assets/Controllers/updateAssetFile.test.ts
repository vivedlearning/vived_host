import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockUpdateAssetFileUC } from "../Mocks/MockUpdateAssetFileUC";
import { updateAssetFile } from "./updateAssetFile";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

  const mockUC = makeMockUpdateAssetFileUC(appObjects);

  return {
    appObjects,
    mockUC
  };
}

describe("New App Asset Controller", () => {
  it("Calls the UC as expected", () => {
    const { appObjects, mockUC } = makeTestRig();

    const file = new File([], "file.name");

    updateAssetFile(file, mockUC.appObject.id, appObjects);

    expect(mockUC.updateFile).toBeCalledWith(file);
  });
});
