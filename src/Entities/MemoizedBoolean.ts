export class MemoizedBoolean {
  private _val: boolean;
  get val(): boolean {
    return this._val;
  }
  set val(b: boolean) {
    if (this._val === b) return;

    this._val = b;
    this.onChangeCallback();
  }
  private onChangeCallback: () => void;

  constructor(initialValue: boolean, onChangeCallback: () => void) {
    this._val = initialValue;
    this.onChangeCallback = onChangeCallback;
  }
}
