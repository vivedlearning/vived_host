import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockDeleteAssetUC } from "../Mocks/MockDeleteAssetUC";
import { deleteAsset } from "./deleteAsset";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

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
