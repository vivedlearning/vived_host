import { AppObject, AppObjectPM, AppObjectRepo } from "@vived/core";
import { ConfirmDialogEntity } from "../Entities";

export interface ConfirmDialogVM {
  message: string;
  title: string;
  cancelButtonLabel: string;
  confirmButtonLabel: string;
  cancel: () => void;
  confirm: () => void;
}

export abstract class ConfirmDialogPM extends AppObjectPM<ConfirmDialogVM> {
  static type = "ConfirmDialogPM";

  static get(
    id: string,
    appObjects: AppObjectRepo
  ): ConfirmDialogPM | undefined {
    const appObject = appObjects.get(id);
    if (!appObject) {
      appObjects.submitWarning(
        "ConfirmDialogPM.get",
        "Unable to find app object"
      );
      return undefined;
    }

    const pm = appObject.getComponent<ConfirmDialogPM>(ConfirmDialogPM.type);
    if (!pm) {
      appObjects.submitWarning(
        "ConfirmDialogPM.get",
        "App Object does not have ConfirmDialogPM"
      );
      return undefined;
    }

    return pm;
  }
}

export function makeConfirmDialogPM(appObject: AppObject): ConfirmDialogPM {
  return new ConfirmDialogPMImp(appObject);
}

class ConfirmDialogPMImp extends ConfirmDialogPM {
  private dialog?: ConfirmDialogEntity;

  vmsAreEqual(a: ConfirmDialogVM, b: ConfirmDialogVM): boolean {
    if (a.message !== b.message) return false;
    if (a.title !== b.title) return false;
    if (a.cancelButtonLabel !== b.cancelButtonLabel) return false;
    if (a.confirmButtonLabel !== b.confirmButtonLabel) return false;

    return true;
  }

  onAlertChange = () => {
    if (!this.dialog) return;

    this.doUpdateView({
      confirmButtonLabel: this.dialog.confirmButtonLabel,
      cancelButtonLabel: this.dialog.cancelButtonLabel,
      cancel: this.dialog.cancel,
      message: this.dialog.message,
      title: this.dialog.title,
      confirm: this.dialog.confirm
    });
  };

  constructor(appObject: AppObject) {
    super(appObject, ConfirmDialogPM.type);

    this.dialog = appObject.getComponent<ConfirmDialogEntity>(
      ConfirmDialogEntity.type
    );
    if (!this.dialog) {
      this.error(
        "PM added to an app object that does not have a DialogConfirmEntity"
      );
      return;
    }

    this.dialog.addChangeObserver(this.onAlertChange);
    this.onAlertChange();
  }
}

export const defaultConfirmDialogVM: ConfirmDialogVM = {
  message: "Generic confirm message",
  title: "Confirm",
  cancel: () => {
    console.warn("[ConfirmDialogVM.cancel] default VM");
  },
  cancelButtonLabel: "",
  confirm: () => {
    console.warn("[ConfirmDialogVM.confirm] default VM");
  },
  confirmButtonLabel: ""
};
