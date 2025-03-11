import {
  AppObject,
  AppObjectPM,
  AppObjectRepo,
  getSingletonComponent
} from "@vived/core";
import { SnackbarRepo } from "../Entities/SnackbarRepo";

export interface SnackbarVM {
  message: string | undefined;
  durationInSeconds: number;
  actionButtonText: string | undefined;
}

export abstract class SnackbarPM extends AppObjectPM<SnackbarVM> {
  static type = "SnackbarPM";

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<SnackbarPM>(SnackbarPM.type, appObjects);
  }
}

export function makeSnackbarPM(appObject: AppObject): SnackbarPM {
  return new SnackbarPMImp(appObject);
}

class SnackbarPMImp extends SnackbarPM {
  private get snackbarRepo() {
    return this.getCachedSingleton<SnackbarRepo>(SnackbarRepo.type);
  }

  vmsAreEqual(a: SnackbarVM, b: SnackbarVM): boolean {
    if (a.message !== b.message) return false;
    if (a.durationInSeconds !== b.durationInSeconds) return false;
    if (a.actionButtonText !== b.actionButtonText) return false;
    return true;
  }

  private updateView = (): void => {
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
  };

  constructor(appObject: AppObject) {
    super(appObject, SnackbarPM.type);

    this.updateView(); // Initialize the lastVM
    this.snackbarRepo?.addChangeObserver(this.updateView);
    this.appObjects.registerSingleton(this);
  }
}

export const defaultSnackbarVM: SnackbarVM = {
  message: undefined,
  durationInSeconds: 0,
  actionButtonText: undefined
};
