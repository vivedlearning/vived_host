import { makeAppObjectRepo } from "@vived/core";
import { makeAssetEntity } from "./AssetEntity";
import { AssetDTO, AssetRepo, makeAssetRepo } from "./AssetRepo";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const repoAO = appObjects.getOrCreate("AssetRepo");
  const singletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const assetRepo = makeAssetRepo(repoAO);
  const observer = jest.fn();
  assetRepo.addChangeObserver(observer);

  assetRepo.assetFactory = (id: string) => {
    return makeAssetEntity(appObjects.getOrCreate(id));
  };

  return { assetRepo, appObjects, singletonSpy, observer };
}

describe("Asset Repository", () => {
  it("Registers itself as the Singleton", () => {
    const { assetRepo, singletonSpy } = makeTestRig();

    expect(singletonSpy).toBeCalledWith(assetRepo);
  });

  it("Gets the singleton", () => {
    const { assetRepo, appObjects } = makeTestRig();

    expect(AssetRepo.get(appObjects)).toEqual(assetRepo);
  });

  it("Adds an asset", () => {
    const { assetRepo } = makeTestRig();

    expect(assetRepo.getAll()).toHaveLength(0);

    const newAsset = assetRepo.assetFactory("asset1");

    assetRepo.add(newAsset);
    expect(assetRepo.getAll()).toHaveLength(1);
  });

  it("Creates an asset if it does not exist", () => {
    const { assetRepo } = makeTestRig();

    expect(assetRepo.getAll()).toHaveLength(0);

    assetRepo.getOrCreate("asset1");
    expect(assetRepo.getAll()).toHaveLength(1);
  });

  it("Gets an asset", () => {
    const { assetRepo } = makeTestRig();

    const asset = assetRepo.getOrCreate("asset1");

    expect(assetRepo.get("asset1")).toEqual(asset);
    expect(assetRepo.get("somethingElse")).toEqual(undefined);
  });

  it("Checks for an asset", () => {
    const { assetRepo } = makeTestRig();

    assetRepo.getOrCreate("asset1");

    expect(assetRepo.has("asset1")).toEqual(true);
    expect(assetRepo.has("somethingElse")).toEqual(false);
  });

  it("Only creates the asset if it does not exist", () => {
    const { assetRepo } = makeTestRig();

    assetRepo.getOrCreate("asset1");
    assetRepo.getOrCreate("asset1");
    assetRepo.getOrCreate("asset1");
    assetRepo.getOrCreate("asset1");

    expect(assetRepo.getAll()).toHaveLength(1);
  });

  it("Notifies when the asset is created", () => {
    const { assetRepo, observer } = makeTestRig();

    assetRepo.getOrCreate("asset1");
    assetRepo.getOrCreate("asset1");
    assetRepo.getOrCreate("asset1");
    assetRepo.getOrCreate("asset1");

    expect(observer).toBeCalledTimes(1);
  });

  it("Only adds new assets", () => {
    const { assetRepo } = makeTestRig();

    expect(assetRepo.getAll()).toHaveLength(0);

    const newAsset = assetRepo.assetFactory("asset1");

    assetRepo.add(newAsset);
    assetRepo.add(newAsset);
    assetRepo.add(newAsset);

    expect(assetRepo.getAll()).toHaveLength(1);
  });

  it("Only notifies when a new asset is added", () => {
    const { assetRepo, observer } = makeTestRig();

    const newAsset = assetRepo.assetFactory("asset1");

    assetRepo.add(newAsset);
    assetRepo.add(newAsset);
    assetRepo.add(newAsset);

    expect(observer).toBeCalledTimes(1);
  });

  it("Removes an asset", () => {
    const { assetRepo } = makeTestRig();

    assetRepo.getOrCreate("asset1");
    expect(assetRepo.getAll()).toHaveLength(1);
    expect(assetRepo.has("asset1")).toEqual(true);

    assetRepo.remove("asset1");

    expect(assetRepo.getAll()).toHaveLength(0);
    expect(assetRepo.has("asset1")).toEqual(false);
  });

  it("Notifies when an asset is removed", () => {
    const { assetRepo, observer } = makeTestRig();

    assetRepo.getOrCreate("asset1");
    observer.mockClear();

    assetRepo.remove("asset1");
    assetRepo.remove("asset1");
    assetRepo.remove("asset1");
    assetRepo.remove("asset1");

    expect(observer).toBeCalledTimes(1);
  });

  it("Forms up the base asset from data as expected", async () => {
    const { assetRepo } = makeTestRig();

    const dto = makeBaseDTO();
    const returnedAsset = assetRepo.addFromDTO(dto);

    expect(returnedAsset.id).toEqual("baseAsset");
    expect(returnedAsset.name).toEqual("baseAsset Name");
    expect(returnedAsset.description).toEqual("baseAsset Description");
    expect(returnedAsset.archived).toEqual(false);
    expect(returnedAsset.filename).toEqual("baseAsset_file.name");
    expect(returnedAsset?.fileURL).toEqual("www.baseAsset.com");
    expect(returnedAsset.owner).toEqual("baseAsset Owner");
  });

  it("Adds the asset from data to the repo", async () => {
    const { assetRepo } = makeTestRig();

    expect(assetRepo.has("baseAsset")).toEqual(false);

    const dto = makeBaseDTO();
    assetRepo.addFromDTO(dto);

    expect(assetRepo.has("baseAsset")).toEqual(true);
  });

  it("Adds up the linked asset from data to the repo", async () => {
    const { assetRepo } = makeTestRig();

    expect(assetRepo.has("linkedAsset")).toEqual(false);

    const dto = makeBaseDTO();
    assetRepo.addFromDTO(dto);

    expect(assetRepo.has("linkedAsset")).toEqual(true);
  });

  it("Sets up the linked asset from the data", async () => {
    const { assetRepo } = makeTestRig();

    const dto = makeBaseDTO();
    assetRepo.addFromDTO(dto);

    const linkedAsset = assetRepo.get("linkedAsset");
    expect(linkedAsset?.id).toEqual("linkedAsset");
    expect(linkedAsset?.name).toEqual("linkedAsset Name");
    expect(linkedAsset?.description).toEqual("linkedAsset Description");
    expect(linkedAsset?.archived).toEqual(true);
    expect(linkedAsset?.filename).toEqual("linkedAsset_file.name");
    expect(linkedAsset?.fileURL).toEqual("www.linkedAsset.com");
    expect(linkedAsset?.owner).toEqual("linkedAsset Owner");
  });

  it("Adds the link to the base asset", async () => {
    const { assetRepo } = makeTestRig();

    const dto = makeBaseDTO();
    const asset = assetRepo.addFromDTO(dto);

    expect(asset.getLinkedAssetByType("someLinkType")).toEqual(["linkedAsset"]);
  });
});

function makeBaseDTO(): AssetDTO {
  const baseAsset = makeDTO("baseAsset");
  const linkedAsset = makeDTO("linkedAsset");

  linkedAsset.archived = true;

  (baseAsset.linkedAssets as any) = [
    { type: "someLinkType", asset: linkedAsset }
  ];

  return baseAsset;
}

function makeDTO(id: string): AssetDTO {
  return {
    id,
    ownerId: `${id} Owner`,
    name: `${id} Name`,
    description: `${id} Description`,
    archived: false,
    filename: `${id}_file.name`,
    fileURL: `www.${id}.com`,
    linkedAssets: []
  };
}
