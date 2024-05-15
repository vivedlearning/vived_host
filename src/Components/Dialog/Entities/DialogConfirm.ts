import { MemoizedBoolean } from '../../../Entities';
import { HostAppObject, HostAppObjectEntity, HostAppObjectRepo } from '../../../HostAppObject';
import { Dialog } from './DialogQueue';

export interface DialogConfirmDTO {
  message: string;
  title: string;
  confirmButtonLabel: string;
  cancelButtonLabel: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export const confirmDialogType = 'CONFIRM';

export class DialogConfirmEntity extends Dialog {
  static type = 'DialogConfirmEntity';

  static get(assetID: string, appObjects: HostAppObjectRepo): DialogConfirmEntity | undefined {
    const appObject = appObjects.get(assetID);
    if (!appObject) {
      appObjects.submitWarning('DialogConfirmEntity.get', 'Unable to find app object');
      return undefined;
    }

    const uc = appObject.getComponent<DialogConfirmEntity>(DialogConfirmEntity.type);
    if (!uc) {
      appObjects.submitWarning('DialogConfirmEntity.get', 'App Object does not have DialogConfirmEntity');
      return undefined;
    }

    return uc;
  }

  readonly dialogType = confirmDialogType;
  readonly title: string;
  readonly message: string;
  readonly confirmButtonLabel: string;
  readonly cancelButtonLabel: string;
  readonly preventOutsideDismiss = true;

  private postCancel?: () => void;
  cancel = () => {
    this.isOpen = false;
    if (this.postCancel) {
      this.postCancel();
    }
  };

  private postConfirm?: () => void;
  confirm = () => {
    this.isOpen = false;
    if (this.postConfirm) {
      this.postConfirm();
    }
  };

  private _isOpen = new MemoizedBoolean(false, this.notifyOnChange);
  get isOpen(): boolean {
    return this._isOpen.val;
  }
  set isOpen(val: boolean) {
    this._isOpen.val = val;
  }

  constructor(data: DialogConfirmDTO, appObject: HostAppObject) {
    super(appObject, DialogConfirmEntity.type);

    this.confirmButtonLabel = data.confirmButtonLabel;
    this.cancelButtonLabel = data.cancelButtonLabel;
    this.message = data.message;
    this.title = data.title;
    this.postCancel = data.onCancel;
    this.postConfirm = data.onConfirm;
  }
}
