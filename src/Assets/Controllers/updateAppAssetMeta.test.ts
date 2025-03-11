import { makeAppObjectRepo } from "@vived/core";
import { makeMockUpdateAppAssetMetaUC } from "../Mocks/MockUpdateAppAssetMetaUC";
import { UpdateAppAssetMetaDTO } from "../UCs/UpdateAppAssetMetaUC";
import { updateAppAssetMeta } from "./updateAppAssetMeta";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();

  const mockUC = makeMockUpdateAppAssetMetaUC(appObjects);

  return {
    appObjects,
    mockUC
  };
}

describe("New App Asset Controller", () => {
  it("Calls the UC as expected", () => {
    const { appObjects, mockUC } = makeTestRig();

    const meta: UpdateAppAssetMetaDTO = {
      name: "Some Name",
      archived: false,
      description: "Some description"
    };

    updateAppAssetMeta(meta, mockUC.appObject.id, appObjects);

    expect(mockUC.updateMeta).toBeCalledWith(meta);
  });
});
