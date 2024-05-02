import { ObserverList } from '../Entities';
import { HostAppObject } from './HostAppObject';
import { HostAppObjectComponent } from './HostAppObjectComponent';

export type HostAppObjectEntityObserver = () => void;

export class HostAppObjectEntity extends HostAppObjectComponent {
  private onDisposeObserverList = new ObserverList<void>();
  addOnDisposeObserver = (observer: HostAppObjectEntityObserver) => {
    this.onDisposeObserverList.add(observer);
  };
  removeOnDisposeObserver = (observer: HostAppObjectEntityObserver): void => {
    this.onDisposeObserverList.remove(observer);
  };

  private onChangeObserverList = new ObserverList<void>();
  addChangeObserver = (observer: HostAppObjectEntityObserver): void => {
    this.onChangeObserverList.add(observer);
  };
  removeChangeObserver = (observer: HostAppObjectEntityObserver): void => {
    this.onChangeObserverList.remove(observer);
  };

  notifyOnChange = () => {
    this.onChangeObserverList.notify();
  };

  dispose() {
    this.removeChangeObserver(this.appObject.notify);

    this.onDisposeObserverList.notify();
    this.onChangeObserverList.clear();
    this.onDisposeObserverList.clear();

    super.dispose();
  }

  constructor(appObject: HostAppObject, type: string) {
    super(appObject, type);

    this.addChangeObserver(appObject.notify);
  }
}
