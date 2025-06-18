import { makeAppObjectRepo } from "@vived/core";
import { makeMockFetchAssetFileFromAPIUC } from "../../VivedAPI";
import { makeAssetEntity } from "../Entities/AssetEntity";
import { makeAssetRepo } from "../Entities/AssetRepo";
import { makeMockGetAssetUC } from "../Mocks/MockGetAssetUC";
import { GetAssetBlobURLUC, makeGetAssetBlobURLUC } from "./GetAssetBlobURLUC";
import {
  makeMockGetAssetFromCacheUC,
  makeMockStoreAssetInCacheUC
} from "../../Cache";

// Mock URL methods that are not available in Node.js environment
if (!global.URL.createObjectURL) {
  global.URL.createObjectURL = jest.fn().mockReturnValue("mock-blob-url");
}

if (!global.URL.revokeObjectURL) {
  global.URL.revokeObjectURL = jest.fn();
}

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const singletonSpy = jest.spyOn(appObjects, "registerSingleton");

  // Reset mocks to ensure clean state
  (global.URL.createObjectURL as jest.Mock).mockReturnValue("mock-blob-url");
  (global.URL.revokeObjectURL as jest.Mock).mockClear();

  // Create mock fetch implementation
  const mockFetch = makeMockFetchAssetFileFromAPIUC(appObjects);
  const mockFetchedFile = new File([], "test-file.png");
  mockFetch.doFetch.mockResolvedValue(mockFetchedFile);

  // Create mock get asset implementation
  const mockGetAsset = makeMockGetAssetUC(appObjects);
  const mockFetchedAsset = makeAssetEntity(
    appObjects.getOrCreate("fetchedAsset")
  );

  // Set a file to generate a blobURL
  mockFetchedAsset.setFile(new File([], "test-file.png"));

  mockGetAsset.getAsset.mockResolvedValue(mockFetchedAsset);

  // Create asset repository
  const assetRepo = makeAssetRepo(appObjects.getOrCreate("AssetRepo"));

  // Create cache components and register as singletons
  const mockGetAssetFromCache =
    makeMockGetAssetFromCacheUC(appObjects).getAsset;
  const mockStoreAssetInCache =
    makeMockStoreAssetInCacheUC(appObjects).storeAsset;

  // Set up mock cache behavior for different tests
  mockGetAssetFromCache.mockImplementation((id) => {
    if (id === "cached-asset-id") {
      return Promise.resolve(
        new Blob(["cached content"], { type: "image/png" })
      );
    }
    return Promise.resolve(null);
  });

  mockStoreAssetInCache.mockImplementation(() => Promise.resolve());

  // Create the component under test
  const uc = makeGetAssetBlobURLUC(appObjects.getOrCreate("AssetRepo"));

  // Add an existing asset to the repo
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

