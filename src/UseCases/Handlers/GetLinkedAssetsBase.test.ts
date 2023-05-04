
import { makeHostHandler } from "../../Entities";
import { GetLinkedAssetsBase } from "./GetLinkedAssetsBase";

function makeTestRig() {
  const hostHandler = makeHostHandler();
  const getLinkedAssetsBase = new GetLinkedAssetsBase(hostHandler);
  return { hostHandler, getLinkedAssetsBase };
}

describe("Get linked assets Base Handler", () => {
  it("Registers as a handler when constructed", () => {
    const hostHandler = makeHostHandler();
    hostHandler.registerRequestHandler = jest.fn();
    const getLinkedAssetsBase = new GetLinkedAssetsBase(hostHandler);
    expect(hostHandler.registerRequestHandler).toBeCalledWith(getLinkedAssetsBase);
  });

  it("Throws an error if the action is not overwritten", () => {
    const { getLinkedAssetsBase } = makeTestRig();

    expect(() => getLinkedAssetsBase.action("anAsset", "type", jest.fn())).toThrowError();
  });

  it("Triggers the action for v1", () => {
    const { getLinkedAssetsBase } = makeTestRig();
    getLinkedAssetsBase.action = jest.fn();

    const mockCallback = jest.fn();
    const payload = {
      assetID: "anAsset",
      type: "linkType",
      callback: mockCallback,
    };
    getLinkedAssetsBase.handleRequest(1, payload);

    expect(getLinkedAssetsBase.action).toBeCalledWith("anAsset", "linkType", mockCallback);
  });

  it("Throws for an unsupported version", () => {
    const { getLinkedAssetsBase } = makeTestRig();

    const mockCallback = jest.fn();
    const payload = {
      assetID: "anAsset",
      type: "linkType",
      callback: mockCallback,
    };

    expect(()=>getLinkedAssetsBase.handleRequest(-1, payload)).toThrowError();
  });

  it("Throws if the payload is bungled", ()=>{
    const { getLinkedAssetsBase } = makeTestRig();
    getLinkedAssetsBase.action = jest.fn();

    const payload = {
      foo: "bar"
    };

    expect(()=>getLinkedAssetsBase.handleRequest(1, payload)).toThrowError();
  })
});
