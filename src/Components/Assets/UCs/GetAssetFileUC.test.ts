import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockFetchAssetFileFromAPIUC } from "../../VivedAPI";
import { makeAssetEntity } from "../Entities/AssetEntity";
import { makeAssetRepo } from "../Entities/AssetRepo";
import { makeMockGetAssetUC } from "../Mocks/MockGetAssetUC";
import { GetAssetFileUC, makeGetAssetFileUC } from "./GetAssetFileUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const singletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const assetRepo = makeAssetRepo(appObjects.getOrCreate("AssetRepo"));

  URL.createObjectURL = jest.fn();

  const mockGetAsset = makeMockGetAssetUC(appObjects);
  const mockFetchedAsset = makeAssetEntity(
    appObjects.getOrCreate("fetchedAsset")
  );
  mockGetAsset.getAsset.mockResolvedValue(mockFetchedAsset);

  const mockFetch = makeMockFetchAssetFileFromAPIUC(appObjects);
  const mockFetchedFile = new File([], "file.name");
  mockFetch.doFetch.mockResolvedValue(mockFetchedFile);

  const uc = makeGetAssetFileUC(appObjects.getOrCreate("AssetRepo"));

  const existingAsset = makeAssetEntity(
    appObjects.getOrCreate("existingAsset")
  );
  assetRepo.add(existingAsset);

  return {
    uc,
    mockFetch,
    appObjects,
    mockFetchedFile,
    singletonSpy,
    assetRepo,
    mockGetAsset,
    existingAsset,
    mockFetchedAsset
  };
}

describe("Get Asset File UC", () => {
  it("Registers itself as the Singleton", () => {
    const { uc, singletonSpy } = makeTestRig();

    expect(singletonSpy).toBeCalledWith(uc);
  });

  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(GetAssetFileUC.get(appObjects)).toEqual(uc);
  });

  it("Resolves immediately if the asset exists and already has a file", async () => {
    const { uc, mockGetAsset, existingAsset, mockFetch } = makeTestRig();

    const file = new File([], "file.name");
    existingAsset.setFile(file);

    const fetchedFile = await uc.getAssetFile(existingAsset.id);

    expect(fetchedFile).toEqual(file);
    expect(mockGetAsset.getAsset).not.toBeCalled();
    expect(mockFetch.doFetch).not.toBeCalled();
  });

  it("Resolves with the file", async () => {
    const { mockFetchedFile, uc } = makeTestRig();

    const fetchedFile = await uc.getAssetFile("assetID");

    expect(fetchedFile).toEqual(mockFetchedFile);
  });

  it("Stores the file on the asset", async () => {
    const { mockFetchedFile, uc, mockFetchedAsset } = makeTestRig();

    expect(mockFetchedAsset.file).toBeUndefined();

    await uc.getAssetFile("assetID");

    expect(mockFetchedAsset.file).toEqual(mockFetchedFile);
  });

  it("Sets is fetching to false when done fetching", async () => {
    const { uc, mockFetchedAsset } = makeTestRig();

    mockFetchedAsset.isFetchingFile = true;

    await uc.getAssetFile("assetID");

    expect(mockFetchedAsset.isFetchingFile).toEqual(false);
  });

  it("Clears existing error if the fetch was successful", async () => {
    const { uc, mockFetchedAsset } = makeTestRig();

    mockFetchedAsset.fetchError = new Error("Some Error");
    await uc.getAssetFile("assetID");

    expect(mockFetchedAsset.fetchError).toBeUndefined();
  });

  it("Sets a fetch error", async () => {
    const { uc, mockFetchedAsset, mockFetch } = makeTestRig();

    mockFetch.doFetch.mockRejectedValue(new Error("Some Error"));

    expect.assertions(1);
    try {
      await uc.getAssetFile("assetID");
    } catch {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(mockFetchedAsset.fetchError).toEqual(new Error("Some Error"));
    }
  });

  it("Reject if the fetch rejects", () => {
    const { uc, mockFetch } = makeTestRig();

    mockFetch.doFetch.mockRejectedValue(new Error("Some Error"));

    return expect(uc.getAssetFile("assetID")).rejects.toEqual(
      new Error("Some Error")
    );
  });

  it("Reject if the get asset rejects", () => {
    const { uc, mockGetAsset } = makeTestRig();

    mockGetAsset.getAsset.mockRejectedValue(new Error("Some Error"));

    return expect(uc.getAssetFile("assetID")).rejects.toEqual(
      new Error("Some Error")
    );
  });

  it("clears is fetching with error", async () => {
    const { uc, mockFetchedAsset, mockFetch } = makeTestRig();
    mockFetchedAsset.isFetchingFile = true;
    mockFetch.doFetch.mockRejectedValue(new Error("Some Error"));

    expect.assertions(1);
    try {
      await uc.getAssetFile("asset1");
    } catch {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(mockFetchedAsset.isFetchingFile).toEqual(false);
    }
  });
});
