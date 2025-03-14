import { VivedAPIEntity } from "../Entities/VivedAPIEntity";
import { makeMockJsonRequestUC } from "../Mocks/MockJsonRequestUC";
import { makeMockSignedAuthTokenUC } from "../Mocks/MockSignedAuthToken";
import { RequestJSONOptions } from "./JsonRequestUC";
import {
  makeGetAssetsForOwnerFromAPIUC,
  GetAssetsForOwnerFromAPIUC
} from "./GetAssetsForOwnerFromAPIUC";
import { makeHostAppObjectRepo } from "../../../HostAppObject";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const singletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const vivedAPI = new VivedAPIEntity(appObjects.getOrCreate("API"));

  const mockJsonRequester = makeMockJsonRequestUC(appObjects);
  mockJsonRequester.doRequest.mockResolvedValue(makeMockResp());

  const mockAuth = makeMockSignedAuthTokenUC(appObjects);
  mockAuth.getAuthToken.mockResolvedValue("mockAuthToken");

  const uc = makeGetAssetsForOwnerFromAPIUC(appObjects.getOrCreate("ao"));

  return {
    uc,
    appObjects,
    singletonSpy,
    vivedAPI,
    mockJsonRequester,
    mockAuth
  };
}

describe("Get Assets for Owner UC", () => {
  it("Registers itself as the Singleton", () => {
    const { uc, singletonSpy } = makeTestRig();

    expect(singletonSpy).toBeCalledWith(uc);
  });

  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(GetAssetsForOwnerFromAPIUC.get(appObjects)).toEqual(uc);
  });

  it("Resolves", async () => {
    const { uc } = makeTestRig();

    const assets = await uc.getAssets("owner");

    expect(assets).toHaveLength(2);
  });

  it("Forms the DTO as expected", async () => {
    const { uc } = makeTestRig();

    const assets = await uc.getAssets("owner");

    const asset1 = assets[0];

    expect(asset1.id).toEqual("asset1");
    expect(asset1.ownerId).toEqual("asset1 Owner");
    expect(asset1.archived).toEqual(false);
    expect(asset1.description).toEqual("asset1 Description");
    expect(asset1.fileURL).toEqual("www.asset1.com");
    expect(asset1.filename).toEqual("asset1_file.name");

    expect(asset1.linkedAssets).toHaveLength(2);

    expect(asset1.linkedAssets[0].type).toEqual("someLinkType");
    expect(asset1.linkedAssets[0].asset.id).toEqual("linkedAsset1");
  });

  it("Warns and rejects if the JSON Request rejects", () => {
    const { uc, mockJsonRequester } = makeTestRig();

    mockJsonRequester.doRequest.mockRejectedValue(new Error("Some JSON Error"));

    return expect(uc.getAssets("owner")).rejects.toEqual(
      new Error("Some JSON Error")
    );
  });

  it("Requests the JSON with the expected url", async () => {
    const { uc, mockJsonRequester } = makeTestRig();

    await uc.getAssets("owner");

    const postURL = mockJsonRequester.doRequest.mock.calls[0][0] as URL;
    expect(postURL.toString()).toEqual(
      "https://api.vivedlearning.com/assets/group/owner?page=1&itemsPerPage=100"
    );
  });

  it("Requests the JSON with the expected options", async () => {
    const { uc, mockJsonRequester } = makeTestRig();

    await uc.getAssets("owner");

    const postURL = mockJsonRequester.doRequest.mock
      .calls[0][1] as RequestJSONOptions;
    expect(postURL.method).toEqual("GET");
  });

  it("Rejects if the get auth token fails", () => {
    const { uc, mockAuth } = makeTestRig();

    mockAuth.getAuthToken.mockRejectedValue(
      new Error("Some Auth token error Error")
    );

    return expect(uc.getAssets("owner")).rejects.toEqual(
      new Error("Some Auth token error Error")
    );
  });
});

function makeMockResp() {
  const asset1 = makeBaseAssetResp("asset1");
  const asset2 = makeBaseAssetResp("asset2");

  (asset1.linkedAssets as any) = [
    { type: "someLinkType", asset: makeBaseAssetResp("linkedAsset1") },
    { type: "someOtherLink", asset: makeBaseAssetResp("linkedAsset2") }
  ];

  return { assets: [asset1, asset2] };
}

function makeBaseAssetResp(id: string) {
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
