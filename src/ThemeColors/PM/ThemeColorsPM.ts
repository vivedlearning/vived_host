import {
  getSingletonComponent,
  AppObject,
  AppObjectPM,
  AppObjectRepo
} from "@vived/core";
import {
  ColorScheme,
  defaultScheme,
  HostThemeEntity
} from "../Entities/HostThemeEntity";

export interface ThemeColorsVM {
  themeName: string;
  scheme: ColorScheme;
}

export const defaultThemeColorsVM: ThemeColorsVM = {
  themeName: "",
  scheme: defaultScheme
};

export abstract class ThemeColorsPM extends AppObjectPM<ThemeColorsVM> {
  static readonly type = "ThemeColorsPM";

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<ThemeColorsPM>(ThemeColorsPM.type, appObjects);
  }
}

export function makeThemeColorsPM(appObject: AppObject): ThemeColorsPM {
  return new ThemeColorsPMImp(appObject);
}

class ThemeColorsPMImp extends ThemeColorsPM {
  private themeColors?: HostThemeEntity;

  vmsAreEqual(a: ThemeColorsVM, b: ThemeColorsVM): boolean {
    return a.themeName === b.themeName;
  }

  onThemeChange = () => {
    if (!this.themeColors) return;
    this.doUpdateView({
      themeName: this.themeColors.activeSchemeName,
      scheme: this.themeColors.activeScheme
    });
  };

  constructor(appObject: AppObject) {
    super(appObject, ThemeColorsPM.type);

    this.appObjects.registerSingleton(this);

    this.themeColors = HostThemeEntity.get(appObject.appObjectRepo)!;
    if (!this.themeColors) {
      this.error("Unable to find HostThemeEntity");
      return;
    } else {
      this.themeColors.addChangeObserver(this.onThemeChange);
      this.onThemeChange();
    }
  }
}
