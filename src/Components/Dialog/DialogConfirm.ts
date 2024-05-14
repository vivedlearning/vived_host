import { DialogBase } from "./DialogBase";

export interface DialogConfirmDTO {
  message: string;
  title: string;
  confirmButtonLabel: string;
  cancelButtonLabel: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export const confirmDialogType = "CONFIRM";

export class DialogConfirm extends DialogBase {
  readonly type = confirmDialogType;

  readonly title: string;
  readonly message: string;
  readonly confirmButtonLabel: string;
  readonly cancelButtonLabel: string;

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

  constructor(data: DialogConfirmDTO) {
    super(confirmDialogType);
    this.confirmButtonLabel = data.confirmButtonLabel;
    this.cancelButtonLabel = data.cancelButtonLabel;
    this.message = data.message;
    this.title = data.title;
    this.postCancel = data.onCancel;
    this.postConfirm = data.onConfirm;
  }
}
