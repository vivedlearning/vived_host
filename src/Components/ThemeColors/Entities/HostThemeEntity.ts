import { MemoizedColor, MemoizedString } from "../../../Entities";
import {
  getSingletonComponent,
  HostAppObject,
  HostAppObjectEntity,
  HostAppObjectRepo
} from "../../../HostAppObject";
import { Color } from "../../../ValueObjects";

export enum ThemeColorType {
  primary = "primary",
  onPrimary = "onPrimary",
  primaryContainer = "primaryContainer",
  onPrimaryContainer = "onPrimaryContainer",
  primaryFixed = "primaryFixed",
  onPrimaryFixed = "onPrimaryFixed",
  primaryFixedDim = "primaryFixedDim",
  onPrimaryFixedVariant = "onPrimaryFixedVariant",
  secondary = "secondary",
  onSecondary = "onSecondary",
  secondaryContainer = "secondaryContainer",
  onSecondaryContainer = "onSecondaryContainer",
  secondaryFixed = "secondaryFixed",
  onSecondaryFixed = "onSecondaryFixed",
  secondaryFixedDim = "secondaryFixedDim",
  onSecondaryFixedVariant = "onSecondaryFixedVariant",
  tertiary = "tertiary",
  onTertiary = "onTertiary",
  tertiaryContainer = "tertiaryContainer",
  onTertiaryContainer = "onTertiaryContainer",
  tertiaryFixed = "tertiaryFixed",
  onTertiaryFixed = "onTertiaryFixed",
  tertiaryFixedDim = "tertiaryFixedDim",
  onTertiaryFixedVariant = "onTertiaryFixedVariant",
  error = "error",
  onError = "onError",
  errorContainer = "errorContainer",
  onErrorContainer = "onErrorContainer",
  outline = "outline",
  background = "background",
  onBackground = "onBackground",
  surface = "surface",
  onSurface = "onSurface",
  surfaceVariant = "surfaceVariant",
  onSurfaceVariant = "onSurfaceVariant",
  inverseSurface = "inverseSurface",
  inverseOnSurface = "inverseOnSurface",
  inversePrimary = "inversePrimary",
  shadow = "shadow",
  surfaceTint = "surfaceTint",
  outlineVariant = "outlineVariant",
  scrim = "scrim",
  surfaceContainerHighest = "surfaceContainerHighest",
  surfaceContainerHigh = "surfaceContainerHigh",
  surfaceContainer = "surfaceContainer",
  surfaceContainerLow = "surfaceContainerLow",
  surfaceContainerLowest = "surfaceContainerLowest",
  surfaceBright = "surfaceBright",
  surfaceDim = "surfaceDim"
}

export interface ColorScheme {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  primaryFixed: string;
  onPrimaryFixed: string;
  primaryFixedDim: string;
  onPrimaryFixedVariant: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  secondaryFixed: string;
  onSecondaryFixed: string;
  secondaryFixedDim: string;
  onSecondaryFixedVariant: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  tertiaryFixed: string;
  onTertiaryFixed: string;
  tertiaryFixedDim: string;
  onTertiaryFixedVariant: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  outline: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  shadow: string;
  surfaceTint: string;
  outlineVariant: string;
  scrim: string;
  surfaceContainerHighest: string;
  surfaceContainerHigh: string;
  surfaceContainer: string;
  surfaceContainerLow: string;
  surfaceContainerLowest: string;
  surfaceBright: string;
  surfaceDim: string;
}

export abstract class HostThemeEntity extends HostAppObjectEntity {
  static readonly type = "HostThemeEntity";

  abstract submitScheme(name: string, scheme: ColorScheme): void;
  abstract activeSchemeName: string;

  abstract get activeScheme(): ColorScheme;
  abstract getColorForType(type: ThemeColorType): Color;
  abstract getHexForType(type: ThemeColorType): string;

  static get = (appObjects: HostAppObjectRepo): HostThemeEntity | undefined =>
    getSingletonComponent(HostThemeEntity.type, appObjects);
}

