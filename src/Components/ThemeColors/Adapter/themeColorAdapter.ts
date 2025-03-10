import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import { defaultThemeColorsVM, ThemeColorsPM, ThemeColorsVM } from "../PM";

export const themeColorAdapter: SingletonPmAdapter<ThemeColorsVM> = {
  defaultVM: defaultThemeColorsVM,
  subscribe: (
    appObjects: AppObjectRepo,
    setVM: (vm: ThemeColorsVM) => void
  ) => {
    const pm = ThemeColorsPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "themeColorAdapter",
        "Unable to find ThemeColorsPM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    appObjects: AppObjectRepo,
    setVM: (vm: ThemeColorsVM) => void
  ) => {
    const pm = ThemeColorsPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "themeColorAdapter",
        "Unable to find ThemeColorsPM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
