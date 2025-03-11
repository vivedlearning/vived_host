import { makeAppObjectRepo } from "@vived/core";
import { Color } from "@vived/core";
import {
  ColorScheme,
  defaultScheme,
  HostThemeEntity,
  makeHostThemeEntity,
  ThemeColorType
} from "./HostThemeEntity";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const themeColorsAo = appObjects.getOrCreate("ThemeColors");
  const theme = makeHostThemeEntity(themeColorsAo);

  const observer = jest.fn();
  theme.addChangeObserver(observer);

  return { theme, observer, appObjects, registerSingletonSpy };
}

describe("Theme Colors Entity", () => {
  it("Gets the singleton", () => {
    const { appObjects, theme } = makeTestRig();

    expect(HostThemeEntity.get(appObjects)).toEqual(theme);
  });

  it("Registers as the singleton", () => {
    const { theme, registerSingletonSpy } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(theme);
  });

  it("Sets the active scheme to the first scheme that was applied", () => {
    const { theme } = makeTestRig();

    const scheme1 = { ...defaultScheme };
    const scheme2 = { ...defaultScheme };

    expect(theme.activeSchemeName).toEqual("");

    theme.submitScheme("scheme1", scheme1);
    theme.submitScheme("scheme2", scheme2);

    expect(theme.activeSchemeName).toEqual("scheme1");
  });

  it("Notifies when the scheme is set for the first time", () => {
    const { theme, observer } = makeTestRig();

    const scheme1 = { ...defaultScheme };
    const scheme2 = { ...defaultScheme };

    observer.mockClear();
    theme.submitScheme("scheme1", scheme1);
    theme.submitScheme("scheme2", scheme2);

    expect(observer).toBeCalledTimes(1);
  });

  it("Warns if a scheme with the same name is submitted again", () => {
    const { theme, appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    theme.submitScheme("scheme1", defaultScheme);
    theme.submitScheme("scheme1", defaultScheme);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Errors if a color is requested but there is no scheme", () => {
    const { theme, appObjects } = makeTestRig();

    appObjects.submitError = jest.fn();

    theme.getColorForType(ThemeColorType.primary);

    expect(appObjects.submitError).toBeCalled();
  });

  it("Returns the hex for the active scheme", () => {
    const { theme, appObjects } = makeTestRig();

    const scheme1 = { ...defaultScheme, primary: "#880808" };
    const scheme2 = { ...defaultScheme, primary: "#FFBF00" };
    theme.submitScheme("scheme1", scheme1);
    theme.submitScheme("scheme2", scheme2);

    theme.activeSchemeName = "scheme1";
    expect(theme.getHexForType(ThemeColorType.primary)).toEqual("#880808");

    theme.activeSchemeName = "scheme2";
    expect(theme.getHexForType(ThemeColorType.primary)).toEqual("#FFBF00");
  });

  it("Notifies when the scheme is changed", () => {
    const { theme, observer } = makeTestRig();

    theme.submitScheme("scheme1", defaultScheme);
    theme.submitScheme("scheme2", defaultScheme);

    expect(theme.activeSchemeName).toEqual("scheme1");

    observer.mockClear();

    theme.activeSchemeName = "scheme2";
    theme.activeSchemeName = "scheme2";
    theme.activeSchemeName = "scheme2";
    theme.activeSchemeName = "scheme2";

    expect(observer).toBeCalledTimes(1);
  });

  it("Warns if an unknown schema is set", () => {
    const { theme, appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    theme.activeSchemeName = "UNKNOWN";

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Gets the current schema", () => {
    const { theme } = makeTestRig();

    const scheme1 = { ...defaultScheme, primary: "#880808" };
    const scheme2 = { ...defaultScheme, primary: "#FFBF00" };
    theme.submitScheme("scheme1", scheme1);
    theme.submitScheme("scheme2", scheme2);

    theme.activeSchemeName = "scheme1";
    expect(theme.activeScheme.primary).toEqual("#880808");

    theme.activeSchemeName = "scheme2";
    expect(theme.activeScheme.primary).toEqual("#FFBF00");
  });

  it("Returns th default scheme if no scheme has been set", () => {
    const { theme } = makeTestRig();

    expect(theme.activeScheme).toEqual(defaultScheme);
  });

  it("Gets the scheme hex for type", () => {
    const { theme } = makeTestRig();

    theme.submitScheme("scheme1", defaultScheme);

    expect(theme.getHexForType(ThemeColorType.primary)).toEqual(
      defaultScheme.primary
    );
    expect(theme.getHexForType(ThemeColorType.onPrimary)).toEqual(
      defaultScheme.onPrimary
    );
    expect(theme.getHexForType(ThemeColorType.primaryContainer)).toEqual(
      defaultScheme.primaryContainer
    );
    expect(theme.getHexForType(ThemeColorType.onPrimaryContainer)).toEqual(
      defaultScheme.onPrimaryContainer
    );
    expect(theme.getHexForType(ThemeColorType.primaryFixed)).toEqual(
      defaultScheme.primaryFixed
    );
    expect(theme.getHexForType(ThemeColorType.onPrimaryFixed)).toEqual(
      defaultScheme.onPrimaryFixed
    );
    expect(theme.getHexForType(ThemeColorType.primaryFixedDim)).toEqual(
      defaultScheme.primaryFixedDim
    );
    expect(theme.getHexForType(ThemeColorType.onPrimaryFixedVariant)).toEqual(
      defaultScheme.onPrimaryFixedVariant
    );
    expect(theme.getHexForType(ThemeColorType.secondary)).toEqual(
      defaultScheme.secondary
    );
    expect(theme.getHexForType(ThemeColorType.onSecondary)).toEqual(
      defaultScheme.onSecondary
    );
    expect(theme.getHexForType(ThemeColorType.secondaryContainer)).toEqual(
      defaultScheme.secondaryContainer
    );
    expect(theme.getHexForType(ThemeColorType.onSecondaryContainer)).toEqual(
      defaultScheme.onSecondaryContainer
    );
    expect(theme.getHexForType(ThemeColorType.onSecondaryFixed)).toEqual(
      defaultScheme.onSecondaryFixed
    );
    expect(theme.getHexForType(ThemeColorType.secondaryFixedDim)).toEqual(
      defaultScheme.secondaryFixedDim
    );
    expect(theme.getHexForType(ThemeColorType.onSecondaryFixedVariant)).toEqual(
      defaultScheme.onSecondaryFixedVariant
    );
    expect(theme.getHexForType(ThemeColorType.tertiary)).toEqual(
      defaultScheme.tertiary
    );
    expect(theme.getHexForType(ThemeColorType.onTertiary)).toEqual(
      defaultScheme.onTertiary
    );
    expect(theme.getHexForType(ThemeColorType.tertiaryContainer)).toEqual(
      defaultScheme.tertiaryContainer
    );
    expect(theme.getHexForType(ThemeColorType.onTertiaryContainer)).toEqual(
      defaultScheme.onTertiaryContainer
    );
    expect(theme.getHexForType(ThemeColorType.tertiaryFixed)).toEqual(
      defaultScheme.tertiaryFixed
    );

    expect(theme.getHexForType(ThemeColorType.onTertiaryFixed)).toEqual(
      defaultScheme.onTertiaryFixed
    );
    expect(theme.getHexForType(ThemeColorType.tertiaryFixedDim)).toEqual(
      defaultScheme.tertiaryFixedDim
    );
    expect(theme.getHexForType(ThemeColorType.onTertiaryFixedVariant)).toEqual(
      defaultScheme.onTertiaryFixedVariant
    );
    expect(theme.getHexForType(ThemeColorType.error)).toEqual(
      defaultScheme.error
    );
    expect(theme.getHexForType(ThemeColorType.onError)).toEqual(
      defaultScheme.onError
    );
    expect(theme.getHexForType(ThemeColorType.errorContainer)).toEqual(
      defaultScheme.errorContainer
    );
    expect(theme.getHexForType(ThemeColorType.onErrorContainer)).toEqual(
      defaultScheme.onErrorContainer
    );
    expect(theme.getHexForType(ThemeColorType.outline)).toEqual(
      defaultScheme.outline
    );
    expect(theme.getHexForType(ThemeColorType.background)).toEqual(
      defaultScheme.background
    );
    expect(theme.getHexForType(ThemeColorType.onBackground)).toEqual(
      defaultScheme.onBackground
    );
    expect(theme.getHexForType(ThemeColorType.surface)).toEqual(
      defaultScheme.surface
    );
    expect(theme.getHexForType(ThemeColorType.onSurface)).toEqual(
      defaultScheme.onSurface
    );
    expect(theme.getHexForType(ThemeColorType.surfaceVariant)).toEqual(
      defaultScheme.surfaceVariant
    );
    expect(theme.getHexForType(ThemeColorType.onSurfaceVariant)).toEqual(
      defaultScheme.onSurfaceVariant
    );
    expect(theme.getHexForType(ThemeColorType.inverseSurface)).toEqual(
      defaultScheme.inverseSurface
    );
    expect(theme.getHexForType(ThemeColorType.inverseOnSurface)).toEqual(
      defaultScheme.inverseOnSurface
    );
    expect(theme.getHexForType(ThemeColorType.inversePrimary)).toEqual(
      defaultScheme.inversePrimary
    );
    expect(theme.getHexForType(ThemeColorType.shadow)).toEqual(
      defaultScheme.shadow
    );
    expect(theme.getHexForType(ThemeColorType.surfaceTint)).toEqual(
      defaultScheme.surfaceTint
    );
    expect(theme.getHexForType(ThemeColorType.outlineVariant)).toEqual(
      defaultScheme.outlineVariant
    );
    expect(theme.getHexForType(ThemeColorType.scrim)).toEqual(
      defaultScheme.scrim
    );
    expect(theme.getHexForType(ThemeColorType.surfaceContainerHighest)).toEqual(
      defaultScheme.surfaceContainerHighest
    );
    expect(theme.getHexForType(ThemeColorType.surfaceContainerHigh)).toEqual(
      defaultScheme.surfaceContainerHigh
    );
    expect(theme.getHexForType(ThemeColorType.surfaceContainer)).toEqual(
      defaultScheme.surfaceContainer
    );
    expect(theme.getHexForType(ThemeColorType.surfaceContainerLow)).toEqual(
      defaultScheme.surfaceContainerLow
    );
    expect(theme.getHexForType(ThemeColorType.surfaceContainerLowest)).toEqual(
      defaultScheme.surfaceContainerLowest
    );
    expect(theme.getHexForType(ThemeColorType.surfaceBright)).toEqual(
      defaultScheme.surfaceBright
    );
    expect(theme.getHexForType(ThemeColorType.surfaceDim)).toEqual(
      defaultScheme.surfaceDim
    );
  });

  it("Gets the scheme colors for type", () => {
    const { theme } = makeTestRig();

    theme.submitScheme("scheme1", defaultScheme);

    expect(theme.getColorForType(ThemeColorType.primary)).toEqual(
      Color.Hex(defaultScheme.primary)
    );
    expect(theme.getColorForType(ThemeColorType.onPrimary)).toEqual(
      Color.Hex(defaultScheme.onPrimary)
    );
    expect(theme.getColorForType(ThemeColorType.primaryContainer)).toEqual(
      Color.Hex(defaultScheme.primaryContainer)
    );
    expect(theme.getColorForType(ThemeColorType.onPrimaryContainer)).toEqual(
      Color.Hex(defaultScheme.onPrimaryContainer)
    );
    expect(theme.getColorForType(ThemeColorType.primaryFixed)).toEqual(
      Color.Hex(defaultScheme.primaryFixed)
    );
    expect(theme.getColorForType(ThemeColorType.onPrimaryFixed)).toEqual(
      Color.Hex(defaultScheme.onPrimaryFixed)
    );
    expect(theme.getColorForType(ThemeColorType.primaryFixedDim)).toEqual(
      Color.Hex(defaultScheme.primaryFixedDim)
    );
    expect(theme.getColorForType(ThemeColorType.onPrimaryFixedVariant)).toEqual(
      Color.Hex(defaultScheme.onPrimaryFixedVariant)
    );
    expect(theme.getColorForType(ThemeColorType.secondary)).toEqual(
      Color.Hex(defaultScheme.secondary)
    );
    expect(theme.getColorForType(ThemeColorType.onSecondary)).toEqual(
      Color.Hex(defaultScheme.onSecondary)
    );
    expect(theme.getColorForType(ThemeColorType.secondaryContainer)).toEqual(
      Color.Hex(defaultScheme.secondaryContainer)
    );
    expect(theme.getColorForType(ThemeColorType.onSecondaryContainer)).toEqual(
      Color.Hex(defaultScheme.onSecondaryContainer)
    );
    expect(theme.getColorForType(ThemeColorType.onSecondaryFixed)).toEqual(
      Color.Hex(defaultScheme.onSecondaryFixed)
    );
    expect(theme.getColorForType(ThemeColorType.secondaryFixedDim)).toEqual(
      Color.Hex(defaultScheme.secondaryFixedDim)
    );
    expect(
      theme.getColorForType(ThemeColorType.onSecondaryFixedVariant)
    ).toEqual(Color.Hex(defaultScheme.onSecondaryFixedVariant));
    expect(theme.getColorForType(ThemeColorType.tertiary)).toEqual(
      Color.Hex(defaultScheme.tertiary)
    );
    expect(theme.getColorForType(ThemeColorType.onTertiary)).toEqual(
      Color.Hex(defaultScheme.onTertiary)
    );
    expect(theme.getColorForType(ThemeColorType.tertiaryContainer)).toEqual(
      Color.Hex(defaultScheme.tertiaryContainer)
    );
    expect(theme.getColorForType(ThemeColorType.onTertiaryContainer)).toEqual(
      Color.Hex(defaultScheme.onTertiaryContainer)
    );
    expect(theme.getColorForType(ThemeColorType.tertiaryFixed)).toEqual(
      Color.Hex(defaultScheme.tertiaryFixed)
    );

    expect(theme.getColorForType(ThemeColorType.onTertiaryFixed)).toEqual(
      Color.Hex(defaultScheme.onTertiaryFixed)
    );
    expect(theme.getColorForType(ThemeColorType.tertiaryFixedDim)).toEqual(
      Color.Hex(defaultScheme.tertiaryFixedDim)
    );
    expect(
      theme.getColorForType(ThemeColorType.onTertiaryFixedVariant)
    ).toEqual(Color.Hex(defaultScheme.onTertiaryFixedVariant));
    expect(theme.getColorForType(ThemeColorType.error)).toEqual(
      Color.Hex(defaultScheme.error)
    );
    expect(theme.getColorForType(ThemeColorType.onError)).toEqual(
      Color.Hex(defaultScheme.onError)
    );
    expect(theme.getColorForType(ThemeColorType.errorContainer)).toEqual(
      Color.Hex(defaultScheme.errorContainer)
    );
    expect(theme.getColorForType(ThemeColorType.onErrorContainer)).toEqual(
      Color.Hex(defaultScheme.onErrorContainer)
    );
    expect(theme.getColorForType(ThemeColorType.outline)).toEqual(
      Color.Hex(defaultScheme.outline)
    );
    expect(theme.getColorForType(ThemeColorType.background)).toEqual(
      Color.Hex(defaultScheme.background)
    );
    expect(theme.getColorForType(ThemeColorType.onBackground)).toEqual(
      Color.Hex(defaultScheme.onBackground)
    );
    expect(theme.getColorForType(ThemeColorType.surface)).toEqual(
      Color.Hex(defaultScheme.surface)
    );
    expect(theme.getColorForType(ThemeColorType.onSurface)).toEqual(
      Color.Hex(defaultScheme.onSurface)
    );
    expect(theme.getColorForType(ThemeColorType.surfaceVariant)).toEqual(
      Color.Hex(defaultScheme.surfaceVariant)
    );
    expect(theme.getColorForType(ThemeColorType.onSurfaceVariant)).toEqual(
      Color.Hex(defaultScheme.onSurfaceVariant)
    );
    expect(theme.getColorForType(ThemeColorType.inverseSurface)).toEqual(
      Color.Hex(defaultScheme.inverseSurface)
    );
    expect(theme.getColorForType(ThemeColorType.inverseOnSurface)).toEqual(
      Color.Hex(defaultScheme.inverseOnSurface)
    );
    expect(theme.getColorForType(ThemeColorType.inversePrimary)).toEqual(
      Color.Hex(defaultScheme.inversePrimary)
    );
    expect(theme.getColorForType(ThemeColorType.shadow)).toEqual(
      Color.Hex(defaultScheme.shadow)
    );
    expect(theme.getColorForType(ThemeColorType.surfaceTint)).toEqual(
      Color.Hex(defaultScheme.surfaceTint)
    );
    expect(theme.getColorForType(ThemeColorType.outlineVariant)).toEqual(
      Color.Hex(defaultScheme.outlineVariant)
    );
    expect(theme.getColorForType(ThemeColorType.scrim)).toEqual(
      Color.Hex(defaultScheme.scrim)
    );
    expect(
      theme.getColorForType(ThemeColorType.surfaceContainerHighest)
    ).toEqual(Color.Hex(defaultScheme.surfaceContainerHighest));
    expect(theme.getColorForType(ThemeColorType.surfaceContainerHigh)).toEqual(
      Color.Hex(defaultScheme.surfaceContainerHigh)
    );
    expect(theme.getColorForType(ThemeColorType.surfaceContainer)).toEqual(
      Color.Hex(defaultScheme.surfaceContainer)
    );
    expect(theme.getColorForType(ThemeColorType.surfaceContainerLow)).toEqual(
      Color.Hex(defaultScheme.surfaceContainerLow)
    );
    expect(
      theme.getColorForType(ThemeColorType.surfaceContainerLowest)
    ).toEqual(Color.Hex(defaultScheme.surfaceContainerLowest));
    expect(theme.getColorForType(ThemeColorType.surfaceBright)).toEqual(
      Color.Hex(defaultScheme.surfaceBright)
    );
    expect(theme.getColorForType(ThemeColorType.surfaceDim)).toEqual(
      Color.Hex(defaultScheme.surfaceDim)
    );
  });
});
