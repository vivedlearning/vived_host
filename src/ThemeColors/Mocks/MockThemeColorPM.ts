import { AppObject, AppObjectRepo } from "@vived/core";
import { ThemeColorsPM, ThemeColorsVM } from "../PM";

export class MockThemeColorPM extends ThemeColorsPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, ThemeColorsPM.type);
  }
}

export function makeMockThemeColorPM(appObjects: AppObjectRepo) {
  return new MockThemeColorPM(appObjects.getOrCreate("MockThemeColorPM"));
}
