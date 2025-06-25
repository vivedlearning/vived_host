import { makeAppObjectRepo } from "@vived/core";
import { makeMockGetAssetFileUC } from "../Mocks/MockGetAssetFileUC";
import { fetchAssetFile } from "./fetchAssetFile";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();

  const mockGetAssetFileUC = makeMockGetAssetFileUC(appObjects);

  return {
    appObjects,
    mockGetAssetFileUC
  };
}

describe("Fetch Asset File Controller", () => {
  it("Calls the UC as expected", () => {
    const { appObjects, mockGetAssetFileUC } = makeTestRig();

    fetchAssetFile("anAsset", appObjects);

    expect(mockGetAssetFileUC.getAssetFile).toBeCalledWith("anAsset");
  });

  it("Returns undefined and submits warning when UC is not found", () => {
    const appObjects = makeAppObjectRepo();
    const submitWarningSpy = jest.spyOn(appObjects, "submitWarning");

    const result = fetchAssetFile("anAsset", appObjects);

    expect(result).toBeUndefined();
    expect(submitWarningSpy).toHaveBeenCalledWith(
      "fetchAssetFile",
      "Unable to find GetAssetFileUC"
    );
  });

  it("Returns the promise from UC when UC is found", () => {
    const { appObjects, mockGetAssetFileUC } = makeTestRig();
    const mockPromise = Promise.resolve(new File([], "test.txt"));
    mockGetAssetFileUC.getAssetFile.mockReturnValue(mockPromise);

    const result = fetchAssetFile("anAsset", appObjects);

    expect(result).toBe(mockPromise);
  });
});
