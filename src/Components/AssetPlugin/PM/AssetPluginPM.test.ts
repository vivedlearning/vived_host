import { makeAppObjectRepo } from "@vived/core";
import { AppState } from "../../Apps";
import { makeAssetPluginEntity } from "../Entities/AssetPluginEntity";
import {
  AssetPluginPM,
  AssetPluginVM,
  makeAssetPluginPM
} from "./AssetPluginPM";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const ao = appObjects.getOrCreate("Plugin");
  const plugin = makeAssetPluginEntity(ao);

  const pm = makeAssetPluginPM(ao);

  return { pm, plugin, registerSingletonSpy, appObjects };
}

describe("Asset Plugin PM", () => {
  it("Initializes the VM", () => {
    const { pm } = makeTestRig();

    expect(pm.lastVM).not.toBeUndefined();
  });

  it("Registers as the singleton", () => {
    const { registerSingletonSpy, pm } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(pm);
  });

  it("Gets the singleton", () => {
    const { appObjects, pm } = makeTestRig();

    expect(AssetPluginPM.get(appObjects)).toEqual(pm);
  });

  it("Checks for equal PMs", () => {
    const { pm } = makeTestRig();

    const vm1: AssetPluginVM = {
      loading: true,
      show: true,
      styleSheets: ["sheet1", "sheet2"]
    };

    const vm2 = { ...vm1 };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(true);
  });

  it("Checks for a change in loading", () => {
    const { pm } = makeTestRig();

    const vm1: AssetPluginVM = {
      loading: true,
      show: true,
      styleSheets: ["sheet1", "sheet2"]
    };

    const vm2 = { ...vm1, loading: false };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in show", () => {
    const { pm } = makeTestRig();

    const vm1: AssetPluginVM = {
      loading: true,
      show: true,
      styleSheets: ["sheet1", "sheet2"]
    };

    const vm2 = { ...vm1, show: false };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in styles", () => {
    const { pm } = makeTestRig();

    const vm1: AssetPluginVM = {
      loading: true,
      show: true,
      styleSheets: ["sheet1", "sheet2"]
    };

    const vm2 = { ...vm1, styleSheets: ["sheet1", "CHANGED"] };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for style to be added", () => {
    const { pm } = makeTestRig();

    const vm1: AssetPluginVM = {
      loading: true,
      show: true,
      styleSheets: ["sheet1", "sheet2"]
    };

    const vm2 = { ...vm1, styleSheets: ["sheet1", "sheet2", "NEW"] };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for style to be removed", () => {
    const { pm } = makeTestRig();

    const vm1: AssetPluginVM = {
      loading: true,
      show: true,
      styleSheets: ["sheet1", "sheet2"]
    };

    const vm2 = { ...vm1, styleSheets: ["sheet1"] };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Updates the show property when the entity changes", () => {
    const { pm, plugin } = makeTestRig();

    plugin.show = true;
    expect(pm.lastVM?.show).toEqual(true);

    plugin.show = false;
    expect(pm.lastVM?.show).toEqual(false);
  });

  it("Sets loading when the app is set to init and showing", () => {
    const { pm, plugin } = makeTestRig();

    plugin.app!.state = AppState.INIT;
    plugin.show = true;

    expect(pm.lastVM?.loading).toEqual(true);

    plugin.show = false;

    expect(pm.lastVM?.loading).toEqual(false);
  });

  it("Sets loading when the app is set to loading and showing", () => {
    const { pm, plugin } = makeTestRig();

    plugin.app!.state = AppState.LOADING;
    plugin.show = true;

    expect(pm.lastVM?.loading).toEqual(true);

    plugin.show = false;

    expect(pm.lastVM?.loading).toEqual(false);
  });

  it("Sets loading to false when the app has an error", () => {
    const { pm, plugin } = makeTestRig();

    plugin.app!.state = AppState.ERROR;
    plugin.show = true;

    expect(pm.lastVM?.loading).toEqual(false);
  });

  it("Sets loading to false when the app is ready", () => {
    const { pm, plugin } = makeTestRig();

    plugin.app!.state = AppState.READY;
    plugin.show = true;

    expect(pm.lastVM?.loading).toEqual(false);
  });
});
