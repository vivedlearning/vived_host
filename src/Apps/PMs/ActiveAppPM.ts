import { AppObjectPM, AppObjectRepo } from "@vived/core";

/**
 * Interface defining the view model for the active application
 *
 * @property {string} id - The ID of the currently active app
 * @property {string[]} stylesheets - List of stylesheet URLs for the active app
 */
export interface ActiveAppVM {
  id: string;
  stylesheets: string[];
}

/**
 * Default values for the ActiveAppVM
 */
export const defaultActiveAppVM: ActiveAppVM = {
  id: "",
  stylesheets: []
};

/**
 * ActiveAppPM - Presentation model that manages the currently active application
 *
 * This singleton PM tracks which app is currently active in the system and provides
 * access to information about that app, such as its stylesheets. The UI layer can
 * subscribe to changes in the active app through this PM.
 *
 * @extends AppObjectPM<ActiveAppVM>
 */
export abstract class ActiveAppPM extends AppObjectPM<ActiveAppVM> {
  /** Type identifier for the ActiveAppPM component */
  static type = "ActiveAppPM";

  /**
   * Gets the singleton instance of ActiveAppPM from the app objects repository
   *
   * @param appObjects - Repository containing app objects
   * @returns The singleton ActiveAppPM instance
   */
  static get(appObjects: AppObjectRepo) {
    return appObjects.getSingleton<ActiveAppPM>(ActiveAppPM.type);
  }
}
