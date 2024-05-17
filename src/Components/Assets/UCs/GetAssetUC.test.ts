import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockFetchAssetMetaFromAPIUC } from "../../VivedAPI";
import { makeAssetEntity } from "../Entities/AssetEntity";
import { AssetDTO, makeAssetRepo } from "../Entities/AssetRepo";
import { GetAssetUC, makeGetAssetUC } from "./GetAssetUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const singletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const assetRepo = makeAssetRepo(appObjects.getOrCreate("AssetRepo"));
  const uc = makeGetAssetUC(appObjects.getOrCreate("AssetRepo"));

  const mockResp = makeMockResp();
  const mockFetchMeta = makeMockFetchAssetMetaFromAPIUC(appObjects);
  mockFetchMeta.doFetch.mockResolvedValue(mockResp);

  const existingAsset = makeAssetEntity(appObjects.getOrCreate("asset1"));
  assetRepo.add(existingAsset);

  assetRepo.assetFactory = (id: string) => {
    return makeAssetEntity(appObjects.getOrCreate(id));
  };

  return {
    appObjects,
    uc,
    existingAsset,
    assetRepo,
    singletonSpy,
    mockFetchMeta,
    mockResp
  };
}

describe("Get Asset UC", () => {
  it("Registers itself as the Singleton", () => {
    const { uc, singletonSpy } = makeTestRig();

    expect(singletonSpy).toBeCalledWith(uc);
  });

  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(GetAssetUC.get(appObjects)).toEqual(uc);
  });

  it("Returns the asset if it already exists in the repo", async () => {
    const { existingAsset, uc, mockFetchMeta } = makeTestRig();

    const returnedAsset = await uc.getAsset(existingAsset.id);

    expect(returnedAsset).toEqual(existingAsset);
    expect(mockFetchMeta.doFetch).not.toBeCalled();
  });

  it("Rejects if the fetch rejects", async () => {
    const { uc, mockFetchMeta } = makeTestRig();

    uc.warn = jest.fn();
    mockFetchMeta.doFetch.mockRejectedValue(new Error("Some Error"));

    return expect(uc.getAsset("asset")).rejects.toEqual(
      new Error("Some Error")
    );
  });

  it("Warns  if the fetch rejects", async () => {
    const { uc, mockFetchMeta } = makeTestRig();

    uc.warn = jest.fn();
    mockFetchMeta.doFetch.mockRejectedValue(new Error("Some Error"));

    expect.assertions(1);
    try {
      await uc.getAsset("asset");
    } catch {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(uc.warn).toBeCalled();
    }
  });

  it("Fetches an asset if it does not exist", async () => {
    const { uc, mockFetchMeta } = makeTestRig();

    await uc.getAsset("asset");

    expect(mockFetchMeta.doFetch).toBeCalledWith("asset");
  });

  it("Sends the data to the Asset Repo", async () => {
    const { uc, assetRepo, mockResp } = makeTestRig();

    const spy = jest.spyOn(assetRepo, "addFromDTO");

    await uc.getAsset("asset");

    expect(spy).toBeCalledWith(mockResp);
  });
});

function makeMockResp(): AssetDTO {
  const baseAsset = makeBaseAssetResp("baseAsset");
  const linkedAsset = makeBaseAssetResp("linkedAsset");

  linkedAsset.archived = true;

  (baseAsset.linkedAssets as any) = [
    { type: "someLinkType", asset: linkedAsset }
  ];

  return baseAsset;
}

function makeBaseAssetResp(id: string): AssetDTO {
  return {
    id,
    ownerId: `${id} Owner`,
    name: `${id} Name`,
    description: `${id} Description`,
    archived: false,
    fileURL: `www.${id}.com`,
    filename: `${id}_file.name`,
    linkedAssets: []
  };
}
