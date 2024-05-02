import { ObserverList } from '../Entities';
import { HostAppObjectComponent } from './HostAppObjectComponent';

export abstract class HostAppObjectPM<T> extends HostAppObjectComponent {
  abstract vmsAreEqual(a: T, b: T): boolean;

  private _lastVM?: T;
  get lastVM(): T | undefined {
    return this._lastVM;
  }

  private observerList = new ObserverList<T>();

  addView(updateView: (vm: T) => void): void {
    this.observerList.add(updateView);

    if (this._lastVM !== undefined) {
      updateView(this._lastVM);
    }
  }

  removeView(updateView: (vm: T) => void): void {
    this.observerList.remove(updateView);
  }

  doUpdateView(vm: T) {
    if (this._lastVM && this.vmsAreEqual(this._lastVM, vm)) {
      return;
    }

    this._lastVM = vm;
    this.observerList.notify(vm);
  }

  dispose() {
    this.observerList.clear();
    if (this.appObject.getComponent(this.type) === this) {
      this.appObject.removeComponent(this.type);
    }
    super.dispose();
  }
}
