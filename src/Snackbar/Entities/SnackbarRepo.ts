import {
  AppObject,
  AppObjectEntity,
  AppObjectRepo,
  getSingletonComponent
} from "@vived/core";

/**
 * Represents a snackbar notification with a message, duration, and optional action
 */
export interface Snackbar {
  /** The text message to display in the snackbar */
  message: string;
  /** How long the snackbar should be displayed before auto-dismissing (in seconds) */
  durationInSeconds: number;
  /** Optional action button and callback for the snackbar */
  snackbarAction?: SnackbarAction;
}

/**
 * Represents an action button for a snackbar
 */
export interface SnackbarAction {
  /** The text to display on the action button */
  actionButtonText: string;
  /** Callback function to execute when the action button is clicked */
  action: () => void;
}

/**
 * Observer type for snackbar state changes
 */
export type SnackbarObserver = (snackbar: Snackbar | undefined) => void;

/**
 * Repository for managing snackbar notifications
 * Handles creating, displaying, and dismissing snackbars
 */
export abstract class SnackbarRepo extends AppObjectEntity {
  static type = "SnackbarRepo";

  /**
   * Gets the singleton instance of SnackbarRepo
   * @param appObjects The application object repository
   * @returns The SnackbarRepo instance or undefined if not found
   */
  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<SnackbarRepo>(SnackbarRepo.type, appObjects);
  }

  /**
   * Creates and displays a new snackbar notification
   * @param message The message to display
   * @param snackbarAction Optional action button and callback
   * @param durationInSeconds Optional duration in seconds before auto-dismissing
   */
  abstract makeSnackbar(
    message: string,
    snackbarAction?: SnackbarAction,
    durationInSeconds?: number
  ): void;

  /**
   * Gets the currently active snackbar, if any
   * @returns The current snackbar or undefined if none is active
   */
  abstract getCurrentSnackbar(): Snackbar | undefined;

  /**
   * Dismisses the currently active snackbar, if any
   */
  abstract dismissActiveSnackbar(): void;

  /**
   * Executes the action of the currently active snackbar, if it has one
   * Also dismisses the snackbar after executing the action
   */
  abstract callActiveSnackbarAction(): void;
}

/**
 * Creates a new SnackbarRepo instance
 * @param appObject The application object
 * @returns A new SnackbarRepo instance
 */
export function makeSnackbarRepo(appObject: AppObject): SnackbarRepo {
  return new SnackbarRepoImp(appObject);
}

/**
 * Implementation of SnackbarRepo
 * Handles the queue of snackbars and their timing
 */
class SnackbarRepoImp extends SnackbarRepo {
  /** Queue of snackbars to display */
  private snackbarQueue: Snackbar[];
  /** Default duration for snackbars if not specified */
  private defaultDurationInSeconds: number;
  /** Flag to prevent multiple timing loops from running */
  private monitoringSnackbarTime: boolean = false;

  /**
   * Creates a new SnackbarRepoImp instance
   * @param appObject The application object
   * @param defaultDurationInSeconds Default duration for snackbars (default: 4 seconds)
   */
  constructor(appObject: AppObject, defaultDurationInSeconds: number = 4) {
    super(appObject, SnackbarRepo.type);
    this.snackbarQueue = [];
    this.defaultDurationInSeconds = defaultDurationInSeconds;
    this.appObjects.registerSingleton(this);
  }

  /**
   * Creates and displays a new snackbar notification
   * @param message The message to display
   * @param snackbarAction Optional action button and callback
   * @param durationInSeconds Optional duration in seconds before auto-dismissing
   */
  makeSnackbar(
    message: string,
    snackbarAction?: SnackbarAction | undefined,
    durationInSeconds?: number | undefined
  ): void {
    if (message.trim().length === 0) {
      this.warn("Snackbar must have a message");
      return;
    }

    if (snackbarAction && snackbarAction.actionButtonText.trim().length === 0) {
      this.warn(
        "If a Snackbar has an action then the action button text cannot be empty"
      );
      return;
    }

    const duration = durationInSeconds ?? this.defaultDurationInSeconds;
    if (duration <= 0) {
      this.warn(`${duration} is an invalid duration for a Snackbar`);
      return;
    }

    const snackbar: Snackbar = {
      message,
      durationInSeconds: duration,
      snackbarAction
    };

    this.snackbarQueue.push(snackbar);
    this.notifyOnChange();
    this.monitorSnackbarTime();

    return;
  }

  /**
   * Gets the currently active snackbar, if any
   * @returns The current snackbar or undefined if none is active
   */
  getCurrentSnackbar(): Snackbar | undefined {
    return this.snackbarQueue.length > 0 ? this.snackbarQueue[0] : undefined;
  }

  /**
   * Dismisses the currently active snackbar, if any
   */
  dismissActiveSnackbar(): void {
    if (this.snackbarQueue.length > 0) {
      this.snackbarQueue.splice(0, 1);
      this.notifyOnChange();
    }
  }

  /**
   * Executes the action of the currently active snackbar, if it has one
   * Also dismisses the snackbar after executing the action
   */
  callActiveSnackbarAction(): void {
    const currentSnackbar = this.getCurrentSnackbar();
    if (currentSnackbar) {
      if (currentSnackbar.snackbarAction) {
        currentSnackbar.snackbarAction.action();
        this.dismissActiveSnackbar();
      }
    }
  }

  /**
   * Monitors the timing of snackbars to auto-dismiss them when their duration expires
   * Uses a loop that checks each snackbar's remaining time
   */
  private async monitorSnackbarTime() {
    if (this.monitoringSnackbarTime) {
      return;
    }

    const loopFrequencyInSeconds: number = 0.1;
    this.monitoringSnackbarTime = true;

    while (this.snackbarQueue.length > 0) {
      const currentSnackbar = this.getCurrentSnackbar();
      if (currentSnackbar) {
        let currentTimeout = currentSnackbar.durationInSeconds;
        while (
          this.getCurrentSnackbar() === currentSnackbar &&
          currentTimeout > 0
        ) {
          // tslint:disable-next-line:no-shadowed-variable
          await new Promise((resolve) =>
            setTimeout(resolve, loopFrequencyInSeconds * 1000)
          );
          currentTimeout -= loopFrequencyInSeconds;
        }
        if (
          this.getCurrentSnackbar() === currentSnackbar &&
          currentTimeout <= 0
        ) {
          this.dismissActiveSnackbar();
        }
      }
    }
    this.monitoringSnackbarTime = false;
  }
}
