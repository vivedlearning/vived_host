export class MemoizedString {
  private _val: string;
  get val(): string {
    return this._val;
  }
  set val(b: string) {
    if (this._val === b) return;

    this._val = b;
    this.onChangeCallback();
  }
  private onChangeCallback: () => void;

  constructor(initialValue: string, onChangeCallback: () => void) {
    this._val = initialValue;
    this.onChangeCallback = onChangeCallback;
  }
}
