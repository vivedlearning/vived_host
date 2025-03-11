import {
  AppObject,
  AppObjectEntity,
  AppObjectRepo,
  getSingletonComponent
} from "@vived/core";

export interface Snackbar {
  message: string;
  durationInSeconds: number;
  snackbarAction?: SnackbarAction;
}

export interface SnackbarAction {
  actionButtonText: string;
  action: () => void;
}

export type SnackbarObserver = (snackbar: Snackbar | undefined) => void;

export abstract class SnackbarRepo extends AppObjectEntity {
  static type = "SnackbarRepo";

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<SnackbarRepo>(SnackbarRepo.type, appObjects);
  }

  abstract makeSnackbar(
    message: string,
    snackbarAction?: SnackbarAction,
    durationInSeconds?: number
  ): void;
  abstract getCurrentSnackbar(): Snackbar | undefined;
  abstract dismissActiveSnackbar(): void;
  abstract callActiveSnackbarAction(): void;
}

export function makeSnackbarRepo(appObject: AppObject): SnackbarRepo {
  return new SnackbarRepoImp(appObject);
}

class SnackbarRepoImp extends SnackbarRepo {
  private snackbarQueue: Snackbar[];
  private defaultDurationInSeconds: number;
  private monitoringSnackbarTime: boolean = false;

  constructor(appObject: AppObject, defaultDurationInSeconds: number = 4) {
    super(appObject, SnackbarRepo.type);
    this.snackbarQueue = [];
    this.defaultDurationInSeconds = defaultDurationInSeconds;
    this.appObjects.registerSingleton(this);
  }

  makeSnackbar = (
    message: string,
    snackbarAction?: SnackbarAction | undefined,
    durationInSeconds?: number | undefined
  ): void => {
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
  };

  getCurrentSnackbar = (): Snackbar | undefined => {
    return this.snackbarQueue.length > 0 ? this.snackbarQueue[0] : undefined;
  };

  dismissActiveSnackbar = () => {
    if (this.snackbarQueue.length > 0) {
      this.snackbarQueue.splice(0, 1);
      this.notifyOnChange();
    }
  };

  callActiveSnackbarAction = () => {
    const currentSnackbar = this.getCurrentSnackbar();
    if (currentSnackbar) {
      if (currentSnackbar.snackbarAction) {
        currentSnackbar.snackbarAction.action();
        this.dismissActiveSnackbar();
      }
    }
  };

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
