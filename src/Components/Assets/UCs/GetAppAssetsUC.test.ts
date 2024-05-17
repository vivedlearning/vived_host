
import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockGetAssetsForOwnerFromAPIUC } from "../../VivedAPI";
import { makeAppAssets } from "../Entities/AppAssetsEntity";
import { makeAssetEntity } from "../Entities/AssetEntity";
import { AssetDTO, makeAssetRepo } from "../Entities/AssetRepo";
import { makeGetAppAssetUC } from "./GetAppAssetsUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

  const appAssets = makeAppAssets(appObjects.getOrCreate("AppAsset"));
  const assetRepo = makeAssetRepo(appObjects.getOrCreate("AssetRepo"));
  const mockGetter = makeMockGetAssetsForOwnerFromAPIUC(appObjects);
  const getAppAssetsUC = makeGetAppAssetUC(appObjects.getOrCreate("AppAsset"));

  assetRepo.assetFactory = (id: string) => {
    return makeAssetEntity(appObjects.getOrCreate(id));
  };

  const mockResolveVal: AssetDTO[] = [
    {
      archived: true,
      description: "desc",
      fileURL: "some.url",
      filename: "some.filename",
      id: "assetID",
      linkedAssets: [],
      name: "Some Name",
      ownerId: "Some owner"
    }
  ];
  mockGetter.getAssets.mockResolvedValue(mockResolveVal);

  return {
    assetRepo,
    mockGetter,
    appAssets,
    appObjects,
    mockResolveVal,
    getAppAssetsUC
  };
}

describe("Get App Assets UC", () => {
  it("Adds the fetched assets to the app assets entity", async () => {
    const { assetRepo, mockResolveVal, getAppAssetsUC } = makeTestRig();

    assetRepo.addFromDTO = jest.fn();

    await getAppAssetsUC.getAppAssets("anOwner");

    expect(assetRepo.addFromDTO).toBeCalledWith(mockResolveVal[0]);
  });

  it("Sends the owner ID to the UC", async () => {
    const { mockGetter, getAppAssetsUC } = makeTestRig();

    await getAppAssetsUC.getAppAssets("anOwner");

    expect(mockGetter.getAssets).toBeCalledWith("anOwner");
  });

  it("Rejects if the getter uc rejects", () => {
    const { mockGetter, getAppAssetsUC } = makeTestRig();

    mockGetter.getAssets.mockRejectedValue(new Error("Some Error"));

    return expect(getAppAssetsUC.getAppAssets("anOwner")).rejects.toEqual(
      new Error("Some Error")
    );
  });
});
