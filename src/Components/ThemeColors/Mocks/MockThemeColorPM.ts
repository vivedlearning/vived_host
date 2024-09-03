import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { ThemeColorsPM, ThemeColorsVM } from "../PM";

export class MockThemeColorPM extends ThemeColorsPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, ThemeColorsPM.type);
  }
}

export function makeMockThemeColorPM(appObjects: HostAppObjectRepo) {
  return new MockThemeColorPM(appObjects.getOrCreate("MockThemeColorPM"));
}
