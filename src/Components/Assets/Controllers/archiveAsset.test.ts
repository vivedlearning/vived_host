import { makeAppObjectRepo } from "@vived/core";
import { makeMockArchiveAssetUC } from "../Mocks/MockArchiveAsset";
import { archiveAsset } from "./archiveAsset";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();

  const mockArchive = makeMockArchiveAssetUC(appObjects);

  return {
    appObjects,
    mockArchive
  };
}

describe("New App Asset Controller", () => {
  it("Calls the UC as expected", async () => {
    const { appObjects, mockArchive } = makeTestRig();

    await archiveAsset(mockArchive.appObject.id, true, appObjects);

    expect(mockArchive.setArchived).toBeCalledWith(true);
  });
});
