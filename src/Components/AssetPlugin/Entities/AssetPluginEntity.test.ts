import { makeAppObjectRepo } from "@vived/core";
import { AssetPluginEntity, makeAssetPluginEntity } from "./AssetPluginEntity";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const ao = appObjects.getOrCreate("Plugin");
  const assetSystemPlugin = makeAssetPluginEntity(ao);
  const observer = jest.fn();
  assetSystemPlugin.addChangeObserver(observer);

  return {
    assetSystemPlugin,
    observer,
    appObjects,
    registerSingletonSpy
  };
}

describe("Asset Plugin", () => {
  it("Updates when the slide app updates", () => {
    const { observer, assetSystemPlugin } = makeTestRig();
    observer.mockClear();
    assetSystemPlugin.app?.notifyOnChange();
    expect(observer).toBeCalled();
  });

  it("Notifies when is show is set to true", () => {
    const { assetSystemPlugin, observer } = makeTestRig();

    expect(assetSystemPlugin.show).toEqual(false);

    assetSystemPlugin.show = true;

    expect(assetSystemPlugin.show).toEqual(true);
    expect(observer).toBeCalled();
    observer.mockClear();

    assetSystemPlugin.show = false;

    expect(assetSystemPlugin.show).toEqual(false);
    expect(observer).toBeCalled();
  });

  it("Does not notify if there isn't a change to showApp", () => {
    const { assetSystemPlugin, observer } = makeTestRig();

    expect(assetSystemPlugin.show).toEqual(false);

    assetSystemPlugin.show = false;
    assetSystemPlugin.show = false;
    assetSystemPlugin.show = false;

    expect(observer).not.toBeCalled();
  });

  it("Gets the singleton", () => {
    const { appObjects, assetSystemPlugin } = makeTestRig();

    expect(AssetPluginEntity.get(appObjects)).toEqual(assetSystemPlugin);
  });

  it("Registers the singleton", () => {
    const { assetSystemPlugin, registerSingletonSpy } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(assetSystemPlugin);
  });
});