export function makeHostThemeEntity(appObject: HostAppObject) {
  return new HostThemeEntityImp(appObject);
}

class HostThemeEntityImp extends HostThemeEntity {
  private schemeLookup = new Map<string, ColorScheme>();

  get activeScheme(): ColorScheme {
    return this.schemeLookup.get(this.activeSchemeName) ?? defaultScheme;
  }

  submitScheme = (name: string, scheme: ColorScheme) => {
    if (this.schemeLookup.has(name)) {
      this.warn("Duplicate scheme name submitted. Overwriting");
    }

    this.schemeLookup.set(name, scheme);

    if (!this.activeSchemeName) {
      this.activeSchemeName = name;
    }
  };

  getHexForType(type: ThemeColorType): string {
    const scheme = this.schemeLookup.get(this.activeSchemeName);
    if (!scheme) {
      this.error("No active scheme");
      return "#000000";
    }

    return scheme[type];
  }

  private memoizedActiveScheme = new MemoizedString("", this.notifyOnChange);
  get activeSchemeName(): string {
    return this.memoizedActiveScheme.val;
  }

  set activeSchemeName(val: string) {
    if (!this.schemeLookup.has(val)) {
      this.warn(`Unknown theme schema: ${val}. Ignoring.`);
      return;
    }
    this.memoizedActiveScheme.val = val;
  }

  constructor(appObject: HostAppObject) {
    super(appObject, HostThemeEntity.type);

    this.appObjects.registerSingleton(this);
  }

  getColorForType = (type: ThemeColorType): Color => {
    const scheme = this.schemeLookup.get(this.activeSchemeName);
    if (!scheme) {
      this.error("No active scheme");
      return Color.RGB(0, 0, 0);
    }

    const colorHex = scheme[type];
    return Color.Hex(colorHex);
  };
}

export const defaultScheme: ColorScheme = {
  primary: "#7BD0FF",
  onPrimary: "#003549",
  primaryContainer: "#004C69",
  onPrimaryContainer: "#C4E7FF",
  primaryFixed: "#C4E7FF",
  onPrimaryFixed: "#001E2C",
  primaryFixedDim: "#7BD0FF",
  onPrimaryFixedVariant: "#004C69",
  secondary: "#B5C9D7",
  onSecondary: "#20333E",
  secondaryContainer: "#374955",
  onSecondaryContainer: "#D1E5F4",
  secondaryFixed: "#D1E5F4",
  onSecondaryFixed: "#0A1E28",
  secondaryFixedDim: "#B5C9D7",
  onSecondaryFixedVariant: "#374955",
  tertiary: "#CAC1E9",
  onTertiary: "#322C4C",
  tertiaryContainer: "#484264",
  onTertiaryContainer: "#E6DEFF",
  tertiaryFixed: "#E6DEFF",
  onTertiaryFixed: "#1D1736",
  tertiaryFixedDim: "#CAC1E9",
  onTertiaryFixedVariant: "#484264",
  error: "#FFB4AB",
  onError: "#690005",
  errorContainer: "#93000A",
  onErrorContainer: "#FFDAD6",
  outline: "#8B9297",
  background: "#191C1E",
  onBackground: "#E1E2E5",
  surface: "#111416",
  onSurface: "#C5C6C9",
  surfaceVariant: "#41484D",
  onSurfaceVariant: "#C0C7CD",
  inverseSurface: "#E1E2E5",
  inverseOnSurface: "#191C1E",
  inversePrimary: "#00668A",
  shadow: "#000000",
  surfaceTint: "#7BD0FF",
  outlineVariant: "#41484D",
  scrim: "#000000",
  surfaceContainerHighest: "#333537",
  surfaceContainerHigh: "#282A2C",
  surfaceContainer: "#1D2022",
  surfaceContainerLow: "#191C1E",
  surfaceContainerLowest: "#0C0F10",
  surfaceBright: "#37393C",
  surfaceDim: "#111416"
};
