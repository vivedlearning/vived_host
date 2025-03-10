import { makeAppObjectRepo } from "@vived/core";
import { makeMockFetchAssetFileFromAPIUC } from "../../VivedAPI";
import { makeAssetEntity } from "../Entities/AssetEntity";
import { makeAssetRepo } from "../Entities/AssetRepo";
import { makeMockGetAssetUC } from "../Mocks/MockGetAssetUC";
import { GetAssetBlobURLUC, makeGetAssetBlobURLUC } from "./GetAssetBlobURLUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const singletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const assetRepo = makeAssetRepo(appObjects.getOrCreate("AssetRepo"));

  URL.createObjectURL = jest.fn().mockReturnValue("www.some.url");

  const mockGetAsset = makeMockGetAssetUC(appObjects);
  const mockFetchedAsset = makeAssetEntity(
    appObjects.getOrCreate("fetchedAsset")
  );
  mockGetAsset.getAsset.mockResolvedValue(mockFetchedAsset);

  const mockFetch = makeMockFetchAssetFileFromAPIUC(appObjects);
  const mockFetchedFile = new File([], "file.name");
  mockFetch.doFetch.mockResolvedValue(mockFetchedFile);

  const uc = makeGetAssetBlobURLUC(appObjects.getOrCreate("AssetRepo"));

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

    expect(GetAssetBlobURLUC.get(appObjects)).toEqual(uc);
  });

  it("Resolves immediately if the asset exists and already has a blob url", async () => {
    const { uc, mockGetAsset, existingAsset, mockFetch } = makeTestRig();

    const file = new File([], "file.name");
    existingAsset.setFile(file);

    const blobURL = await uc.getAssetBlobURL(existingAsset.id);

    expect(blobURL).toEqual("www.some.url");
    expect(mockGetAsset.getAsset).not.toBeCalled();
    expect(mockFetch.doFetch).not.toBeCalled();
  });

  it("Resolves with the blob url", async () => {
    const { uc } = makeTestRig();

    const blobURL = await uc.getAssetBlobURL("assetID");

    expect(blobURL).toEqual("www.some.url");
  });

  it("Stores the file on the asset", async () => {
    const { mockFetchedFile, uc, mockFetchedAsset } = makeTestRig();

    expect(mockFetchedAsset.file).toBeUndefined();

    await uc.getAssetBlobURL("assetID");

    expect(mockFetchedAsset.file).toEqual(mockFetchedFile);
  });

  it("Sets is fetching to false when done fetching", async () => {
    const { uc, mockFetchedAsset } = makeTestRig();

    mockFetchedAsset.isFetchingFile = true;

    await uc.getAssetBlobURL("assetID");

    expect(mockFetchedAsset.isFetchingFile).toEqual(false);
  });

  it("Clears existing error if the fetch was successful", async () => {
    const { uc, mockFetchedAsset } = makeTestRig();

    mockFetchedAsset.fetchError = new Error("Some Error");
    await uc.getAssetBlobURL("assetID");

    expect(mockFetchedAsset.fetchError).toBeUndefined();
  });

  it("Sets a fetch error", async () => {
    const { uc, mockFetchedAsset, mockFetch } = makeTestRig();

    mockFetch.doFetch.mockRejectedValue(new Error("Some Error"));

    expect.assertions(1);
    try {
      await uc.getAssetBlobURL("assetID");
    } catch {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(mockFetchedAsset.fetchError).toEqual(new Error("Some Error"));
    }
  });

  it("Reject if the fetch rejects", () => {
    const { uc, mockFetch } = makeTestRig();

    mockFetch.doFetch.mockRejectedValue(new Error("Some Error"));

    return expect(uc.getAssetBlobURL("assetID")).rejects.toEqual(
      new Error("Some Error")
    );
  });

  it("Reject if the get asset rejects", () => {
    const { uc, mockGetAsset } = makeTestRig();

    mockGetAsset.getAsset.mockRejectedValue(new Error("Some Error"));

    return expect(uc.getAssetBlobURL("assetID")).rejects.toEqual(
      new Error("Some Error")
    );
  });

  it("clears is fetching with error", async () => {
    const { uc, mockFetchedAsset, mockFetch } = makeTestRig();
    mockFetchedAsset.isFetchingFile = true;
    mockFetch.doFetch.mockRejectedValue(new Error("Some Error"));

    expect.assertions(1);
    try {
      await uc.getAssetBlobURL("asset1");
    } catch {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(mockFetchedAsset.isFetchingFile).toEqual(false);
    }
  });
});
