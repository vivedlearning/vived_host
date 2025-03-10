import { AppObject, AppObjectPM, AppObjectRepo } from "@vived/core";
import { MarkDownEditorDialogEntity } from "../Entities/MarkDownEditor";

export interface MarkDownEditorDialogVM {
  initialText: string;
  confirm: (text: string) => void;
}

export abstract class MarkDownEditorDialogPM extends AppObjectPM<MarkDownEditorDialogVM> {
  static type = "MarkDownEditorDialogPM";

  static get(
    assetID: string,
    appObjects: AppObjectRepo
  ): MarkDownEditorDialogPM | undefined {
    const appObject = appObjects.get(assetID);
    if (!appObject) {
      appObjects.submitWarning(
        "MarkDownEditorDialogPM.get",
        "Unable to find app object"
      );
      return undefined;
    }

    const pm = appObject.getComponent<MarkDownEditorDialogPM>(
      MarkDownEditorDialogPM.type
    );
    if (!pm) {
      appObjects.submitWarning(
        "MarkDownEditorDialogPM.get",
        "App Object does not have MarkDownEditorDialogPM"
      );
      return undefined;
    }

    return pm;
  }
}

export function makeMarkDownEditorDialogPM(
  appObject: AppObject
): MarkDownEditorDialogPM {
  return new MarkDownEditorDialogPMImp(appObject);
}

class MarkDownEditorDialogPMImp extends MarkDownEditorDialogPM {
  private dialog?: MarkDownEditorDialogEntity;

  vmsAreEqual(a: MarkDownEditorDialogVM, b: MarkDownEditorDialogVM): boolean {
    if (a.initialText !== b.initialText) return false;
    return true;
  }

  onAlertChange = () => {
    if (!this.dialog) return;

    this.doUpdateView({
      initialText: this.dialog.initialText,
      confirm: this.dialog.confirm
    });
  };

  constructor(appObject: AppObject) {
    super(appObject, MarkDownEditorDialogPM.type);

    this.dialog = appObject.getComponent<MarkDownEditorDialogEntity>(
      MarkDownEditorDialogEntity.type
    );
    if (!this.dialog) {
      this.error(
        "PM added to an app object that does not have a DialogMarkDownEntity"
      );
      return;
    }

    this.dialog.addChangeObserver(this.onAlertChange);
    this.onAlertChange();
  }
}

export const defaultMarkDownEditorDialogVM: MarkDownEditorDialogVM = {
  initialText: "",
  confirm: (text: string) => {
    console.warn("[MarkDownEditorDialogVM.confirm] default VM!");
  }
};
