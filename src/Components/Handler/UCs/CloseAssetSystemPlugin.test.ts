import { makeAppObjectRepo } from "@vived/core";
import { makeAssetPluginEntity } from "../../AssetPlugin/Entities";
import { makeDialogQueue } from "../../Dialog/Entities";
import {
  MockDispatchDisposeAppUC,
  MockDispatchStopAppUC
} from "../../Dispatcher/Mocks";
import { makeHostHandlerEntity } from "../Entities";
import { makeCloseAssetSystemPluginUC } from "./CloseAssetSystemPlugin";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();

  const dialog = makeDialogQueue(appObjects.getOrCreate("Dialog"));
  const ao = appObjects.getOrCreate("AO");
  const assetPlugin = makeAssetPluginEntity(ao);
  const handler = makeHostHandlerEntity(ao);
  const mockDispose = new MockDispatchDisposeAppUC(ao);
  const mockStop = new MockDispatchStopAppUC(ao);

  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const uc = makeCloseAssetSystemPluginUC(ao);

  return {
    dialog,
    assetPlugin,
    handler,
    mockDispose,
    mockStop,
    registerSpy,
    uc
  };
}

describe("Close Plugin handler", () => {
  it("Registers as a handler when constructed", () => {
    const { registerSpy, uc } = makeTestRig();

    expect(registerSpy).toBeCalledWith(uc);
  });

  it("Triggers the action for v1", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    uc.handleRequest(1);

    expect(uc.action).toBeCalled();
  });

  it("Throws for an unsupported version", () => {
    const { uc } = makeTestRig();

    expect(() => uc.handleRequest(-1)).toThrowError();
  });

  it("Closes the active dialog when the action is triggered", () => {
    const { uc, dialog } = makeTestRig();

    dialog.activeDialogHasClosed = jest.fn();

    uc.action();

    expect(dialog.activeDialogHasClosed).toBeCalled();
  });

  it("Closes the app when the action is triggered", () => {
    const { uc, mockStop } = makeTestRig();

    uc.action();

    expect(mockStop.doDispatch).toBeCalled();
  });

  it("Disposes the app when the action is triggered", () => {
    const { uc, mockDispose } = makeTestRig();

    uc.action();

    expect(mockDispose.doDispatch).toBeCalled();
  });

  it("Hides the plugin when the action is triggered", () => {
    const { uc, assetPlugin } = makeTestRig();

    assetPlugin.show = true;

    uc.action();

    expect(assetPlugin.show).toEqual(false);
  });
});
