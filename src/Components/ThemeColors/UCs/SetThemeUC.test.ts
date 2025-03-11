import { makeAppObjectRepo } from "@vived/core";
import { defaultScheme, makeHostThemeEntity } from "../Entities";
import { makeSetThemeUC, SetThemeUC } from "./SetThemeUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const theme = makeHostThemeEntity(appObjects.getOrCreate("theme"));
  const uc = makeSetThemeUC(appObjects.getOrCreate("theme"));

  return { theme, uc, appObjects, registerSingletonSpy };
}

describe("Set Theme UC", () => {
  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(SetThemeUC.get(appObjects)).toEqual(uc);
  });

  it("Registers the singleton", () => {
    const { uc, registerSingletonSpy } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(uc);
  });

  it("Sets the theme by name", () => {
    const { uc, theme } = makeTestRig();

    theme.warn = jest.fn(); // Avoids the warn because we have not setup the scheme
    const spy = jest.spyOn(theme, "activeSchemeName", "set");

    uc.setThemeByName("aTheme");

    expect(spy).toBeCalledWith("aTheme");
  });
});
