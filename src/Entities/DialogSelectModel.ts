import { DialogBase } from './DialogBase';
import { MemoizedBoolean } from './MemoizedBoolean';

export const selectModelDialogType = 'SELECT_CHANNEL_MODEL';

export class DialogSelectModel extends DialogBase {
  preventOutsideDismiss: boolean = false;
  protected _container?: HTMLElement;
  get container(): HTMLElement | undefined {
    return this._container;
  }

  set container(element: HTMLElement | undefined) {
    this._container = element;
    this.notify();
  }

  protected memoizedIsReady = new MemoizedBoolean(false, this.notify);
  get isReady(): boolean {
    return this.memoizedIsReady.val;
  }
  set isReady(isReady: boolean) {
    this.memoizedIsReady.val = isReady;
  }

  constructor() {
    super(selectModelDialogType);
  }
}
