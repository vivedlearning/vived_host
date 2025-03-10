import { AppObject, AppObjectRepo, MemoizedBoolean } from "@vived/core";
import { Dialog } from "./DialogQueue";

export interface DialogMarkDownEditorDTO {
  initialText: string;
  onConfirm: (text: string) => void;
}

export const markDownEditorDialogType = "MARKDOWN_EDITOR";

export class MarkDownEditorDialogEntity extends Dialog {
  static type = "MarkDownEditorDialogEntity";

  static get(
    assetID: string,
    appObjects: AppObjectRepo
  ): MarkDownEditorDialogEntity | undefined {
    const appObject = appObjects.get(assetID);
    if (!appObject) {
      appObjects.submitWarning(
        "MarkDownEditorDialogEntity.get",
        "Unable to find app object"
      );
      return undefined;
    }

    const uc = appObject.getComponent<MarkDownEditorDialogEntity>(
      MarkDownEditorDialogEntity.type
    );
    if (!uc) {
      appObjects.submitWarning(
        "MarkDownEditorDialogEntity.get",
        "App Object does not have DialogAlertEntity"
      );
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

  constructor(data: DialogMarkDownEditorDTO, appObject: AppObject) {
    super(appObject, MarkDownEditorDialogEntity.type);
    this.initialText = data.initialText;
    this.postConfirm = data.onConfirm;
  }
}
