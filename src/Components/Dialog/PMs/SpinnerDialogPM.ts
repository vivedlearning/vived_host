import { AppObject, AppObjectPM, AppObjectRepo } from "@vived/core";
import { SpinnerDialogEntity } from "../Entities";

export interface SpinnerDialogVM {
  message: string;
  title: string;
}

export abstract class SpinnerDialogPM extends AppObjectPM<SpinnerDialogVM> {
  static type = "SpinnerDialogPM";

  static get(
    assetID: string,
    appObjects: AppObjectRepo
  ): SpinnerDialogPM | undefined {
    const appObject = appObjects.get(assetID);
    if (!appObject) {
      appObjects.submitWarning(
        "SpinnerDialogPM.get",
        "Unable to find app object"
      );
      return undefined;
    }

    const pm = appObject.getComponent<SpinnerDialogPM>(SpinnerDialogPM.type);
    if (!pm) {
      appObjects.submitWarning(
        "SpinnerDialogPM.get",
        "App Object does not have SpinnerDialogPM"
      );
      return undefined;
    }

    return pm;
  }
}

export function makeSpinnerDialogPM(appObject: AppObject): SpinnerDialogPM {
  return new SpinnerDialogPMImp(appObject);
}

class SpinnerDialogPMImp extends SpinnerDialogPM {
  private dialog?: SpinnerDialogEntity;

  vmsAreEqual(a: SpinnerDialogVM, b: SpinnerDialogVM): boolean {
    if (a.message !== b.message) return false;
    if (a.title !== b.title) return false;

    return true;
  }

  onAlertChange = () => {
    if (!this.dialog) return;

    this.doUpdateView({
      message: this.dialog.message,
      title: this.dialog.title
    });
  };

  constructor(appObject: AppObject) {
    super(appObject, SpinnerDialogPM.type);

    this.dialog = appObject.getComponent<SpinnerDialogEntity>(
      SpinnerDialogEntity.type
    );
    if (!this.dialog) {
      this.error(
        "PM added to an app object that does not have a DialogSpinnerEntity"
      );
      return;
    }

    this.dialog.addChangeObserver(this.onAlertChange);
    this.onAlertChange();
  }
}

export const defaultSpinnerDialogVM: SpinnerDialogVM = {
  message: "Default spinner message",
  title: "Spinner"
};
