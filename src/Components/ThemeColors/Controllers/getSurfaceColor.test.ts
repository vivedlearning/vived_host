import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { Color } from "../../../ValueObjects";
import { makeHostThemeEntity, ThemeColorType } from "../Entities";
import { getSurfaceColor } from "./getSurfaceColor";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const theme = makeHostThemeEntity(appObjects.getOrCreate("theme"));
  const mockColor = Color.Hex("123456");
  const getColorMock = jest.fn().mockReturnValue(mockColor);
  theme.getColorForType = getColorMock;
  return { getColorMock, appObjects, mockColor, theme };
}

describe("Get On Surface Color", () => {
  it("Queries the entity for the correct color type", () => {
    const { getColorMock, appObjects } = makeTestRig();

    getSurfaceColor(appObjects);

    expect(getColorMock).toBeCalledWith(ThemeColorType.surface);
  });

  it("Returns the color", () => {
    const { mockColor, appObjects } = makeTestRig();

    const c = getSurfaceColor(appObjects);

    expect(c).toEqual(mockColor);
  });

  it("Warns if it cannot find the Theme Colors Entity", () => {
    const appObjects = makeHostAppObjectRepo();
    appObjects.submitError = jest.fn();
    appObjects.submitWarning = jest.fn();

    getSurfaceColor(appObjects);
    expect(appObjects.submitError).toBeCalled();
  });
});
