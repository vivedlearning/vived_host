import { makeAppObjectRepo } from "@vived/core";
import { Color } from "@vived/core";
import { makeHostThemeEntity, ThemeColorType } from "../Entities";
import { getSurfaceContainerColor } from "./getSurfaceContainerColor";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const theme = makeHostThemeEntity(appObjects.getOrCreate("theme"));
  const mockColor = Color.Hex("123456");
  const getColorMock = jest.fn().mockReturnValue(mockColor);
  theme.getColorForType = getColorMock;
  return { getColorMock, appObjects, mockColor, theme };
}

describe("Get Surface Container Color", () => {
  it("Queries the entity for the correct color type", () => {
    const { getColorMock, appObjects } = makeTestRig();

    getSurfaceContainerColor(appObjects);

    expect(getColorMock).toBeCalledWith(ThemeColorType.surfaceContainer);
  });

  it("Returns the color", () => {
    const { mockColor, appObjects } = makeTestRig();

    const c = getSurfaceContainerColor(appObjects);

    expect(c).toEqual(mockColor);
  });

  it("Warns if it cannot find the Theme Colors Entity", () => {
    const appObjects = makeAppObjectRepo();
    appObjects.submitError = jest.fn();
    appObjects.submitWarning = jest.fn();

    getSurfaceContainerColor(appObjects);
    expect(appObjects.submitError).toBeCalled();
  });
});
