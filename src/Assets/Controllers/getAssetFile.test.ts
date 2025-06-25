import { makeAppObjectRepo } from "@vived/core";
import { makeMockGetAssetFileUC } from "../Mocks/MockGetAssetFileUC";
import { getAssetFile } from "./getAssetFile";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();

  const mockGetAssetFileUC = makeMockGetAssetFileUC(appObjects);

  return {
    appObjects,
    mockGetAssetFileUC
  };
}

describe("Get Asset File Controller", () => {
  it("Calls the UC as expected", () => {
    const { appObjects, mockGetAssetFileUC } = makeTestRig();

    getAssetFile("anAsset", appObjects);

    expect(mockGetAssetFileUC.getAssetFile).toBeCalledWith("anAsset");
  });

  it("Returns undefined and submits warning when UC is not found", () => {
    const appObjects = makeAppObjectRepo();
    const submitWarningSpy = jest.spyOn(appObjects, "submitWarning");

    const result = getAssetFile("anAsset", appObjects);

    expect(result).toBeUndefined();
    expect(submitWarningSpy).toHaveBeenCalledWith(
      "getAssetFile",
      "Unable to find GetAssetFileUC"
    );
  });

  it("Returns the promise from UC when UC is found", () => {
    const { appObjects, mockGetAssetFileUC } = makeTestRig();
    const mockPromise = Promise.resolve(new File([], "test.txt"));
    mockGetAssetFileUC.getAssetFile.mockReturnValue(mockPromise);

    const result = getAssetFile("anAsset", appObjects);

    expect(result).toBe(mockPromise);
  });
});
