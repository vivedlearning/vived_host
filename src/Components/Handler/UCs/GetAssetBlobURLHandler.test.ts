import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockGetAssetBlobURLUC } from "../../Assets";
import { makeHostHandlerEntity } from "../Entities";
import { makeGetAssetBlobURLHandler } from "./GetAssetBlobURLHandler";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const mockGetBlob = makeMockGetAssetBlobURLUC(appObjects);
  mockGetBlob.getAssetBlobURL.mockResolvedValue("www.asset1blob.com");

  const uc = makeGetAssetBlobURLHandler(ao);
  return { handler, uc, registerSpy, appObjects, mockGetBlob };
}

describe("Get Asset Blob URL Handler", () => {
  it("Registers as a handler when constructed", () => {
    const { registerSpy, uc } = makeTestRig();
    expect(registerSpy).toBeCalledWith(uc);
  });

  it("Triggers the action for v1", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const mockCallback = jest.fn();
    const payload = {
      assetID: "anAsset",
      callback: mockCallback
    };
    uc.handleRequest(1, payload);

    expect(uc.action).toBeCalledWith("anAsset", mockCallback);
  });

  it("Throws for an unsupported version", () => {
    const { uc } = makeTestRig();

    const mockCallback = jest.fn();
    const payload = {
      assetID: "anAsset",
      callback: mockCallback
    };

    expect(() => uc.handleRequest(-1, payload)).toThrowError();
  });

  it("Throws if the payload is bungled", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const payload = {
      foo: "bar"
    };

    expect(() => uc.handleRequest(1, payload)).toThrowError();
  });

  it("Calls back with undefined if the get blob rejects", (done) => {
    const { uc, mockGetBlob, appObjects } = makeTestRig();

    appObjects.submitError = jest.fn();
    mockGetBlob.getAssetBlobURL.mockRejectedValue(new Error("Some Error"));

    function callback(blobURL: string | undefined) {
      try {
        expect(blobURL).toBeUndefined();
        done();
      } catch (e) {
        done(e);
      }
    }

    uc.action("asset1", callback);
  });

  it("Logs an error if the get blob rejects", (done) => {
    const { uc, mockGetBlob, appObjects } = makeTestRig();

    appObjects.submitError = jest.fn();
    mockGetBlob.getAssetBlobURL.mockRejectedValue(new Error("Some Error"));

    function callback(blobURL: string | undefined) {
      try {
        expect(appObjects.submitError).toBeCalled();
        done();
      } catch (e) {
        done(e);
      }
    }

    uc.action("asset1", callback);
  });

  it("Calls back with the blob url", (done) => {
    const { uc } = makeTestRig();

    function callback(blobURL: string | undefined) {
      try {
        expect(blobURL).toEqual("www.asset1blob.com");
        done();
      } catch (e) {
        done(e);
      }
    }

    uc.action("asset1", callback);
  });
});
