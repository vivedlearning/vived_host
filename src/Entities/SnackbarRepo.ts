import { reject, resolve, Result } from '../ValueObjects/Result';
import { ObserverList } from './ObserverList';

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

export interface SnackbarRepo {
  makeSnackbar: (message: string, snackbarAction?: SnackbarAction, durationInSeconds?: number) => Result<null, Error>;
  getCurrentSnackbar: () => Snackbar | undefined;
  dismissActiveSnackbar: () => void;
  callActiveSnackbarAction: () => void;
  addObserver: (observer: SnackbarObserver) => void;
  removeObserver: (observer: SnackbarObserver) => void;
}

export function makeSnackbarRepo(): SnackbarRepo {
  return new SnackbarRepoImp();
}

class SnackbarRepoImp implements SnackbarRepo {
  private snackbarQueue: Snackbar[];
  private defaultDurationInSeconds: number;
  private monitoringSnackbarTime: boolean = false;
  private observers = new ObserverList<Snackbar | undefined>();

  constructor(defaultDurationInSeconds: number = 4) {
    this.snackbarQueue = [];
    this.defaultDurationInSeconds = defaultDurationInSeconds;
  }

  makeSnackbar = (
    message: string,
    snackbarAction?: SnackbarAction | undefined,
    durationInSeconds?: number | undefined,
  ): Result<null, Error> => {
    if (message.trim().length === 0) {
      const err = new Error('Snackbar must have a message');
      return reject(err);
    }

    if (snackbarAction && snackbarAction.actionButtonText.trim().length === 0) {
      const err = new Error('If a Snackbar has an action then the action button text cannot be empty');
      return reject(err);
    }

    const duration = durationInSeconds ?? this.defaultDurationInSeconds;
    if (duration <= 0) {
      const err = new Error(`${duration} is an invalid duration for a Snackbar`);
      return reject(err);
    }

    const snackbar: Snackbar = {
      message,
      durationInSeconds: duration,
      snackbarAction,
    };

    this.snackbarQueue.push(snackbar);
    this.observers.notify(this.getCurrentSnackbar());
    this.monitorSnackbarTime();

    return resolve(null);
  };

  getCurrentSnackbar = (): Snackbar | undefined => {
    return this.snackbarQueue.length > 0 ? this.snackbarQueue[0] : undefined;
  };

  dismissActiveSnackbar = () => {
    if (this.snackbarQueue.length > 0) {
      this.snackbarQueue.splice(0, 1);
      this.observers.notify(this.getCurrentSnackbar());
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

  addObserver = (observer: SnackbarObserver) => {
    this.observers.add(observer);
  };

  removeObserver = (observer: SnackbarObserver) => {
    this.observers.remove(observer);
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
        while (this.getCurrentSnackbar() === currentSnackbar && currentTimeout > 0) {
          // tslint:disable-next-line:no-shadowed-variable
          await new Promise((resolve) => setTimeout(resolve, loopFrequencyInSeconds * 1000));
          currentTimeout -= loopFrequencyInSeconds;
        }
        if (this.getCurrentSnackbar() === currentSnackbar && currentTimeout <= 0) {
          this.dismissActiveSnackbar();
        }
      }
    }
    this.monitoringSnackbarTime = false;
  }
}
