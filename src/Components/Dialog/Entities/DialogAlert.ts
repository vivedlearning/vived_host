import { MemoizedBoolean } from '../../../Entities';
import { HostAppObject, HostAppObjectRepo } from '../../../HostAppObject';
import { Dialog } from './DialogQueue';

export interface DialogAlertDTO {
  message: string;
  title: string;
  buttonLabel: string;
  onClose?: () => void;
  preventOutsideDismiss?: boolean;
}

export const alertDialogType = 'ALERT';

export class DialogAlertEntity extends Dialog {
  static type = 'DialogAlertEntity';

  static get(assetID: string, appObjects: HostAppObjectRepo): DialogAlertEntity | undefined {
    const appObject = appObjects.get(assetID);
    if (!appObject) {
      appObjects.submitWarning('DialogAlertEntity.get', 'Unable to find app object');
      return undefined;
    }

    const uc = appObject.getComponent<DialogAlertEntity>(DialogAlertEntity.type);
    if (!uc) {
      appObjects.submitWarning('DialogAlertEntity.get', 'App Object does not have DialogAlertEntity');
      return undefined;
    }

    return uc;
  }

  readonly dialogType = alertDialogType;
  readonly title: string;
  readonly message: string;
  readonly buttonLabel: string;
  readonly preventOutsideDismiss: boolean = false;

  private postClose?: () => void;
  close = () => {
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

  constructor(data: DialogAlertDTO, appObject: HostAppObject) {
    super(appObject, DialogAlertEntity.type);
    this.buttonLabel = data.buttonLabel;
    this.message = data.message;
    this.title = data.title;
    this.postClose = data.onClose;
    if (data.preventOutsideDismiss !== undefined) {
      this.preventOutsideDismiss = data.preventOutsideDismiss;
    }
  }
}
