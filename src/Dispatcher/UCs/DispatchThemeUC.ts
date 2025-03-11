import { AppObject, AppObjectRepo, AppObjectUC } from "@vived/core";
import { HostThemeEntity } from "../../ThemeColors";
import { HostDispatchEntity } from "../Entities";

export abstract class DispatchThemeUC extends AppObjectUC {
  static readonly type = "DispatchThemeUC";
  readonly requestType = "SET_THEME_COLORS";

  abstract doDispatch(): void;

  static get(appObject: AppObject): DispatchThemeUC | undefined {
    const asset = appObject.getComponent<DispatchThemeUC>(DispatchThemeUC.type);
    if (!asset) {
      appObject.appObjectRepo.submitWarning(
        "DispatchThemeUC.get",
        "Unable to find DispatchThemeUC on app object " + appObject.id
      );
    }
    return asset;
  }

  static getByID(
    id: string,
    appObjects: AppObjectRepo
  ): DispatchThemeUC | undefined {
    const appObject = appObjects.get(id);

    if (!appObject) {
      appObjects.submitWarning(
        "DispatchThemeUC.getByID",
        "Unable to find App Object by id " + id
      );
      return undefined;
    }

    return DispatchThemeUC.get(appObject);
  }
}

export function makeDispatchThemeUC(appObject: AppObject): DispatchThemeUC {
  return new DispatchThemeUCImp(appObject);
}

class DispatchThemeUCImp extends DispatchThemeUC {
  readonly requestVersion = 1;
  private dispatcher?: HostDispatchEntity;

  private get theme() {
    return this.getCachedSingleton<HostThemeEntity>(HostThemeEntity.type);
  }

  doDispatch(): void {
    if (!this.dispatcher || !this.theme) return;

    const colors: ColorSchemeV1 = { ...this.theme.activeScheme };

    const payload = {
      colors
    };

    this.dispatcher.formRequestAndDispatch(
      this.requestType,
      this.requestVersion,
      payload
    );
  }

  constructor(appObject: AppObject) {
    super(appObject, DispatchThemeUC.type);

    this.dispatcher = appObject.getComponent<HostDispatchEntity>(
      HostDispatchEntity.type
    );
    if (!this.dispatcher) {
      this.error(
        "UC has been added to an App Object that does not have a HostDispatchEntity. Add a dispatcher first"
      );
      this.dispose();
    }
  }
}

export interface ColorSchemeV1 {
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
