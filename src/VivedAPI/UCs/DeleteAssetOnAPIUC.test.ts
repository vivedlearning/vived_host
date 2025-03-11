import { VivedAPIEntity } from "../Entities/VivedAPIEntity";
import { makeMockJsonRequestUC } from "../Mocks/MockJsonRequestUC";
import { makeMockSignedAuthTokenUC } from "../Mocks/MockSignedAuthToken";
import { RequestJSONOptions } from "./JsonRequestUC";
import {
  makeDeleteAssetOnAPIUC,
  DeleteAssetOnAPIUC
} from "./DeleteAssetOnAPIUC";
import { makeAppObjectRepo } from "@vived/core";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const singletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const vivedAPI = new VivedAPIEntity(appObjects.getOrCreate("API"));

  const mockJsonRequester = makeMockJsonRequestUC(appObjects);
  mockJsonRequester.doRequest.mockResolvedValue({});

  const mockAuth = makeMockSignedAuthTokenUC(appObjects);
  mockAuth.getUserAuthToken.mockResolvedValue("mockAuthToken");

  const uc = makeDeleteAssetOnAPIUC(appObjects.getOrCreate("ao"));

  return {
    uc,
    appObjects,
    singletonSpy,
    vivedAPI,
    mockJsonRequester,
    mockAuth
  };
}

describe("Patch Asset Is Archived UC", () => {
  it("Registers itself as the Singleton", () => {
    const { uc, singletonSpy } = makeTestRig();

    expect(singletonSpy).toBeCalledWith(uc);
  });

  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(DeleteAssetOnAPIUC.get(appObjects)).toEqual(uc);
  });

  it("Resolves", async () => {
    const { uc } = makeTestRig();

    return expect(uc.doDelete("asset1")).resolves.toEqual(undefined);
  });

  it("Warns and rejects if the JSON Request rejects", () => {
    const { uc, mockJsonRequester } = makeTestRig();

    mockJsonRequester.doRequest.mockRejectedValue(new Error("Some JSON Error"));

    return expect(uc.doDelete("asset1")).rejects.toEqual(
      new Error("Some JSON Error")
    );
  });

  it("Requests the JSON with the expected url", async () => {
    const { uc, mockJsonRequester } = makeTestRig();

    await uc.doDelete("asset1");

    const postURL = mockJsonRequester.doRequest.mock.calls[0][0] as URL;
    expect(postURL.toString()).toEqual(
      "https://api.vivedlearning.com/assets/asset1"
    );
  });

  it("Requests the JSON with the expected options", async () => {
    const { uc, mockJsonRequester } = makeTestRig();

    await uc.doDelete("asset1");

    const postURL = mockJsonRequester.doRequest.mock
      .calls[0][1] as RequestJSONOptions;
    expect(postURL.method).toEqual("DELETE");
    expect(postURL.headers).toEqual({
      Authorization: "Bearer mockAuthToken"
    });
  });

  it("Rejects if the get auth token fails", () => {
    const { uc, mockAuth } = makeTestRig();

    mockAuth.getUserAuthToken.mockRejectedValue(
      new Error("Some Auth token error Error")
    );

    return expect(uc.doDelete("asset1")).rejects.toEqual(
      new Error("Some Auth token error Error")
    );
  });
});
