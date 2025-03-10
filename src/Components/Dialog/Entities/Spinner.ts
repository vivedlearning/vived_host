import {
  AppObject,
  AppObjectRepo,
  MemoizedBoolean,
  MemoizedString
} from "@vived/core";
import { Dialog } from "./DialogQueue";

export const spinnerDialogType = "SPINNER";

export interface DialogSpinnerDTO {
  message: string;
  title: string;
}

export class SpinnerDialogEntity extends Dialog {
  static type = "SpinnerDialogEntity";

  static get(
    assetID: string,
    appObjects: AppObjectRepo
  ): SpinnerDialogEntity | undefined {
    const appObject = appObjects.get(assetID);
    if (!appObject) {
      appObjects.submitWarning(
        "SpinnerDialogEntity.get",
        "Unable to find app object"
      );
      return undefined;
    }

    const uc = appObject.getComponent<SpinnerDialogEntity>(
      SpinnerDialogEntity.type
    );
    if (!uc) {
      appObjects.submitWarning(
        "SpinnerDialogEntity.get",
        "App Object does not have SpinnerDialogEntity"
      );
      return undefined;
    }

    return uc;
  }

  readonly dialogType = spinnerDialogType;
  readonly mininumuLifespan = 2000;
  readonly title: string;
  private createdAt?: number;

  readonly preventOutsideDismiss = true;

  private memoizedMessage: MemoizedString;
  get message(): string {
    return this.memoizedMessage.val;
  }
  set message(val: string) {
    this.memoizedMessage.val = val;
  }

  private _isOpen = new MemoizedBoolean(false, this.notifyOnChange);
  set isOpen(open: boolean) {
    if (open && this.createdAt === undefined) {
      this.createdAt = Date.now();
    }
    this._isOpen.val = open;
  }
  get isOpen() {
    return this._isOpen.val;
  }

  close = () => {
    if (this.createdAt === undefined) {
      this.isOpen = false;
      return;
    }

    const timeAlive = Date.now() - this.createdAt;
    const timeleft = this.mininumuLifespan - timeAlive;

    if (timeleft <= 0) {
      this.isOpen = false;
    } else {
      setTimeout(() => {
        this.isOpen = false;
      }, timeleft);
    }
  };

  constructor(data: DialogSpinnerDTO, appObject: AppObject) {
    super(appObject, SpinnerDialogEntity.type);
    this.memoizedMessage = new MemoizedString(
      data.message,
      this.notifyOnChange
    );
    this.title = data.title;
  }
}
