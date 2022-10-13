import { makeHostHandler } from "../../Entities";
import { GetAssetFolderURLBase } from "./GetAssetFolderURLBase";

function makeTestRig() {
  const hostHandler = makeHostHandler();
  const getAssetFolderURLBase = new GetAssetFolderURLBase(hostHandler);
  return { hostHandler, getAssetFolderURLBase };
}

describe("Get Asset Meta Base Handler", () => {
  it("Registers as a handler when constructed", () => {
    const hostHandler = makeHostHandler();
    hostHandler.registerRequestHandler = jest.fn();
    const getAssetFolderURLBase = new GetAssetFolderURLBase(hostHandler);
    expect(hostHandler.registerRequestHandler).toBeCalledWith(getAssetFolderURLBase);
  });

  it("Throws an error if the action is not overwritten", () => {
    const { getAssetFolderURLBase } = makeTestRig();

    expect(() => getAssetFolderURLBase.action(jest.fn())).toThrowError();
  });

  it("Triggers the action for v1", () => {
    const { getAssetFolderURLBase } = makeTestRig();
    getAssetFolderURLBase.action = jest.fn();

    const mockCallback = jest.fn();
    const payload = {
      callback: mockCallback,
    };
    getAssetFolderURLBase.handleRequest(1, payload);

    expect(getAssetFolderURLBase.action).toBeCalledWith(mockCallback);
  });

  it("Throws for an unsupported version", () => {
    const { getAssetFolderURLBase } = makeTestRig();

    const mockCallback = jest.fn();
    const payload = {
      callback: mockCallback,
    };

    expect(()=>getAssetFolderURLBase.handleRequest(-1, payload)).toThrowError();
  });

  it("Throws if the payload is bungled", ()=>{
    const { getAssetFolderURLBase } = makeTestRig();
    getAssetFolderURLBase.action = jest.fn();

    const payload = {
      foo: "bar"
    };

    expect(()=>getAssetFolderURLBase.handleRequest(1, payload)).toThrowError();
  })
});
