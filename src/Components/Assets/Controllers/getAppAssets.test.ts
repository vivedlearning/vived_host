import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockGetAppAssetsUC } from "../Mocks/MockGetAppAssetsUC";
import { getAppAssets } from "./getAppAssets";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

  const mockDelete = makeMockGetAppAssetsUC(appObjects);

  return {
    appObjects,
    mockDelete
  };
}

describe("Get App Assets Controller", () => {
  it("Calls the UC as expected", () => {
    const { appObjects, mockDelete } = makeTestRig();

    getAppAssets("appID", appObjects);

    expect(mockDelete.getAppAssets).toBeCalledWith("appID");
  });
});
