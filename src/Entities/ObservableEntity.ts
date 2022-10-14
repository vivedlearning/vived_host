import { ObserverList } from "./ObserverList";

export type EntityObserver = () => void;

export abstract class ObservableEntity {
  private observerList = new ObserverList<void>();

  addObserver = (observer: EntityObserver): void => {
    this.observerList.add(observer);
  };
  removeObserver = (observer: EntityObserver): void => {
    this.observerList.remove(observer);
  };
  notify = () => {
    this.observerList.notify();
  };
}