describe("Get Asset Blob URL UC", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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

    expect(blobURL).toEqual("mock-blob-url");
    expect(mockGetAsset.getAsset).not.toBeCalled();
    expect(mockFetch.doFetch).not.toBeCalled();
  });

  it("Resolves with the blob url", async () => {
    const { uc } = makeTestRig();

    const blobURL = await uc.getAssetBlobURL("assetID");

    expect(blobURL).toEqual("mock-blob-url");
  });

  it("Stores the file on the asset", async () => {
    const { mockFetchedFile, uc, mockFetchedAsset } = makeTestRig();

    // Clear the file that was set in makeTestRig
    Object.defineProperty(mockFetchedAsset, "_file", {
      value: undefined,
      writable: true
    });

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
    const { uc, mockFetchedAsset, mockFetch, appObjects } = makeTestRig();
    appObjects.submitWarning = jest.fn(); // Mock submitWarning for this specific test

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
    const { uc, mockFetch, appObjects } = makeTestRig();
    appObjects.submitWarning = jest.fn(); // Mock submitWarning for this specific test

    mockFetch.doFetch.mockRejectedValue(new Error("Some Error"));

    return expect(uc.getAssetBlobURL("assetID")).rejects.toEqual(
      new Error("Some Error")
    );
  });

  it("Reject if the get asset rejects", () => {
    const { uc, mockGetAsset, appObjects } = makeTestRig();
    appObjects.submitWarning = jest.fn(); // Mock submitWarning for this specific test

    mockGetAsset.getAsset.mockRejectedValue(new Error("Some Other Error"));

    return expect(uc.getAssetBlobURL("assetID")).rejects.toEqual(
      new Error("Some Other Error")
    );
  });

  it("clears is fetching with error", async () => {
    const { uc, mockFetchedAsset, mockFetch, appObjects } = makeTestRig();
    appObjects.submitWarning = jest.fn(); // Mock submitWarning for this specific test

    mockFetch.doFetch.mockRejectedValue(new Error("Some Error"));
    mockFetchedAsset.isFetchingFile = true;

    expect.assertions(1);

    try {
      await uc.getAssetBlobURL("assetID");
    } catch {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(mockFetchedAsset.isFetchingFile).toEqual(false);
    }
  });

  it("retrieves asset from cache when available", async () => {
    const { uc, mockFetch, mockGetAssetFromCache } = makeTestRig();

    const assetId = "cached-asset-id";
    const result = await uc.getAssetBlobURL(assetId);

    expect(mockGetAssetFromCache).toHaveBeenCalledWith(assetId);
    expect(mockFetch.doFetch).not.toBeCalled();
    expect(result).toEqual("mock-blob-url");
  });

  it("falls back to API fetch when cache retrieval fails", async () => {
    const { uc, mockFetch, mockGetAssetFromCache, appObjects } = makeTestRig();
    appObjects.submitWarning = jest.fn(); // Mock submitWarning for this specific test

    mockGetAssetFromCache.mockRejectedValueOnce(new Error("Cache error"));

    await uc.getAssetBlobURL("assetID");

    expect(mockGetAssetFromCache).toHaveBeenCalledWith("assetID");
    expect(mockFetch.doFetch).toHaveBeenCalled();
  });

  it("stores fetched asset in cache", async () => {
    const { uc, mockStoreAssetInCache } = makeTestRig();

    const assetId = "store-test-asset-id";
    await uc.getAssetBlobURL(assetId);

    expect(mockStoreAssetInCache).toHaveBeenCalledWith(
      assetId,
      expect.any(Blob),
      expect.any(String)
    );
  });

  it("continues even if cache storage fails", async () => {
    const { uc, mockStoreAssetInCache, appObjects } = makeTestRig();
    appObjects.submitWarning = jest.fn(); // Mock submitWarning for this specific test

    mockStoreAssetInCache.mockRejectedValueOnce(new Error("Storage error"));

    const result = await uc.getAssetBlobURL("assetID");

    expect(result).toEqual("mock-blob-url");
  });

  // Tests for cache bypass functionality
  describe("useCache parameter", () => {
    it("bypasses all cache when useCache is false", async () => {
      const { uc, mockFetch, mockGetAssetFromCache, assetRepo, existingAsset } =
        makeTestRig();

      // Set up an existing asset with blob URL to verify it's bypassed
      const file = new File([], "existing-file.png");
      existingAsset.setFile(file);
      assetRepo.add(existingAsset);

      const result = await uc.getAssetBlobURL(existingAsset.id, false);

      // Should not check cache at all
      expect(mockGetAssetFromCache).not.toHaveBeenCalled();

      // Should call API directly
      expect(mockFetch.doFetch).toHaveBeenCalled();

      expect(result).toEqual("mock-blob-url");
    });

    it("uses cache when useCache is true", async () => {
      const { uc, mockFetch, mockGetAssetFromCache } = makeTestRig();

      const assetId = "cached-asset-id";
      const result = await uc.getAssetBlobURL(assetId, true);

      expect(mockGetAssetFromCache).toHaveBeenCalledWith(assetId);
      expect(mockFetch.doFetch).not.toBeCalled();
      expect(result).toEqual("mock-blob-url");
    });

    it("uses cache when useCache is not provided (default behavior)", async () => {
      const { uc, mockFetch, mockGetAssetFromCache } = makeTestRig();

      const assetId = "cached-asset-id";
      const result = await uc.getAssetBlobURL(assetId);

      expect(mockGetAssetFromCache).toHaveBeenCalledWith(assetId);
      expect(mockFetch.doFetch).not.toBeCalled();
      expect(result).toEqual("mock-blob-url");
    });

    it("still manages fetch state when bypassing cache", async () => {
      const { uc, mockFetchedAsset } = makeTestRig();

      // Clear any existing file to ensure we go through the fetch process
      Object.defineProperty(mockFetchedAsset, "_file", {
        value: undefined,
        writable: true
      });

      expect(mockFetchedAsset.isFetchingFile).toBeFalsy();

      await uc.getAssetBlobURL("assetID", false);

      // Should have properly managed fetch state
      expect(mockFetchedAsset.isFetchingFile).toEqual(false);
    });

    it("handles errors properly when bypassing cache", async () => {
      const { uc, mockFetch, mockFetchedAsset, appObjects } = makeTestRig();
      appObjects.submitWarning = jest.fn();

      mockFetch.doFetch.mockRejectedValue(new Error("API Error"));

      expect.assertions(2);
      try {
        await uc.getAssetBlobURL("assetID", false);
      } catch (error) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(error).toEqual(new Error("API Error"));
        // eslint-disable-next-line jest/no-conditional-expect
        expect(mockFetchedAsset.fetchError).toEqual(new Error("API Error"));
      }
    });
  });
});
