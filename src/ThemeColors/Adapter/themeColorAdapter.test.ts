import { makeAppObjectRepo } from "@vived/core";
import { themeColorAdapter } from "./themeColorAdapter";
import { makeMockThemeColorPM } from "../Mocks/MockThemeColorPM";
import { defaultThemeColorsVM } from "../PM";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const mockPM = makeMockThemeColorPM(appObjects);
  return { appObjects, mockPM };
}

describe("Theme Color Hook Adapter", () => {
  it("Sets the Default VM", () => {
    expect(themeColorAdapter.defaultVM).toEqual(defaultThemeColorsVM);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    themeColorAdapter.subscribe(appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    themeColorAdapter.unsubscribe(appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
