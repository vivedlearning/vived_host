import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import { AppsListPM } from "../PMs/AppsListPM";

/**
 * Adapter for the AppsListPM singleton presentation manager.
 *
 * This adapter provides a simple interface for framework components to connect with
 * the AppsListPM presentation manager, which provides a list of available app IDs.
 *
 * Usage in components:
 * ```
 * // React component example
 * const [appIds, setAppIds] = useState(appListPMAdapter.defaultVM);
 *
 * useEffect(() => {
 *   appListPMAdapter.subscribe(appObjects, setAppIds);
 *   return () => appListPMAdapter.unsubscribe(appObjects, setAppIds);
 * }, [appObjects]);
 * ```
 *
 * @type {SingletonPmAdapter<string[]>} Singleton adapter that provides a list of app IDs
 */
export const appListPMAdapter: SingletonPmAdapter<string[]> = {
  /**
   * Default view model to use before the actual data is loaded
   * or when the presentation manager isn't available
   */
  defaultVM: [],

  /**
   * Subscribes a view callback to the apps list presentation manager
   *
   * @param appObjects - The app object repository
   * @param setVM - Callback function that will receive view model updates (array of app IDs)
   */
  subscribe: (appObjects: AppObjectRepo, setVM: (vm: string[]) => void) => {
    const pm = AppsListPM.get(appObjects);
    if (!pm) {
      appObjects.submitError("appListPMAdapter", "Unable to find AppsListPM");
      return;
    }
    pm.addView(setVM);
  },

  /**
   * Unsubscribes a view callback from the apps list presentation manager
   *
   * @param appObjects - The app object repository
   * @param setVM - The callback function to remove
   */
  unsubscribe: (appObjects: AppObjectRepo, setVM: (vm: string[]) => void) => {
    const pm = AppsListPM.get(appObjects);
    if (!pm) {
      appObjects.submitError("appListPMAdapter", "Unable to find AppsListPM");
      return;
    }
    pm.removeView(setVM);
  }
};
