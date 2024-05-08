import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeAssetEntity } from "../../Assets";
import { makeMockBlobRequestUC } from "../Mocks/MockBlobRequestUC";
import { makeFetchAssetFileUC } from "./FetchAssetFileUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

  const mockRequestBlob = makeMockBlobRequestUC(appObjects);
  mockRequestBlob.doRequest.mockResolvedValue(new Blob([]));

  const fetchAssetFile = makeFetchAssetFileUC(appObjects.getOrCreate("ao"));

  const asset = makeAssetEntity(appObjects.getOrCreate("asset1"));
  asset.fileURL = "https://www.some.url";
  asset.filename = "someFile.name";

  return {
    fetchAssetFile,
    asset,
    appObjects,
    mockRequestBlob
  };
}

describe("Fetch Asset File", () => {
  it("Rejects if there is no file url for the asset", async () => {
    const { fetchAssetFile, asset } = makeTestRig();

    asset.fileURL = "";

    return expect(fetchAssetFile.doFetch(asset)).rejects.toEqual(
      new Error("asset1 does not have a file URL")
    );
  });

  it("Rejects if there is no file name for the asset", async () => {
    const { fetchAssetFile, asset } = makeTestRig();

    asset.filename = "";

    return expect(fetchAssetFile.doFetch(asset)).rejects.toEqual(
      new Error("asset1 does not have a filename")
    );
  });

  it("Rejects if the fetcher rejects", async () => {
    const { fetchAssetFile, mockRequestBlob, appObjects, asset } =
      makeTestRig();
    appObjects.submitWarning = jest.fn();
    mockRequestBlob.doRequest.mockRejectedValue(new Error("Some Error"));

    return expect(fetchAssetFile.doFetch(asset)).rejects.toEqual(
      new Error("Some Error") // TODO, this should return the original error
    );
  });

  it("Calls the requst blob with the asset url", async () => {
    const { fetchAssetFile, asset, mockRequestBlob } = makeTestRig();

    await fetchAssetFile.doFetch(asset);

    expect(mockRequestBlob.doRequest).toBeCalledTimes(1);
    const callURL = mockRequestBlob.doRequest.mock.calls[0][0] as URL;

    expect(callURL.toString()).toEqual("https://www.some.url/");
  });

  it("Resolves with a File", async () => {
    const { fetchAssetFile, asset } = makeTestRig();

    const file = await fetchAssetFile.doFetch(asset);

    expect(file.name).toEqual("someFile.name");
  });
});
