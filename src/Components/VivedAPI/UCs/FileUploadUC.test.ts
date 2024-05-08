import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { VivedAPIEntity } from "../Entities/VivedAPIEntity";
import { makeMockBasicFetchUC } from "../Mocks/MockBasicFetchUC";
import { makeMockJsonRequestUC } from "../Mocks/MockJsonRequestUC";
import { BasicFetchOptions } from "./BasicFetchUC";
import { FileUploadUC, makeFileUploadUC } from "./FileUploadUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const singletonSpy = jest.spyOn(appObjects, "registerSingleton");

  new VivedAPIEntity(appObjects.getOrCreate("API"));
  const mockRequstJSON = makeMockJsonRequestUC(appObjects);

  mockRequstJSON.doRequest.mockResolvedValue("https://www.someuploadurl.com");

  const mockBasicFetch = makeMockBasicFetchUC(appObjects);
  mockBasicFetch.doRequest.mockResolvedValue(undefined);

  const uc = makeFileUploadUC(appObjects.getOrCreate("ao"));

  return { uc, appObjects, singletonSpy, mockRequstJSON, mockBasicFetch };
}

describe("JSON Requester", () => {
  it("Registers itself as the Singleton", () => {
    const { uc, singletonSpy } = makeTestRig();

    expect(singletonSpy).toBeCalledWith(uc);
  });

  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(FileUploadUC.get(appObjects)).toEqual(uc);
  });

  it("Calls request json with the expected URL", async () => {
    const { uc, mockRequstJSON } = makeTestRig();

    const mockFile = new File([], "file.name");
    await uc.doUpload(mockFile);

    const url = mockRequstJSON.doRequest.mock.calls[0][0] as URL;

    expect(url.toString()).toEqual(
      "https://api.vivedlearning.com/upload/large/DataVariants/file.name"
    );
  });

  it("Rejects if the request json rejects", () => {
    const { uc, mockRequstJSON } = makeTestRig();

    uc.warn = jest.fn();
    mockRequstJSON.doRequest.mockRejectedValue(new Error("Some Error"));
    const mockFile = new File([], "file.name");

    return expect(uc.doUpload(mockFile)).rejects.toEqual(
      new Error("Some Error")
    );
  });

  it("Calls the basic fetch with the expected URL", async () => {
    const { uc, mockBasicFetch } = makeTestRig();

    const mockFile = new File([], "file.name");
    await uc.doUpload(mockFile);

    const url = mockBasicFetch.doRequest.mock.calls[0][0] as URL;

    expect(url.toString()).toEqual("https://www.someuploadurl.com/");
  });

  it("Calls the basic fetch with the expected options", async () => {
    const { uc, mockBasicFetch } = makeTestRig();

    const mockFile = new File([], "file.name");
    await uc.doUpload(mockFile);

    const options = mockBasicFetch.doRequest.mock
      .calls[0][1] as BasicFetchOptions;

    expect(options.method).toEqual("PUT");
    expect(options.body).toEqual(mockFile);
  });

  it("Rejects if the request basic fetch rejects", () => {
    const { uc, mockBasicFetch } = makeTestRig();

    uc.warn = jest.fn();
    mockBasicFetch.doRequest.mockRejectedValue(new Error("Some Error"));
    const mockFile = new File([], "file.name");

    return expect(uc.doUpload(mockFile)).rejects.toEqual(
      new Error("Some Error")
    );
  });
});
