import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { VivedAPIEntity } from "../Entities/VivedAPIEntity";
import { makeMockJsonRequestUC } from "../Mocks/MockJsonRequestUC";
import { makeMockSignedAuthTokenUC } from "../Mocks/MockSignedAuthToken";
import { RequestJSONOptions } from "./JsonRequestUC";
import {
  makePatchAssetMetaUC,
  PatchAssetMetaDTO,
  PatchAssetMetaUC
} from "./PatchAssetMetaUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const singletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const vivedAPI = new VivedAPIEntity(appObjects.getOrCreate("API"));

  const mockJsonRequester = makeMockJsonRequestUC(appObjects);
  mockJsonRequester.doRequest.mockResolvedValue({});

  const mockAuth = makeMockSignedAuthTokenUC(appObjects);
  mockAuth.getAuthToken.mockResolvedValue("mockAuthToken");

  const uc = makePatchAssetMetaUC(appObjects.getOrCreate("ao"));

  return {
    uc,
    appObjects,
    singletonSpy,
    vivedAPI,
    mockJsonRequester,
    mockAuth
  };
}

function makeDTO(): PatchAssetMetaDTO {
  return {
    id: "asset1",
    archived: true,
    description: "Asset Description",
    name: "assetName"
  };
}

describe("Patch Asset Is Archived UC", () => {
  it("Registers itself as the Singleton", () => {
    const { uc, singletonSpy } = makeTestRig();

    expect(singletonSpy).toBeCalledWith(uc);
  });

  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(PatchAssetMetaUC.get(appObjects)).toEqual(uc);
  });

  it("Resolves", async () => {
    const { uc } = makeTestRig();

    return expect(uc.doPatch(makeDTO())).resolves.toEqual(undefined);
  });

  it("Warns and rejects if the JSON Request rejects", () => {
    const { uc, mockJsonRequester } = makeTestRig();

    mockJsonRequester.doRequest.mockRejectedValue(new Error("Some JSON Error"));

    return expect(uc.doPatch(makeDTO())).rejects.toEqual(
      new Error("Some JSON Error")
    );
  });

  it("Requests the JSON with the expected url", async () => {
    const { uc, mockJsonRequester } = makeTestRig();

    await uc.doPatch(makeDTO());

    const postURL = mockJsonRequester.doRequest.mock.calls[0][0] as URL;
    expect(postURL.toString()).toEqual(
      "https://api.vivedlearning.com/assets/asset1"
    );
  });

  it("Requests the JSON with the expected options", async () => {
    const { uc, mockJsonRequester } = makeTestRig();

    const data = makeDTO();
    await uc.doPatch(data);

    const postURL = mockJsonRequester.doRequest.mock
      .calls[0][1] as RequestJSONOptions;
    expect(postURL.method).toEqual("PATCH");
    expect(postURL.headers).toEqual({
      Authorization: "Bearer mockAuthToken"
    });

    const bodyObject = JSON.parse(postURL.body);
    expect(bodyObject.archived).toEqual(true);
    expect(bodyObject.description).toEqual(data.description);
    expect(bodyObject.name).toEqual(data.name);
  });

  it("Rejects if the get auth token fails", () => {
    const { uc, mockAuth } = makeTestRig();

    mockAuth.getAuthToken.mockRejectedValue(
      new Error("Some Auth token error Error")
    );

    return expect(uc.doPatch(makeDTO())).rejects.toEqual(
      new Error("Some Auth token error Error")
    );
  });
});
