import { makeAppObjectRepo } from "@vived/core";
import { makeMockFetchAssetFileFromAPIUC } from "../../VivedAPI";
import { makeAssetEntity } from "../Entities/AssetEntity";
import { makeAssetRepo } from "../Entities/AssetRepo";
import { makeMockGetAssetUC } from "../Mocks/MockGetAssetUC";
import { GetAssetFileUC, makeGetAssetFileUC } from "./GetAssetFileUC";

// Add mock cache use cases
const mockGetAssetFromCache = {
  getAsset: jest.fn()
};

const mockStoreAssetInCache = {
  storeAsset: jest.fn()
};

jest.mock("../../Cache", () => {
  return {
    GetAssetFromCacheUC: {
      type: "GetAssetFromCacheUC",
      get: () => mockGetAssetFromCache
    },
    StoreAssetInCacheUC: {
      type: "StoreAssetInCacheUC",
      get: () => mockStoreAssetInCache
    }
  };
});

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const singletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const assetRepo = makeAssetRepo(appObjects.getOrCreate("AssetRepo"));

  URL.createObjectURL = jest.fn();

  const mockGetAsset = makeMockGetAssetUC(appObjects);
  const mockFetchedAsset = makeAssetEntity(
    appObjects.getOrCreate("fetchedAsset")
  );
  mockFetchedAsset.fileURL =
    "https://example.com/assets/test-app/1.0.0/images/test.png";
  mockFetchedAsset.filename = "test.png";
  mockGetAsset.getAsset.mockResolvedValue(mockFetchedAsset);

  const mockFetch = makeMockFetchAssetFileFromAPIUC(appObjects);
  const mockFetchedFile = new File([], "file.name");
  mockFetch.doFetch.mockResolvedValue(mockFetchedFile);

  // Reset mock implementations before each test
  mockGetAssetFromCache.getAsset.mockReset();
  mockStoreAssetInCache.storeAsset.mockReset();
  mockGetAssetFromCache.getAsset.mockResolvedValue(undefined);
  mockStoreAssetInCache.storeAsset.mockResolvedValue(undefined);

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
    mockFetchedAsset,
    mockGetAssetFromCache,
    mockStoreAssetInCache
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

  // New tests for caching functionality
  it("retrieves asset from cache when available", async () => {
    const {
      uc,
      mockFetchedAsset,
      mockFetch,
      mockGetAssetFromCache,
      mockGetAsset
    } = makeTestRig();

    const assetId = "cached-asset-id";

    // Setup a cached blob
    const cachedBlob = new Blob(["cached content"], { type: "image/png" });
    mockGetAssetFromCache.getAsset.mockResolvedValue(cachedBlob);

    // Request the asset by ID
    const fetchedFile = await uc.getAssetFile(assetId);

    // Check that API fetch was not called
    expect(mockFetch.doFetch).not.toBeCalled();

    // Verify we got the asset metadata with getAsset
    expect(mockGetAsset.getAsset).toHaveBeenCalledWith(assetId);

    // Verify file was created from the cached blob
    expect(fetchedFile).toBeDefined();
    expect(fetchedFile instanceof File).toBeTruthy();
    expect(fetchedFile.name).toBe(mockFetchedAsset.filename);
  });

  it("falls back to API fetch when cache retrieval fails", async () => {
    const { uc, mockFetch, mockGetAssetFromCache } = makeTestRig();

    const assetId = "problem-asset-id";

    // Setup cache to throw an error
    mockGetAssetFromCache.getAsset.mockRejectedValue(new Error("Cache error"));

    await uc.getAssetFile(assetId);

    // Verify fallback to API fetch
    expect(mockFetch.doFetch).toHaveBeenCalled();
  });

  it("stores fetched asset in cache", async () => {
    const { uc, mockFetchedFile, mockStoreAssetInCache } = makeTestRig();

    const assetId = "store-test-asset-id";

    await uc.getAssetFile(assetId);

    // Verify asset was stored in cache
    expect(mockStoreAssetInCache.storeAsset).toHaveBeenCalledWith(
      assetId,
      expect.any(Blob),
      expect.any(String)
    );
  });

  it("continues even if cache storage fails", async () => {
    const { uc, mockStoreAssetInCache } = makeTestRig();

    const assetId = "store-fail-asset-id";

    // Setup cache store to throw an error
    mockStoreAssetInCache.storeAsset.mockRejectedValue(
      new Error("Cache store error")
    );

    // This should not throw
    const result = await uc.getAssetFile(assetId);

    expect(result).toBeDefined();
  });
});
