import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import { SnackbarPM, SnackbarVM, defaultSnackbarVM } from "../PMs/SnackbarPM";

/**
 * Adapter for connecting UI components to the Snackbar system
 * Follows the SingletonPmAdapter pattern for reactive state management
 */
export const snackbarAdapter: SingletonPmAdapter<SnackbarVM> = {
  /**
   * Default view model used when no snackbar is active
   */
  defaultVM: defaultSnackbarVM,
  
  /**
   * Subscribes a UI component to snackbar state changes
   * @param appObjects The application object repository
   * @param setVM Callback function to update the UI with the new view model
   */
  subscribe: (appObjects: AppObjectRepo, setVM: (vm: SnackbarVM) => void): void => {
    const pm = SnackbarPM.get(appObjects);
    if (!pm) {
      appObjects.submitError("snackbarAdapter", "Unable to find SnackbarPM");
      return;
    }
    pm.addView(setVM);
  },
  
  /**
   * Unsubscribes a UI component from snackbar state changes
   * @param appObjects The application object repository
   * @param setVM The same callback function used when subscribing
   */
  unsubscribe: (appObjects: AppObjectRepo, setVM: (vm: SnackbarVM) => void): void => {
    const pm = SnackbarPM.get(appObjects);
    if (!pm) {
      appObjects.submitError("snackbarAdapter", "Unable to find SnackbarPM");
      return;
    }
    pm.removeView(setVM);
  }
};
