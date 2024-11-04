import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { Version, VersionStage } from "../../../ValueObjects";
import { MockAppMounterUC } from "../../Apps";
import { makeAppSandboxEntity } from "../../AppSandbox/Entities/AppSandboxEntity";
import {
  MockDispatchStartBrowseChannelsUC,
  MockDispatchStopAppUC
} from "../../Dispatcher/Mocks";
import { VivedAPIEntity } from "../../VivedAPI/Entities/VivedAPIEntity";
import { makeAssetPluginEntity } from "../Entities";
import { AssetPluginContainerUC } from "./AssetPluginContainerUC";
import { makeSandboxAssetPluginContainerUC } from "./SandboxAssetPluginContainerUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const sandbox = makeAppSandboxEntity(appObjects.getOrCreate("Sandbox"));

  const api = new VivedAPIEntity(appObjects.getOrCreate("API"));

  const ao = appObjects.getOrCreate("Plugin");
  const uc = makeSandboxAssetPluginContainerUC(ao);

  const assetPlugin = makeAssetPluginEntity(
    appObjects.getOrCreate("AssetPlugin")
  );
  const mockStop = new MockDispatchStopAppUC(ao);
  const mockMounter = new MockAppMounterUC(ao);
  const mockStart = new MockDispatchStartBrowseChannelsUC(ao);

  mockMounter.mount.mockResolvedValue(undefined);

  return {
    appObjects,
    uc,
    ao,
    registerSingletonSpy,
    assetPlugin,
    mockStop,
    mockStart,
    mockMounter,
    sandbox,
    api
  };
}

describe("Asset Plugin Container UC", () => {
  it("Gets the singleton", () => {
    const { appObjects, uc } = makeTestRig();

    expect(AssetPluginContainerUC.get(appObjects)).toEqual(uc);
  });

  it("Registers as a singleton", () => {
    const { registerSingletonSpy, uc } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(uc);
  });

  it("Sets the container on the entity", () => {
    const { uc, assetPlugin } = makeTestRig();

    expect(assetPlugin.container).toBeUndefined();

    const container = document.createElement("div");
    uc.setContainer(container);

    expect(assetPlugin.container).toEqual(container);
  });

  it("Initializes the App", () => {
    const { uc, mockMounter } = makeTestRig();

    const container = document.createElement("div");
    uc.setContainer(container);

    expect(mockMounter.mount).toBeCalled();
  });

  it("Starts the App", async () => {
    const { uc, mockStart } = makeTestRig();

    const container = document.createElement("div");
    await uc.setContainer(container);

    expect(mockStart.doDispatch).toBeCalled();
  });

  it("Clears the container on the entity", () => {
    const { uc, assetPlugin } = makeTestRig();

    assetPlugin.app.mountedVersion = new Version(1, 2, 3, VersionStage.ALPHA);

    assetPlugin.container = document.createElement("div");
    uc.clearContainer();

    expect(assetPlugin.container).toBeUndefined();
  });

  it("Dispatches stop to the plugin", () => {
    const { uc, mockStop, assetPlugin } = makeTestRig();

    assetPlugin.app.mountedVersion = new Version(1, 2, 3, VersionStage.ALPHA);

    uc.clearContainer();

    expect(mockStop.doDispatch).toBeCalled();
  });
});
