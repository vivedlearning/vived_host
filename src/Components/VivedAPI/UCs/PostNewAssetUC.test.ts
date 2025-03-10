import { makeAppObjectRepo } from "@vived/core";
import { VivedAPIEntity } from "../Entities/VivedAPIEntity";
import { makeMockFileUploadUC } from "../Mocks/MockFileUpload";
import { makeMockJsonRequestUC } from "../Mocks/MockJsonRequestUC";
import { makeMockSignedAuthTokenUC } from "../Mocks/MockSignedAuthToken";
import { RequestJSONOptions } from "./JsonRequestUC";
import {
  makePostNewAssetUC,
  NewAssetDTO,
  PostNewAssetUC
} from "./PostNewAssetUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const singletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const vivedAPI = new VivedAPIEntity(appObjects.getOrCreate("API"));

  const mockJsonRequester = makeMockJsonRequestUC(appObjects);
  mockJsonRequester.doRequest.mockResolvedValue({ assetId: "newAssetID" });

  const mockUpload = makeMockFileUploadUC(appObjects);
  mockUpload.doUpload.mockResolvedValue(undefined);

  const mockAuth = makeMockSignedAuthTokenUC(appObjects);
  mockAuth.getUserAuthToken.mockResolvedValue("mockAuthToken");

  const uc = makePostNewAssetUC(appObjects.getOrCreate("ao"));

  return {
    uc,
    appObjects,
    singletonSpy,
    vivedAPI,
    mockJsonRequester,
    mockUpload,
    mockAuth
  };
}

describe("JSON Requester", () => {
  it("Registers itself as the Singleton", () => {
    const { uc, singletonSpy } = makeTestRig();

    expect(singletonSpy).toBeCalledWith(uc);
  });

  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(PostNewAssetUC.get(appObjects)).toEqual(uc);
  });

  it("Resolves with the new Asset ID and filename", async () => {
    const { uc } = makeTestRig();

    const dto: NewAssetDTO = {
      description: "some desc",
      file: new File([], "file.name"),
      name: "some name",
      ownerID: "someOwner"
    };

    const resp = await uc.doPost(dto);

    expect(resp.id).toEqual("newAssetID");
    expect(resp.filename).not.toEqual("file.name");
    expect(resp.filename).toContain(".name");
  });

  it("Warns and rejects if the JSON Request rejects", () => {
    const { uc, mockJsonRequester } = makeTestRig();

    mockJsonRequester.doRequest.mockRejectedValue(new Error("Some JSON Error"));

    const dto: NewAssetDTO = {
      description: "some desc",
      file: new File([], "filename"),
      name: "some name",
      ownerID: "someOwner"
    };

    return expect(uc.doPost(dto)).rejects.toEqual(new Error("Some JSON Error"));
  });

  it("Requests the JSON with the expected url", async () => {
    const { uc, mockJsonRequester } = makeTestRig();

    const dto: NewAssetDTO = {
      description: "some desc",
      file: new File([], "filename"),
      name: "some name",
      ownerID: "someOwner"
    };

    await uc.doPost(dto);

    const postURL = mockJsonRequester.doRequest.mock.calls[0][0] as URL;
    expect(postURL.toString()).toEqual("https://api.vivedlearning.com/assets");
  });

  it("Requests the JSON with the expected options", async () => {
    const { uc, mockJsonRequester } = makeTestRig();

    const dto: NewAssetDTO = {
      description: "some desc",
      file: new File([], "filename.file"),
      name: "some name",
      ownerID: "someOwner"
    };

    await uc.doPost(dto);

    const postURL = mockJsonRequester.doRequest.mock
      .calls[0][1] as RequestJSONOptions;
    expect(postURL.method).toEqual("POST");
    expect(postURL.headers).toEqual({
      Authorization: "Bearer mockAuthToken"
    });

    const body = JSON.parse(postURL.body) as any;
    expect(body.ownerId).toEqual("someOwner");
    expect(body.name).toEqual("some name");
    expect(body.description).toEqual("some desc");
    expect(body.filename).toContain(".file");
  });

  it("Rejects if the get auth token fails", () => {
    const { uc, mockAuth } = makeTestRig();

    const dto: NewAssetDTO = {
      description: "some desc",
      file: new File([], "filename.file"),
      name: "some name",
      ownerID: "someOwner"
    };
    mockAuth.getUserAuthToken.mockRejectedValue(
      new Error("Some Auth token error Error")
    );

    return expect(uc.doPost(dto)).rejects.toEqual(
      new Error("Some Auth token error Error")
    );
  });

  it("Rejects if the upload fails", () => {
    const { uc, mockUpload } = makeTestRig();

    const dto: NewAssetDTO = {
      description: "some desc",
      file: new File([], "filename.file"),
      name: "some name",
      ownerID: "someOwner"
    };
    mockUpload.doUpload.mockRejectedValue(new Error("Some upload Error"));

    return expect(uc.doPost(dto)).rejects.toEqual(
      new Error("Some upload Error")
    );
  });
});
