import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeAssetRepo, makeGetAssetUC } from "../../Assets";
import { makeMockFetchAssetMetaFromAPIUC } from "../../VivedAPI";
import { makeHostHandlerEntity } from "../Entities";
import { CallbackAssetMeta } from "./CallbackAssetDTO";
import { makeGetLinkedAssetsHandler } from "./GetLinkedAssetsHandler";
import { makeAssetEntity } from "../../Assets/Entities";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const assetRepo = makeAssetRepo(appObjects.getOrCreate("AssetRepo"));
  const getAssetUC = makeGetAssetUC(appObjects.getOrCreate("AssetRepo"));
  makeMockFetchAssetMetaFromAPIUC(appObjects);

  const baseAsset = makeAssetEntity(appObjects.getOrCreate("asset1"));

  const linkedAsset1 = makeAssetEntity(appObjects.getOrCreate("linkedAsset1"));
  linkedAsset1.name = "Linked 1";
  linkedAsset1.description = "Linked 1 Description";

  const linkedAsset2 = makeAssetEntity(appObjects.getOrCreate("linkedAsset2"));
  linkedAsset2.name = "Linked 2";
  linkedAsset2.description = "Linked 2 Description";

  const someOtherLinkedAsset = makeAssetEntity(
    appObjects.getOrCreate("somethingElse")
  );
  someOtherLinkedAsset.name = "Linked 3";
  someOtherLinkedAsset.description = "Linked 3 Description";

  baseAsset.addLinkedAsset("a_link_type", "linkedAsset1");
  baseAsset.addLinkedAsset("a_link_type", "linkedAsset2");
  baseAsset.addLinkedAsset("someOtherLink", "somethingElse");

  assetRepo.add(baseAsset);
  assetRepo.add(linkedAsset1);
  assetRepo.add(linkedAsset2);
  assetRepo.add(someOtherLinkedAsset);

  const uc = makeGetLinkedAssetsHandler(ao);
  return { registerSpy, uc, getAssetUC, appObjects };
}

describe("Get linked assets Base Handler", () => {
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
      type: "linkType",
      callback: mockCallback
    };
    uc.handleRequest(1, payload);

    expect(uc.action).toBeCalledWith("anAsset", "linkType", mockCallback);
  });

  it("Throws for an unsupported version", () => {
    const { uc } = makeTestRig();

    const mockCallback = jest.fn();
    const payload = {
      assetID: "anAsset",
      type: "linkType",
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
    const { uc, appObjects, getAssetUC } = makeTestRig();
    appObjects.submitError = jest.fn();

    getAssetUC.getAsset = jest.fn().mockRejectedValue(new Error("Some Error"));

    function callback(linkedAssets: CallbackAssetMeta[] | undefined) {
      try {
        expect(linkedAssets).toBeUndefined();
        done();
      } catch (e) {
        done(e);
      }
    }

    uc.action("asset1", "a_link_type", callback);
  });

  it("Logs an error if the get asset rejects", (done) => {
    const { uc, appObjects, getAssetUC } = makeTestRig();

    getAssetUC.getAsset = jest.fn().mockRejectedValue(new Error("Some Error"));

    appObjects.submitError = jest.fn();
    function callback(linkedAssets: CallbackAssetMeta[] | undefined) {
      try {
        expect(appObjects.submitError).toBeCalled();
        done();
      } catch (e) {
        done(e);
      }
    }

    uc.action("asset1", "a_link_type", callback);
  });

  it("Calls back with the linked assets", (done) => {
    const { uc } = makeTestRig();

    expect.assertions(1);
    function callback(linkedAssets: CallbackAssetMeta[] | undefined) {
      try {
        expect(linkedAssets).toEqual([
          {
            description: "Linked 1 Description",
            id: "linkedAsset1",
            name: "Linked 1"
          },
          {
            description: "Linked 2 Description",
            id: "linkedAsset2",
            name: "Linked 2"
          }
        ]);
        done();
      } catch (e) {
        done(e);
      }
    }

    uc.action("asset1", "a_link_type", callback);
  });
});
