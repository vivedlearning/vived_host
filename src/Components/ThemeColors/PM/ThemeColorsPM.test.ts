import { makeAppObjectRepo } from "@vived/core";
import { defaultScheme, makeHostThemeEntity } from "../Entities";
import {
  makeThemeColorsPM,
  ThemeColorsPM,
  ThemeColorsVM
} from "./ThemeColorsPM";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");
  const themeColors = makeHostThemeEntity(appObjects.getOrCreate("Theme"));

  const pm = makeThemeColorsPM(themeColors.appObject);

  return { themeColors, pm, registerSingletonSpy, appObjects };
}

describe("Theme Color Map PM", () => {
  it("Initializes the view", () => {
    const { pm } = makeTestRig();

    expect(pm.lastVM).not.toBeUndefined();
  });

  it("Registers as the singleton", () => {
    const { registerSingletonSpy, pm } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(pm);
  });

  it("Gets the singleton", () => {
    const { appObjects, pm } = makeTestRig();

    expect(ThemeColorsPM.get(appObjects)).toEqual(pm);
  });

  it("Checks for equal scheme names", () => {
    const { pm } = makeTestRig();

    const vm1: ThemeColorsVM = {
      themeName: "name1",
      scheme: defaultScheme
    };

    const vm2 = { ...vm1 };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(true);
  });

  it("Checks for a change in the scheme names", () => {
    const { pm } = makeTestRig();

    const vm1: ThemeColorsVM = {
      themeName: "name1",
      scheme: defaultScheme
    };

    const vm2 = { ...vm1, themeName: "CHANGED" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });
});
