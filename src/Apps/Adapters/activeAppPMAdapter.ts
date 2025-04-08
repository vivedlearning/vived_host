import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import {
  ActiveAppPM,
  ActiveAppVM,
  defaultActiveAppVM
} from "../PMs/ActiveAppPM";

/**
 * Adapter for the ActiveAppPM singleton presentation manager.
 *
 * This adapter provides a simple interface for framework components to connect with
 * the ActiveAppPM presentation manager, which provides information about the currently
 * active/selected app in the system.
 *
 * Usage in components:
 * ```
 * // React component example
 * const [activeAppVm, setActiveAppVm] = useState(activeAppPMAdapter.defaultVM);
 *
 * useEffect(() => {
 *   activeAppPMAdapter.subscribe(appObjects, setActiveAppVm);
 *   return () => activeAppPMAdapter.unsubscribe(appObjects, setActiveAppVm);
 * }, [appObjects]);
 * ```
 *
 * @type {SingletonPmAdapter<ActiveAppVM>} Singleton adapter that provides the active app information
 */
export const activeAppPMAdapter: SingletonPmAdapter<ActiveAppVM> = {
  /**
   * Default view model to use before the actual data is loaded
   * or when the presentation manager isn't available
   */
  defaultVM: defaultActiveAppVM,

  /**
   * Subscribes a view callback to the active app presentation manager
   *
   * @param appObjects - The app object repository
   * @param setVM - Callback function that will receive view model updates
   */
  subscribe: (appObjects: AppObjectRepo, setVM: (vm: ActiveAppVM) => void) => {
    const pm = ActiveAppPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "activeAppPMAdapter",
        "Unable to find ActiveAppPM"
      );
      return;
    }
    pm.addView(setVM);
  },

  /**
   * Unsubscribes a view callback from the active app presentation manager
   *
   * @param appObjects - The app object repository
   * @param setVM - The callback function to remove
   */
  unsubscribe: (
    appObjects: AppObjectRepo,
    setVM: (vm: ActiveAppVM) => void
  ) => {
    const pm = ActiveAppPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "activeAppPMAdapter",
        "Unable to find ActiveAppPM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
