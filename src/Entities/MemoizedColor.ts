import { Color } from "../ValueObjects";

export class MemoizedColor {
  private _val: Color;

  get val(): Color {
    return this._val;
  }

  set val(v: Color) {
    if (Color.Equal(v, this._val)) return;

    this._val = v;
    this.onChangeCallback();
  }

  public setValQuietly(val: Color) {
    this._val = val;
  }

  private onChangeCallback: () => void;

  constructor(initialValue: Color, onChangeCallback: () => void) {
    this._val = initialValue;
    this.onChangeCallback = onChangeCallback;
  }
}
