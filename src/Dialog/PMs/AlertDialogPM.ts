import { AppObject, AppObjectPM, AppObjectRepo } from "@vived/core";
import { AlertDialogEntity } from "../Entities";

export interface AlertDialogVM {
  message: string;
  title: string;
  buttonLabel: string;
  close: () => void;
}

export const defaultAlertDialogVM: AlertDialogVM = {
  message: "",
  buttonLabel: "",
  close: () => {
    // empty
  },
  title: ""
};

export abstract class AlertDialogPM extends AppObjectPM<AlertDialogVM> {
  static type = "AlertDialogPM";

  static get(id: string, appObjects: AppObjectRepo): AlertDialogPM | undefined {
    const appObject = appObjects.get(id);
    if (!appObject) {
      appObjects.submitWarning(
        "AlertDialogPM.get",
        "Unable to find app object"
      );
      return undefined;
    }

    const pm = appObject.getComponent<AlertDialogPM>(AlertDialogPM.type);
    if (!pm) {
      appObjects.submitWarning(
        "AlertDialogPM.get",
        "App Object does not have AlertDialogPM"
      );
      return undefined;
    }

    return pm;
  }
}

export function makeAlertDialogPM(appObject: AppObject): AlertDialogPM {
  return new AlertDialogPMImp(appObject);
}

class AlertDialogPMImp extends AlertDialogPM {
  private alert?: AlertDialogEntity;

  vmsAreEqual(a: AlertDialogVM, b: AlertDialogVM): boolean {
    if (a.message !== b.message) return false;
    if (a.title !== b.title) return false;
    if (a.buttonLabel !== b.buttonLabel) return false;

    return true;
  }

  onAlertChange = () => {
    if (!this.alert) return;

    this.doUpdateView({
      buttonLabel: this.alert.buttonLabel,
      close: this.alert.close,
      message: this.alert.message,
      title: this.alert.title
    });
  };

  constructor(appObject: AppObject) {
    super(appObject, AlertDialogPM.type);

    this.alert = appObject.getComponent<AlertDialogEntity>(
      AlertDialogEntity.type
    );
    if (!this.alert) {
      this.error(
        "PM added to an app object that does not have a DialogAlertEntity"
      );
      return;
    }

    this.alert.addChangeObserver(this.onAlertChange);
    this.onAlertChange();
  }
}
