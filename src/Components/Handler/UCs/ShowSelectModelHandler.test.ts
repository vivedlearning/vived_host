import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeAssetPluginEntity } from "../../AssetPlugin";
import {
  makeDialogQueue,
  makeMockMakeSelectModelDialogUC,
  makeSelectModelFactory,
  SelectModelDialogEntity
} from "../../Dialog";
import { makeHostHandlerEntity } from "../Entities";
import { makeShowSelectModelHandler } from "./ShowSelectModelHandler";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");

  const assetPlugin = makeAssetPluginEntity(appObjects.getOrCreate("Assets"));
  const mockMakeSelectModel = makeMockMakeSelectModelDialogUC(appObjects);

  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const uc = makeShowSelectModelHandler(ao);
  const callback = jest.fn();
  return {
    registerSpy,
    uc,
    callback,
    mockMakeSelectModel,
    assetPlugin
  };
}

describe("Show Select Model Handler", () => {
  it("Registers as a handler when constructed", () => {
    const { registerSpy, uc } = makeTestRig();
    expect(registerSpy).toBeCalledWith(uc);
  });

  it("Converts the payload into the DTO for the action", () => {
    const { uc, callback } = makeTestRig();
    uc.action = jest.fn();

    const payload = {
      callback
    };
    uc.handleRequest(1, payload);

    expect(uc.action).toBeCalledWith(callback);
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

  it("Stores the callback", () => {
    const { uc, callback, assetPlugin } = makeTestRig();

    uc.action(callback);

    expect(assetPlugin.callback).toEqual(callback);
  });

  it("Sets the plugin to shown", () => {
    const { uc, callback, assetPlugin } = makeTestRig();

    expect(assetPlugin.show).toEqual(false);

    uc.action(callback);

    expect(assetPlugin.show).toEqual(true);
  });

  it("Makes a dialog", () => {
    const { uc, callback, mockMakeSelectModel } = makeTestRig();

    uc.action(callback);

    expect(mockMakeSelectModel.make).toBeCalled();
  });
});
