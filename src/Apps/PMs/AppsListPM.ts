import { AppObject, AppObjectPM, AppObjectRepo } from "@vived/core";
import { AppRepoEntity } from "../Entities";

/**
 * Presentation Manager for displaying a list of available apps.
 *
 * This singleton PM observes the AppRepoEntity and transforms the list of app entities
 * into a simple array of app IDs for views to consume. It specifically filters for apps
 * that are assigned to the current owner/user.
 *
 * @extends AppObjectPM<string[]> - The view model is a simple array of app IDs
 */
export abstract class AppsListPM extends AppObjectPM<string[]> {
  static type = "AppsListPM";

  /**
   * Gets the singleton instance of AppsListPM.
   *
   * @param appObjects - The app object repository
   * @returns The AppsListPM instance or undefined if not found
   */
  static get(appObjects: AppObjectRepo) {
    return appObjects.getSingleton<AppsListPM>(AppsListPM.type);
  }
}

/**
 * Factory function to create a new AppsListPM instance.
 *
 * @param appObject - The app object to attach the PM to
 * @returns A new AppsListPM instance
 */
export function makeAppsListPM(appObject: AppObject): AppsListPM {
  return new AppsListPMImp(appObject);
}

/**
 * Concrete implementation of the AppsListPM abstract class.
 */
class AppsListPMImp extends AppsListPM {
  /**
   * Gets the app repository entity that contains all available apps.
   */
  private get slideApps() {
    return this.getCachedSingleton<AppRepoEntity>(AppRepoEntity.type);
  }

  /**
   * Compares two app ID arrays for equality.
   *
   * @param a - First array of app IDs
   * @param b - Second array of app IDs
   * @returns True if the arrays contain the same IDs in the same order
   */
  vmsAreEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    let areEqual = true;

    a.forEach((aID, i) => {
      const bID = b[i];
      if (aID !== bID) areEqual = false;
    });
    return areEqual;
  }

  /**
   * Handler for changes in the app repository.
   *
   * This filters apps to include only those assigned to the owner
   * and updates the view model with their IDs.
   */
  private onEntityChange = () => {
    if (!this.slideApps) return;

    const allApps = this.slideApps.getAllApps();
    const vms: string[] = [];

    allApps.forEach((app) => {
      if (app.assignedToOwner) {
        vms.push(app.id);
      }
    });

    this.doUpdateView(vms);
  };

  /**
   * Creates a new AppsListPMImp instance.
   *
   * @param appObject - The app object to attach to
   */
  constructor(appObject: AppObject) {
    super(appObject, AppsListPM.type);

    this.slideApps?.addChangeObserver(this.onEntityChange);
    this.onEntityChange();
    this.appObjects.registerSingleton(this);
  }
}
