import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";
import { HostThemeEntity } from "../Entities";

export abstract class SetThemeUC extends AppObjectUC {
  static type = "SetThemeUC";

  abstract lightThemeName: string;
  abstract darkThemeName: string;

  abstract setThemeByName(name: string): void;
  abstract tryDetectTheme(): void;

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<SetThemeUC>(SetThemeUC.type, appObjects);
  }
}

export function makeSetThemeUC(appObject: AppObject): SetThemeUC {
  return new SetThemeUCImp(appObject);
}

class SetThemeUCImp extends SetThemeUC {
  lightThemeName = "light";
  darkThemeName = "dark";

  private get theme() {
    return this.getCachedSingleton<HostThemeEntity>(HostThemeEntity.type);
  }

  setThemeByName(name: string): void {
    if (!this.theme) return;

    this.theme.activeSchemeName = name;
  }

  tryDetectTheme(): void {
    if (!this.theme || !window.matchMedia) return;

    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    if (darkThemeMq.matches) {
      this.theme.activeSchemeName = this.darkThemeName;
    } else {
      this.theme.activeSchemeName = this.darkThemeName;
    }
  }

  constructor(appObject: AppObject) {
    super(appObject, SetThemeUC.type);
    this.appObjects.registerSingleton(this);
  }
}
