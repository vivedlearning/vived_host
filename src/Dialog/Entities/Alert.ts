import { AppObject, AppObjectRepo, MemoizedBoolean } from "@vived/core";
import { Dialog } from "./DialogQueue";

export interface DialogAlertDTO {
  message: string;
  title: string;
  buttonLabel: string;
  onClose?: () => void;
  preventOutsideDismiss?: boolean;
}

export const alertDialogType = "ALERT";

export class AlertDialogEntity extends Dialog {
  static type = "AlertDialogEntity";

  static get(
    assetID: string,
    appObjects: AppObjectRepo
  ): AlertDialogEntity | undefined {
    const appObject = appObjects.get(assetID);
    if (!appObject) {
      appObjects.submitWarning(
        "AlertDialogEntity.get",
        "Unable to find app object"
      );
      return undefined;
    }

    const uc = appObject.getComponent<AlertDialogEntity>(
      AlertDialogEntity.type
    );
    if (!uc) {
      appObjects.submitWarning(
        "AlertDialogEntity.get",
        "App Object does not have AlertDialogEntity"
      );
      return undefined;
    }

    return uc;
  }

  readonly dialogType = alertDialogType;
  readonly title: string;
  readonly message: string;
  readonly buttonLabel: string;
  readonly preventOutsideDismiss: boolean = false;
  hasBeenClosed: boolean = false;

  private postClose?: () => void;
  close = () => {
    this.hasBeenClosed = true;
    this.isOpen = false;
    if (this.postClose) {
      this.postClose();
    }
  };

  private _isOpen = new MemoizedBoolean(false, this.notifyOnChange);
  get isOpen(): boolean {
    return this._isOpen.val;
  }
  set isOpen(val: boolean) {
    this._isOpen.val = val;
  }

  constructor(data: DialogAlertDTO, appObject: AppObject) {
    super(appObject, AlertDialogEntity.type);
    this.buttonLabel = data.buttonLabel;
    this.message = data.message;
    this.title = data.title;
    this.postClose = data.onClose;
    if (data.preventOutsideDismiss !== undefined) {
      this.preventOutsideDismiss = data.preventOutsideDismiss;
    }
  }
}
