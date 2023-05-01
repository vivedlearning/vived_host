import { DialogBase } from './DialogBase';

export interface DialogMarkDownEditorDTO {
  initialText: string;
  onConfirm?: () => void;
}

export const markDownEditorDialogType = 'MARKDOWN_EDITOR';

export class DialogMarkDownEditor extends DialogBase {
  readonly type = markDownEditorDialogType;

  readonly initialText: string;

  cancel = () => {
    this.isOpen = false;
  };

  private postConfirm?: () => void;
  confirm = () => {
    this.isOpen = false;
    if (this.postConfirm) {
      this.postConfirm();
    }
  };

  constructor(data: DialogMarkDownEditorDTO) {
    super(markDownEditorDialogType);
    this.initialText = data.initialText;
    this.postConfirm = data.onConfirm;
  }
}
