import { AppObject, AppObjectPM, AppObjectRepo } from "@vived/core";
import { AppEntity } from "../Entities/AppEntity";

/**
 * View Model for App information
 * Represents the data needed by the view to display an app
 */
export interface AppVM {
  /** Unique identifier for the app */
  id: string;
  /** Display name of the app */
  name: string;
  /** Description text for the app */
  description: string;
  /** URL to the app's thumbnail or preview image */
  imageURL: string;
}

/**
 * Default empty AppVM for initialization
 */
export const defaultAppVM: AppVM = {
  id: "",
  description: "",
  imageURL: "",
  name: ""
};

/**
 * Presentation Manager for App entities
 * 
 * The AppPM is responsible for:
 * - Converting the AppEntity data into a view-friendly format (AppVM)
 * - Notifying the view when app data changes
 * - Providing comparison utilities for view models
 * 
 * Usage:
 * 1. Retrieve an instance with `AppPM.get(appId, appObjects)`
 * 2. Subscribe to view updates with `pm.addViewUpdateObserver(callback)`
 * 3. Access current view data with `pm.lastVM`
 */
export abstract class AppPM extends AppObjectPM<AppVM> {
  static type = "AppPM";

  /**
   * Retrieves an AppPM instance for a specific app by ID
   * 
   * @param id - The unique identifier of the app
   * @param appObjects - The repository of app objects
   * @returns The AppPM instance or undefined if not found
   */
  static get(id: string, appObjects: AppObjectRepo) {
    const ao = appObjects.get(id);
    if (!ao) {
      return;
    }

    return ao.getComponent<AppPM>(AppPM.type);
  }
}

/**
 * Creates a new AppPM instance
 * 
 * @param appObject - The app object to associate with this PM
 * @returns A new AppPM instance
 */
export function makeAppPM(appObject: AppObject): AppPM {
  return new AppPMImp(appObject);
}

/**
 * Implementation of the AppPM abstract class
 * Handles the connection between AppEntity and view
 */
class AppPMImp extends AppPM {
  /**
   * Gets the associated AppEntity
   */
  private get app() {
    return this.getCachedLocalComponent<AppEntity>(AppEntity.type);
  }

  /**
   * Compares two AppVM instances for equality
   * Used to determine if the view needs to update
   * 
   * @param a - First AppVM to compare
   * @param b - Second AppVM to compare
   * @returns True if view models are equal, false otherwise
   */
  vmsAreEqual(a: AppVM, b: AppVM): boolean {
    if (a.description !== b.description) return false;
    if (a.name !== b.name) return false;
    if (a.imageURL !== b.imageURL) return false;
    return true;
  }

  /**
   * Observer callback that updates the view model when the entity changes
   * Transforms entity data into view model format
   */
  private onEntityChange = () => {
    if (!this.app) return;

    const vm: AppVM = {
      description: this.app.description,
      id: this.app.id,
      imageURL: this.app.image_url,
      name: this.app.name
    };

    this.doUpdateView(vm);
  };

  /**
   * Creates a new AppPM instance
   * 
   * @param appObject - The app object to associate with this PM
   */
  constructor(appObject: AppObject) {
    super(appObject, AppPM.type);

    this.app?.addChangeObserver(this.onEntityChange);
    this.onEntityChange();
  }
}
