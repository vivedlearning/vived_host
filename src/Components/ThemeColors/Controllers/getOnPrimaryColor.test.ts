import { makeAppObjectRepo } from "@vived/core";
import { Color } from "@vived/core";
import { makeHostThemeEntity, ThemeColorType } from "../Entities";
import { getOnPrimaryColor } from "./getOnPrimaryColor";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const theme = makeHostThemeEntity(appObjects.getOrCreate("theme"));
  const mockColor = Color.Hex("123456");
  const getColorMock = jest.fn().mockReturnValue(mockColor);
  theme.getColorForType = getColorMock;
  return { getColorMock, appObjects, mockColor, theme };
}

describe("Get On Primary Color", () => {
  it("Queries the entity for the correct color type", () => {
    const { getColorMock, appObjects } = makeTestRig();

    getOnPrimaryColor(appObjects);

    expect(getColorMock).toBeCalledWith(ThemeColorType.onPrimary);
  });

  it("Returns the color", () => {
    const { mockColor, appObjects } = makeTestRig();

    const c = getOnPrimaryColor(appObjects);

    expect(c).toEqual(mockColor);
  });

  it("Warns if it cannot find the Theme Colors Entity", () => {
    const appObjects = makeAppObjectRepo();
    appObjects.submitError = jest.fn();
    appObjects.submitWarning = jest.fn();

    getOnPrimaryColor(appObjects);
    expect(appObjects.submitError).toBeCalled();
  });
});
