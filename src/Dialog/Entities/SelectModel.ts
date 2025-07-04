import { AppObject, AppObjectRepo, MemoizedBoolean } from "@vived/core";
import { Dialog } from "./DialogQueue";

export const selectModelDialogType = "SELECT_CHANNEL_MODEL";

export class SelectModelDialogEntity extends Dialog {
  static type = "SelectModelDialogEntity";

  static get(
    assetID: string,
    appObjects: AppObjectRepo
  ): SelectModelDialogEntity | undefined {
    const appObject = appObjects.get(assetID);
    if (!appObject) {
      appObjects.submitWarning(
        "SelectModelDialogEntity.get",
        "Unable to find app object"
      );
      return undefined;
    }

    const uc = appObject.getComponent<SelectModelDialogEntity>(
      SelectModelDialogEntity.type
    );
    if (!uc) {
      appObjects.submitWarning(
        "SelectModelDialogEntity.get",
        "App Object does not have SelectModelDialogEntity"
      );
      return undefined;
    }

    return uc;
  }

  readonly dialogType = selectModelDialogType;
  hasBeenClosed: boolean = false;

  private _isOpen = new MemoizedBoolean(false, this.notifyOnChange);
  get isOpen(): boolean {
    return this._isOpen.val;
  }
  set isOpen(val: boolean) {
    this._isOpen.val = val;
  }

  preventOutsideDismiss: boolean = true;
  protected _container?: HTMLElement;
  get container(): HTMLElement | undefined {
    return this._container;
  }

  set container(element: HTMLElement | undefined) {
    this._container = element;
    this.notifyOnChange();
  }

  protected memoizedIsReady = new MemoizedBoolean(false, this.notifyOnChange);
  get isReady(): boolean {
    return this.memoizedIsReady.val;
  }
  set isReady(isReady: boolean) {
    this.memoizedIsReady.val = isReady;
  }

  constructor(appObject: AppObject) {
    super(appObject, SelectModelDialogEntity.type);
  }
}
