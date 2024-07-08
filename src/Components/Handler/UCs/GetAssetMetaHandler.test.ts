import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeAssetEntity, makeMockGetAssetUC } from "../../Assets";
import { makeHostHandlerEntity } from "../Entities";
import { CallbackAssetMeta } from "./CallbackAssetDTO";
import { makeGetAssetMetaHandler } from "./GetAssetMetaHandler";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const mockGetAsset = makeMockGetAssetUC(appObjects);
  const mockAsset = makeAssetEntity(appObjects.getOrCreate("asset1"));
  mockAsset.name = "A Name";
  mockAsset.description = "A Description";
  mockGetAsset.getAsset.mockResolvedValue(mockAsset);

  const uc = makeGetAssetMetaHandler(ao);
  return { registerSpy, uc, mockGetAsset, mockAsset, appObjects };
}

describe("Get Asset Meta Base Handler", () => {
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

  it("Calls back with undefined if the get asset rejects", (done) => {
    const { mockGetAsset, appObjects, uc } = makeTestRig();

    appObjects.submitError = jest.fn();
    mockGetAsset.getAsset.mockRejectedValue(new Error("Some Error"));

    function callback(meta: CallbackAssetMeta | undefined) {
      try {
        expect(meta).toBeUndefined();
        done();
      } catch (e) {
        done(e);
      }
    }

    uc.action("asset1", callback);
  });

  it("Logs an error if the get asset rejects", (done) => {
    const { uc, appObjects, mockGetAsset } = makeTestRig();

    mockGetAsset.getAsset.mockRejectedValue(new Error("Some Error"));
    appObjects.submitError = jest.fn();

    function callback(meta: CallbackAssetMeta | undefined) {
      try {
        expect(appObjects.submitError).toBeCalled();
        done();
      } catch (e) {
        done(e);
      }
    }

    uc.action("asset1", callback);
  });

  it("Calls back with the meta", (done) => {
    const { uc, mockAsset } = makeTestRig();

    function callback(meta: CallbackAssetMeta | undefined) {
      try {
        expect(meta?.id).toEqual(mockAsset.id);
        expect(meta?.name).toEqual(mockAsset.name);
        expect(meta?.description).toEqual(mockAsset.description);
        done();
      } catch (e) {
        done(e);
      }
    }

    uc.action(mockAsset.id, callback);
  });
});
