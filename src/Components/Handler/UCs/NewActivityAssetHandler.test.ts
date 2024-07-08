import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeHostHandlerEntity } from "../Entities";
import { makeNewActivityAssetAction } from "./NewActivityAssetHandler";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const uc = makeNewActivityAssetAction(ao);
  return { registerSpy, uc };
}

describe("New Activity Asset Handler", () => {
  it("Registers as a handler when constructed", () => {
    const { registerSpy, uc } = makeTestRig();
    expect(registerSpy).toBeCalledWith(uc);
  });

  it("Throws an error if the action is not overwritten", () => {
    const { uc } = makeTestRig();

    const mockFile = new File([], "file.name");

    expect(() => uc.action(mockFile, jest.fn())).toThrowError();
  });

  it("Triggers the action for v1", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const mockFile = new File([], "file.name");

    const mockCallback = jest.fn();
    const payload = {
      file: mockFile,
      callback: mockCallback
    };
    uc.handleRequest(1, payload);

    expect(uc.action).toBeCalledWith(mockFile, mockCallback);
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
});
