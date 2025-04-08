import {
  AppObject,
  AppObjectPM,
  AppObjectRepo,
  getSingletonComponent
} from "@vived/core";
import { SnackbarRepo } from "../Entities/SnackbarRepo";

/**
 * View model for snackbar UI components
 * Contains only the properties needed for display
 */
export interface SnackbarVM {
  /** Message to display in the snackbar (undefined when no active snackbar) */
  message: string | undefined;
  /** Duration in seconds before the snackbar auto-dismisses */
  durationInSeconds: number;
  /** Text for the action button (undefined when no action) */
  actionButtonText: string | undefined;
}

/**
 * Presentation Manager for snackbar notifications
 * Transforms data from SnackbarRepo into view models for UI components
 */
export abstract class SnackbarPM extends AppObjectPM<SnackbarVM> {
  static type = "SnackbarPM";

  /**
   * Gets the singleton instance of SnackbarPM
   * @param appObjects The application object repository
   * @returns The SnackbarPM instance or undefined if not found
   */
  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<SnackbarPM>(SnackbarPM.type, appObjects);
  }
}

/**
 * Creates a new SnackbarPM instance
 * @param appObject The application object
 * @returns A new SnackbarPM instance
 */
export function makeSnackbarPM(appObject: AppObject): SnackbarPM {
  return new SnackbarPMImp(appObject);
}

/**
 * Implementation of SnackbarPM
 * Manages the view model transformation and updates
 */
class SnackbarPMImp extends SnackbarPM {
  /**
   * Gets the cached singleton instance of SnackbarRepo
   */
  private get snackbarRepo() {
    return this.getCachedSingleton<SnackbarRepo>(SnackbarRepo.type);
  }

  /**
   * Compares two view models for equality
   * @param a First view model
   * @param b Second view model
   * @returns True if the view models are equal, false otherwise
   */
  vmsAreEqual(a: SnackbarVM, b: SnackbarVM): boolean {
    if (a.message !== b.message) return false;
    if (a.durationInSeconds !== b.durationInSeconds) return false;
    if (a.actionButtonText !== b.actionButtonText) return false;
    return true;
  }

  /**
   * Updates the view model based on the current snackbar state
   * Called whenever the snackbar repository changes
   */
  private updateView(): void {
    let model: SnackbarVM = {
      message: undefined,
      durationInSeconds: 0,
      actionButtonText: undefined
    };

    const snackbar = this.snackbarRepo?.getCurrentSnackbar();

    if (snackbar) {
      model = {
        message: snackbar.message,
        durationInSeconds: snackbar.durationInSeconds,
        actionButtonText: snackbar.snackbarAction
          ? snackbar.snackbarAction.actionButtonText
          : undefined
      };
    }

    this.doUpdateView(model);
  }

  /**
   * Creates a new SnackbarPMImp instance
   * @param appObject The application object
   */
  constructor(appObject: AppObject) {
    super(appObject, SnackbarPM.type);

    this.updateView(); // Initialize the lastVM
    this.snackbarRepo?.addChangeObserver(this.updateView.bind(this));
    this.appObjects.registerSingleton(this);
  }
}

/**
 * Default empty view model used when no snackbar is active
 */
export const defaultSnackbarVM: SnackbarVM = {
  message: undefined,
  durationInSeconds: 0,
  actionButtonText: undefined
};
