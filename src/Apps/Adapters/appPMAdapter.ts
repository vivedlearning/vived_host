import { AppObjectRepo, PmAdapter } from "@vived/core";
import { AppPM, AppVM, defaultAppVM } from "../PMs/AppPM";

/**
 * Adapter for the AppPM presentation manager.
 *
 * This adapter provides a simple interface for framework components to connect with
 * the AppPM presentation manager, which provides details about a specific app.
 *
 * Usage in components:
 * ```
 * // React component example
 * const [vm, setVm] = useState(appPMAdapter.defaultVM);
 *
 * useEffect(() => {
 *   appPMAdapter.subscribe(appId, appObjects, setVm);
 *   return () => appPMAdapter.unsubscribe(appId, appObjects, setVm);
 * }, [appId, appObjects]);
 * ```
 *
 * @type {PmAdapter<AppVM>} Non-singleton adapter that requires an app ID
 */
export const appPMAdapter: PmAdapter<AppVM> = {
  /**
   * Default view model to use before the actual data is loaded
   * or when the presentation manager isn't available
   */
  defaultVM: defaultAppVM,

  /**
   * Subscribes a view callback to the app presentation manager
   *
   * @param id - ID of the specific app to subscribe to
   * @param appObjects - The app object repository
   * @param setVM - Callback function that will receive view model updates
   */
  subscribe: (
    id: string,
    appObjects: AppObjectRepo,
    setVM: (vm: AppVM) => void
  ) => {
    const pm = AppPM.get(id, appObjects);
    if (!pm) {
      appObjects.submitError("appPMAdapter", "Unable to find AppsListPM");
      return;
    }
    pm.addView(setVM);
  },

  /**
   * Unsubscribes a view callback from the app presentation manager
   *
   * @param id - ID of the specific app to unsubscribe from
   * @param appObjects - The app object repository
   * @param setVM - The callback function to remove
   */
  unsubscribe: (
    id: string,
    appObjects: AppObjectRepo,
    setVM: (vm: AppVM) => void
  ) => {
    const pm = AppPM.get(id, appObjects);
    if (!pm) {
      appObjects.submitError("appPMAdapter", "Unable to find AppsListPM");
      return;
    }
    pm.removeView(setVM);
  }
};
