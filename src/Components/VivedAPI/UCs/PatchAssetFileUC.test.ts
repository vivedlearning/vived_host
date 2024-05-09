import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { VivedAPIEntity } from "../Entities/VivedAPIEntity";
import { makeMockFileUploadUC } from "../Mocks/MockFileUpload";
import { makeMockJsonRequestUC } from "../Mocks/MockJsonRequestUC";
import { makeMockSignedAuthTokenUC } from "../Mocks/MockSignedAuthToken";
import { RequestJSONOptions } from "./JsonRequestUC";
import { makePatchAssetFileUC, PatchAssetFileUC } from "./PatchAssetFileUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const singletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const vivedAPI = new VivedAPIEntity(appObjects.getOrCreate("API"));

  const mockJsonRequester = makeMockJsonRequestUC(appObjects);
  mockJsonRequester.doRequest.mockResolvedValue({});

  const mockAuth = makeMockSignedAuthTokenUC(appObjects);
  mockAuth.getUserAuthToken.mockResolvedValue("mockAuthToken");

  const mockFileUpload = makeMockFileUploadUC(appObjects);

  const uc = makePatchAssetFileUC(appObjects.getOrCreate("ao"));

  return {
    uc,
    appObjects,
    singletonSpy,
    vivedAPI,
    mockJsonRequester,
    mockAuth,
    mockFileUpload
  };
}

describe("Patch Asset Is Archived UC", () => {
  it("Registers itself as the Singleton", () => {
    const { uc, singletonSpy } = makeTestRig();

    expect(singletonSpy).toBeCalledWith(uc);
  });

  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(PatchAssetFileUC.get(appObjects)).toEqual(uc);
  });

  it("Resolves with a new filename", async () => {
    const { uc } = makeTestRig();

    const filename = await uc.doPatch("asset1", new File([], "some.filename"));

    expect(filename).not.toEqual("some.filename");
    expect(filename).toContain(".filename");
  });

  it("Warns and rejects if the JSON Request rejects", () => {
    const { uc, mockJsonRequester } = makeTestRig();

    mockJsonRequester.doRequest.mockRejectedValue(new Error("Some JSON Error"));

    return expect(
      uc.doPatch("asset1", new File([], "some.filename"))
    ).rejects.toEqual(new Error("Some JSON Error"));
  });

  it("Requests the JSON with the expected url", async () => {
    const { uc, mockJsonRequester } = makeTestRig();

    await uc.doPatch("asset1", new File([], "some.filename"));

    const postURL = mockJsonRequester.doRequest.mock.calls[0][0] as URL;
    expect(postURL.toString()).toEqual(
      "https://api.vivedlearning.com/assets/asset1"
    );
  });

  it("Requests the JSON with the expected options", async () => {
    const { uc, mockJsonRequester } = makeTestRig();

    await uc.doPatch("asset1", new File([], "some.filename"));

    const postURL = mockJsonRequester.doRequest.mock
      .calls[0][1] as RequestJSONOptions;
    expect(postURL.method).toEqual("PATCH");
    expect(postURL.headers).toEqual({
      Authorization: "Bearer mockAuthToken"
    });
  });

  it("Rejects if the get auth token fails", () => {
    const { uc, mockAuth } = makeTestRig();

    mockAuth.getUserAuthToken.mockRejectedValue(
      new Error("Some Auth token error Error")
    );

    return expect(
      uc.doPatch("asset1", new File([], "some.filename"))
    ).rejects.toEqual(new Error("Some Auth token error Error"));
  });

  it("Rejects if the file upload fails", () => {
    const { uc, mockFileUpload } = makeTestRig();

    mockFileUpload.doUpload.mockRejectedValue(new Error("Some upload error"));

    return expect(
      uc.doPatch("asset1", new File([], "some.filename"))
    ).rejects.toEqual(new Error("Some upload error"));
  });

  it("Calls file upload as expected", async () => {
    const { uc, mockFileUpload } = makeTestRig();

    const file = new File([], "some.filename");
    await uc.doPatch("asset1", file);

    expect(mockFileUpload.doUpload).toBeCalledWith(file);
  });
});
