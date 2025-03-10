import { makeAppObjectRepo } from "@vived/core";
import { makeMockDeleteAssetUC } from "../Mocks/MockDeleteAssetUC";
import { deleteAsset } from "./deleteAsset";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();

  const mockDelete = makeMockDeleteAssetUC(appObjects);

  return {
    appObjects,
    mockDelete
  };
}

describe("New App Asset Controller", () => {
  it("Calls the UC as expected", () => {
    const { appObjects, mockDelete } = makeTestRig();

    deleteAsset(mockDelete.appObject.id, appObjects);

    expect(mockDelete.deleteWithConfirm).toBeCalledWith();
  });
});
