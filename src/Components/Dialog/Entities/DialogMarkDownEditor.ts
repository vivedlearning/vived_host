import { MemoizedBoolean } from '../../../Entities';
import { HostAppObject, HostAppObjectEntity, HostAppObjectRepo } from '../../../HostAppObject';
import { Dialog } from './DialogQueue';

export interface DialogMarkDownEditorDTO {
  initialText: string;
  onConfirm: (text: string) => void;
}

export const markDownEditorDialogType = 'MARKDOWN_EDITOR';

export class DialogMarkDownEntity extends Dialog {
  static type = 'DialogMarkDownEntity';

  static get(assetID: string, appObjects: HostAppObjectRepo): DialogMarkDownEntity | undefined {
    const appObject = appObjects.get(assetID);
    if (!appObject) {
      appObjects.submitWarning('DialogMarkDownEntity.get', 'Unable to find app object');
      return undefined;
    }

    const uc = appObject.getComponent<DialogMarkDownEntity>(DialogMarkDownEntity.type);
    if (!uc) {
      appObjects.submitWarning('DialogMarkDownEntity.get', 'App Object does not have DialogAlertEntity');
      return undefined;
    }

    return uc;
  }

  readonly dialogType = markDownEditorDialogType;
  readonly initialText: string;
  readonly preventOutsideDismiss = true;

  cancel = () => {
    this.isOpen = false;
  };

  private postConfirm: (text: string) => void;
  confirm = (text: string) => {
    this.isOpen = false;
    this.postConfirm(text);
  };

  private _isOpen = new MemoizedBoolean(false, this.notifyOnChange);
  get isOpen(): boolean {
    return this._isOpen.val;
  }
  set isOpen(val: boolean) {
    this._isOpen.val = val;
  }

  constructor(data: DialogMarkDownEditorDTO, appObject: HostAppObject) {
    super(appObject, DialogMarkDownEntity.type);
    this.initialText = data.initialText;
    this.postConfirm = data.onConfirm;
  }
}
