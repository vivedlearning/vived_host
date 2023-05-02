import { DialogBase } from './DialogBase';

export interface DialogMarkDownEditorDTO {
  initialText: string;
  onConfirm: (text: string) => void;
}

export const markDownEditorDialogType = 'MARKDOWN_EDITOR';

export class DialogMarkDownEditor extends DialogBase {
  readonly type = markDownEditorDialogType;

  readonly initialText: string;

  cancel = () => {
    this.isOpen = false;
  };

  private postConfirm: (text: string) => void;
  confirm = (text: string) => {
    this.isOpen = false;
    this.postConfirm(text);
  };

  constructor(data: DialogMarkDownEditorDTO) {
    super(markDownEditorDialogType);
    this.initialText = data.initialText;
    this.postConfirm = data.onConfirm;
  }
}
