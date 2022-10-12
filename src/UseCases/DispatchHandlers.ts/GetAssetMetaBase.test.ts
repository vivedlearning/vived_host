
import { makeHostHandler } from "../../Entities";
import { GetAssetMetaBase } from "./GetAssetMetaBase";

function makeTestRig() {
  const hostHandler = makeHostHandler();
  const getAssetMetaBase = new GetAssetMetaBase(hostHandler);
  return { hostHandler, getAssetMetaBase };
}

describe("Get Asset Meta Base Handler", () => {
  it("Registers as a handler when constructed", () => {
    const hostHandler = makeHostHandler();
    hostHandler.registerRequestHandler = jest.fn();
    const getAssetMetaBase = new GetAssetMetaBase(hostHandler);
    expect(hostHandler.registerRequestHandler).toBeCalledWith(getAssetMetaBase);
  });

  it("Throws an error if the action is not overwritten", () => {
    const { getAssetMetaBase } = makeTestRig();

    expect(() => getAssetMetaBase.action("anAsset", jest.fn())).toThrowError();
  });

  it("Triggers the action for v1", () => {
    const { getAssetMetaBase } = makeTestRig();
    getAssetMetaBase.action = jest.fn();

    const mockCallback = jest.fn();
    const payload = {
      assetID: "anAsset",
      callback: mockCallback,
    };
    getAssetMetaBase.handleRequest(1, payload);

    expect(getAssetMetaBase.action).toBeCalledWith("anAsset", mockCallback);
  });

  it("Throws for an unsupported version", () => {
    const { getAssetMetaBase } = makeTestRig();

    const mockCallback = jest.fn();
    const payload = {
      assetID: "anAsset",
      callback: mockCallback,
    };

    expect(()=>getAssetMetaBase.handleRequest(-1, payload)).toThrowError();
  });

  it("Throws if the payload is bungled", ()=>{
    const { getAssetMetaBase } = makeTestRig();
    getAssetMetaBase.action = jest.fn();

    const payload = {
      foo: "bar"
    };

    expect(()=>getAssetMetaBase.handleRequest(1, payload)).toThrowError();
  })
});
