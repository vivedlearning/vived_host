import { DialogBase } from "./DialogBase";

export interface DialogAlertDTO {
  message: string;
  title: string;
  buttonLabel: string;
  onClose?: () => void;
  preventOutsideDismiss?: boolean;
}

export const alertDialogType = "ALERT"

export class DialogAlert extends DialogBase {
  readonly type = alertDialogType;

  readonly title: string;
  readonly message: string;
  readonly buttonLabel: string;

  private postClose?: ()=>void;
  close = () => {
    this.isOpen = false;
    if(this.postClose)
    {
      this.postClose();
    }
  };

  constructor(data: DialogAlertDTO) {
    super(alertDialogType);
    this.buttonLabel = data.buttonLabel;
    this.message = data.message;
    this.title = data.title;
    this.postClose = data.onClose;
    if(data.preventOutsideDismiss !== undefined)
    {
      this.preventOutsideDismiss = data.preventOutsideDismiss;
    }
  }
}
