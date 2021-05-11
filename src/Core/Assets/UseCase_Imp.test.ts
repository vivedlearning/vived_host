import {
  AppFileVersionError,
  AssetHasNotBeenLoadedError,
  DuplicateAssetID,
  EmptyAssetIDError,
  InvalidAssetID,
} from "./Errors";
import { makeUseCase, mockBoundaryAsset, mockBoundaryAssetFile } from "./mocks";

describe("Testing Asset Core", () => {
  window.URL.revokeObjectURL = jest.fn();

  test("Initialization", () => {
    const useCase = makeUseCase();
    expect(useCase.getAllAssets()).toHaveLength(0);
  });

  test("Adding an asset", () => {
    const useCase = makeUseCase();
    const mockAsset = mockBoundaryAsset("asset_id");
    useCase.addAsset(mockAsset);

    expect(useCase.getAllAssets()).toHaveLength(1);
    expect(useCase.getAllAssets()[0].id).toEqual("asset_id");
  });

  test("Adding an asset with a duplicate ID should throw an error", () => {
    const useCase = makeUseCase();
    const mockAsset = mockBoundaryAsset("asset_id");
    useCase.addAsset(mockAsset);

    expect(() => useCase.addAsset(mockAsset)).toThrowError(DuplicateAssetID);
    expect(useCase.getAllAssets()).toHaveLength(1);
  });

  test("Adding an asset with a falsy id throws an error", () => {
    const useCase = makeUseCase();
    const mockAsset = mockBoundaryAsset("asset_id");
    mockAsset.id = "";
    expect(() => useCase.addAsset(mockAsset)).toThrowError(EmptyAssetIDError);
    expect(useCase.getAllAssets()).toHaveLength(0);
  });

  test("Getting an asset", () => {
    const useCase = makeUseCase();
    const original = mockBoundaryAsset("asset_id");
    useCase.addAsset(original);

    const retrieved = useCase.getAsset("asset_id");
    expect(retrieved).toEqual(original);
  });

  test("Getting an unknown asset should throw an error", () => {
    const useCase = makeUseCase();
    expect(() => useCase.getAsset("some id")).toThrowError(InvalidAssetID);
  });

  test("Adding many assets", () => {
    const useCase = makeUseCase();
    const mockAsset1 = mockBoundaryAsset("asset1");
    const mockAsset2 = mockBoundaryAsset("asset2");
    const mockAsset3 = mockBoundaryAsset("asset3");

    useCase.addManyAssets([mockAsset1, mockAsset2, mockAsset3]);
    expect(useCase.getAllAssets()).toHaveLength(3);
  });

  test("Adding many assets is additive", () => {
    const useCase = makeUseCase();
    const mockAsset1 = mockBoundaryAsset("asset1");
    useCase.addAsset(mockAsset1);

    const mockAsset2 = mockBoundaryAsset("asset2");
    const mockAsset3 = mockBoundaryAsset("asset3");

    useCase.addManyAssets([mockAsset2, mockAsset3]);
    expect(useCase.getAllAssets()).toHaveLength(3);
  });

  test("Adding many assets with a duplicate ID should throw an error", () => {
    const useCase = makeUseCase();
    const mockAsset1 = mockBoundaryAsset("asset1");
    expect(() => useCase.addManyAssets([mockAsset1, mockAsset1])).toThrowError(
      DuplicateAssetID
    );
    expect(useCase.getAllAssets()).toHaveLength(0);
  });

  test("Adding many assets with a duplicate ID should throw an error even when additive", () => {
    const useCase = makeUseCase();
    const mockAsset1 = mockBoundaryAsset("asset1");
    const mockAsset2 = mockBoundaryAsset("asset2");
    useCase.addAsset(mockAsset1);

    expect(() => useCase.addManyAssets([mockAsset1, mockAsset2])).toThrowError(
      DuplicateAssetID
    );
    expect(useCase.getAllAssets()).toHaveLength(1); // Note this is because we had an asset already added
  });

  test("Getting assets by type", () => {
    const useCase = makeUseCase();
    const mockAsset1 = mockBoundaryAsset("asset1");
    const mockAsset2 = mockBoundaryAsset("asset2");
    const mockAsset3 = mockBoundaryAsset("asset3");

    mockAsset1.type = "IMAGE";
    mockAsset2.type = "IMAGE";
    mockAsset3.type = "GLB";
    useCase.addManyAssets([mockAsset1, mockAsset2, mockAsset3]);

    expect(useCase.getAssetsByType("GLB")).toHaveLength(1);
    expect(useCase.getAssetsByType("IMAGE")).toHaveLength(2);
  });

  test("Geting assets by type and tags", () => {
    const useCase = makeUseCase();
    const mockAsset1 = mockBoundaryAsset("asset1");
    const mockAsset2 = mockBoundaryAsset("asset2");
    const mockAsset3 = mockBoundaryAsset("asset3");

    mockAsset1.type = "IMAGE";
    mockAsset1.tags = ["tag 1", "tag 2"];

    mockAsset2.type = "IMAGE";
    mockAsset2.tags = ["tag 2"];

    mockAsset3.type = "GLB";
    mockAsset3.tags = ["tag 2"];

    useCase.addManyAssets([mockAsset1, mockAsset2, mockAsset3]);

    expect(useCase.getAssetsByType("IMAGE", ["tag 2"])).toHaveLength(2);
    expect(useCase.getAssetsByType("IMAGE", ["tag 1"])).toHaveLength(1);
  });

  test("Get latest asset file", () => {
    const useCase = makeUseCase();
    const mockAsset1 = mockBoundaryAsset("asset1");
    mockAsset1.files = [
      mockBoundaryAssetFile(1),
      mockBoundaryAssetFile(2),
      mockBoundaryAssetFile(3),
    ];

    useCase.addAsset(mockAsset1);

    const version = useCase.getLatestVersionNumber("asset1");
    expect(version).toEqual(3);
  });

  test("Getting the latest asset for an unknown Asset ID should throw an error", () => {
    const useCase = makeUseCase();
    expect(() => useCase.getLatestVersionNumber("some id")).toThrowError(
      InvalidAssetID
    );
  });

  test("Get latest asset file default to only published", () => {
    const useCase = makeUseCase();
    const mockAsset1 = mockBoundaryAsset("asset1");
    mockAsset1.files = [
      mockBoundaryAssetFile(1),
      mockBoundaryAssetFile(2, "DRAFT"),
      mockBoundaryAssetFile(3, "DRAFT"),
    ];

    useCase.addAsset(mockAsset1);

    const version = useCase.getLatestVersionNumber("asset1");
    expect(version).toEqual(1);
  });

  test("Getting the latest draft file", () => {
    const useCase = makeUseCase();
    const mockAsset1 = mockBoundaryAsset("asset1");
    mockAsset1.files = [
      mockBoundaryAssetFile(1),
      mockBoundaryAssetFile(2, "DRAFT"),
      mockBoundaryAssetFile(3, "DRAFT"),
    ];

    useCase.addAsset(mockAsset1);

    const version = useCase.getLatestVersionNumber("asset1", true);
    expect(version).toEqual(3);
  });

  test("Load the latest file", async () => {
    const useCase = makeUseCase();
    const mockAsset1 = mockBoundaryAsset("asset1");
    mockAsset1.files = [
      mockBoundaryAssetFile(1, "DRAFT"),
      mockBoundaryAssetFile(2, "PUBLISHED"),
      mockBoundaryAssetFile(3, "DRAFT"),
    ];
    useCase.addAsset(mockAsset1);

    expect(useCase.isFileLoaded("asset1")).toEqual(false);

    await useCase.loadFile("asset1");

    expect(useCase.isFileLoaded("asset1")).toEqual(true);
  });

  test("Loading latest file of an unknown id should throw an error", () => {
    const useCase = makeUseCase();
    return expect(useCase.loadFile("weird id")).rejects.toThrowError(
      InvalidAssetID
    );
  });

  test("Asking if a file is loaded for a unknown id should throw an error", () => {
    const useCase = makeUseCase();
    return expect(() => useCase.isFileLoaded("weird id")).toThrowError(
      InvalidAssetID
    );
  });

  test("Asking if a specific file version is loaded and the version is invalid should throw an error", () => {
    const useCase = makeUseCase();
    const mockAsset1 = mockBoundaryAsset("asset1");
    mockAsset1.files = [mockBoundaryAssetFile(1), mockBoundaryAssetFile(2)];
    useCase.addAsset(mockAsset1);

    return expect(() => useCase.isFileLoaded("asset1", 3)).toThrowError(
      AppFileVersionError
    );
  });

  test("Load a specific version", async () => {
    const useCase = makeUseCase();
    const mockAsset1 = mockBoundaryAsset("asset1");
    mockAsset1.files = [mockBoundaryAssetFile(1), mockBoundaryAssetFile(2)];
    useCase.addAsset(mockAsset1);

    expect(useCase.isFileLoaded("asset1", 1)).toEqual(false);
    expect(useCase.isFileLoaded("asset1", 2)).toEqual(false);

    await useCase.loadFile("asset1", 1);

    expect(useCase.isFileLoaded("asset1", 1)).toEqual(true);
    expect(useCase.isFileLoaded("asset1", 2)).toEqual(false);
  });

  test("Load a specific version should throw an error if the version is invalid", async () => {
    const useCase = makeUseCase();
    const mockAsset1 = mockBoundaryAsset("asset1");
    mockAsset1.files = [mockBoundaryAssetFile(1), mockBoundaryAssetFile(2)];
    useCase.addAsset(mockAsset1);

    return expect(useCase.loadFile("asset1", 3)).rejects.toThrowError(
      AppFileVersionError
    );
  });

  test("Get latest Blob URL", () => {
    const useCase = makeUseCase();
    const mockAsset1 = mockBoundaryAsset("asset1");
    const file1 = mockBoundaryAssetFile(1);
    file1.blobUrl = "blob1_url";
    const file2 = mockBoundaryAssetFile(2);
    file2.blobUrl = "blob2_url";
    mockAsset1.files = [file1, file2];
    useCase.addAsset(mockAsset1);

    const blob = useCase.getFileBlobURL("asset1");
    expect(blob).toEqual("blob2_url");
  });

  test("Get a blob url for a specific version", () => {
    const useCase = makeUseCase();
    const mockAsset1 = mockBoundaryAsset("asset1");
    const file1 = mockBoundaryAssetFile(1);
    file1.blobUrl = "blob1_url";
    const file2 = mockBoundaryAssetFile(2);
    file2.blobUrl = "blob2_url";
    mockAsset1.files = [file1, file2];
    useCase.addAsset(mockAsset1);

    const blob = useCase.getFileBlobURL("asset1", 1);
    expect(blob).toEqual("blob1_url");
  });

  test("Getting the blob url for a bad id should throw an error", () => {
    const useCase = makeUseCase();
    return expect(() => useCase.getFileBlobURL("weird id")).toThrowError(
      InvalidAssetID
    );
  });

  test("Getting the blob url for an asset file that has not been loaded should throw an error", () => {
    const useCase = makeUseCase();
    const mockAsset1 = mockBoundaryAsset("asset1");
    mockAsset1.files = [mockBoundaryAssetFile(1)];
    useCase.addAsset(mockAsset1);

    return expect(() => useCase.getFileBlobURL("asset1")).toThrowError(
      AssetHasNotBeenLoadedError
    );
  });

  test("Getting the blob url for an invalid version number should throw an error", () => {
    const useCase = makeUseCase();
    const mockAsset1 = mockBoundaryAsset("asset1");
    mockAsset1.files = [mockBoundaryAssetFile(1), mockBoundaryAssetFile(2)];
    useCase.addAsset(mockAsset1);

    return expect(useCase.loadFile("asset1", 3)).rejects.toThrowError(
      AppFileVersionError
    );
  });

  test("Requesting load file should just return the existing blob url if it already exists", async () => {
    const useCase = makeUseCase();
    const mockAsset1 = mockBoundaryAsset("asset1");
    const file = mockBoundaryAssetFile(1);
    file.blobUrl = "existing_blob_url";
    mockAsset1.files = [file];
    useCase.addAsset(mockAsset1);

    await useCase.loadFile("asset1", 1);

    const blob = useCase.getFileBlobURL("asset1", 1);
    expect(blob).toEqual("existing_blob_url");
  });

  test("Releasing all blobs", async () => {
    const useCase = makeUseCase();
    const mockAsset1 = mockBoundaryAsset("asset1");
    mockAsset1.files = [mockBoundaryAssetFile(1), mockBoundaryAssetFile(2)];
    const mockAsset2 = mockBoundaryAsset("asset2");
    mockAsset2.files = [mockBoundaryAssetFile(1), mockBoundaryAssetFile(2)];
    useCase.addAsset(mockAsset1);
    useCase.addAsset(mockAsset2);

    await useCase.loadFile("asset1", 1);
    await useCase.loadFile("asset1");
    await useCase.loadFile("asset2");

    expect(useCase.isFileLoaded("asset1", 1)).toEqual(true);
    expect(useCase.isFileLoaded("asset1", 2)).toEqual(true);
    expect(useCase.isFileLoaded("asset2", 1)).toEqual(false);
    expect(useCase.isFileLoaded("asset2", 2)).toEqual(true);

    useCase.releaseAllBlobs();

    expect(useCase.isFileLoaded("asset1", 1)).toEqual(false);
    expect(useCase.isFileLoaded("asset1", 2)).toEqual(false);
    expect(useCase.isFileLoaded("asset2", 1)).toEqual(false);
    expect(useCase.isFileLoaded("asset2", 2)).toEqual(false);
  });
});
