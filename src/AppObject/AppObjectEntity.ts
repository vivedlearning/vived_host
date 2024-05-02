import { ObserverList } from "../Entities";
import { AppObject } from "./AppObject";
import { AppObjectComponent } from "./AppObjectComponent";

export type AppObjectEntityObserver = () => void;

export class AppObjectEntity extends AppObjectComponent {
  private onDisposeObserverList = new ObserverList<void>();
  addOnDisposeObserver = (observer: AppObjectEntityObserver) => {
    this.onDisposeObserverList.add(observer);
  };
  removeOnDisposeObserver = (observer: AppObjectEntityObserver): void => {
    this.onDisposeObserverList.remove(observer);
  };

  private onChangeObserverList = new ObserverList<void>();
  addChangeObserver = (observer: AppObjectEntityObserver): void => {
    this.onChangeObserverList.add(observer);
  };
  removeChangeObserver = (observer: AppObjectEntityObserver): void => {
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

  constructor(appObject: AppObject, type: string) {
    super(appObject, type)
    
    this.addChangeObserver(appObject.notify);
  }
}
