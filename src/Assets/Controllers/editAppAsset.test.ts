import { makeAppObjectRepo } from "@vived/core";
import { makeMockEditAppAssetUC } from "../Mocks/MockEditAppAssetUC";
import { editAppAsset } from "./editAppAsset";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();

  const mockEdit = makeMockEditAppAssetUC(appObjects);

  return {
    appObjects,
    mockEdit
  };
}

describe("New App Asset Controller", () => {
  it("Calls the UC as expected", () => {
    const { appObjects, mockEdit } = makeTestRig();

    editAppAsset("anAsset", appObjects);

    expect(mockEdit.editAsset).toBeCalledWith("anAsset");
  });
});
