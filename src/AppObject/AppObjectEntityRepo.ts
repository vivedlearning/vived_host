import { ObserverList } from "../Entities";
import { AppObjectEntity } from "./AppObjectEntity";

export class AppObjectEntityRepo<
  T extends AppObjectEntity
> extends AppObjectEntity {

  private entityLookup = new Map<string, T>();

  private onEntityAddedObservers = new ObserverList<T>();
  addEntityAddedObserver = (observer: (addedEntity: T) => void) => {
    this.onEntityAddedObservers.add(observer);
  };
  removeEntityAddedObserver = (observer: (addedEntity: T) => void): void => {
    this.onEntityAddedObservers.remove(observer);
  };

  private onEntityRemovedObservers = new ObserverList<T>();
  addEntityRemovedObserver = (observer: (removedEntity: T) => void) => {
    this.onEntityRemovedObservers.add(observer);
  };
  removeEntityRemovedObserver = (
    observer: (removedEntity: T) => void
  ): void => {
    this.onEntityRemovedObservers.remove(observer);
  };

  hasForAppObject = (appObjectID: string): boolean => {
    return this.entityLookup.has(appObjectID);
  };

  add(entity: T) {
    const existing = this.entityLookup.get(entity.appObject.id);
    if (existing) {
      existing.removeChangeObserver(this.notifyOnChange);
    }

    this.entityLookup.set(entity.appObject.id, entity);
    entity.addChangeObserver(this.notifyOnChange);
    this.notifyOnChange();
    this.onEntityAddedObservers.notify(entity);
  };

  removeForAppObject = (id: string) => {
    const existing = this.entityLookup.get(id);
    if (!existing) return;

    this.entityLookup.delete(id);
    existing.removeChangeObserver(this.notifyOnChange);
    this.notifyOnChange();
    this.onEntityRemovedObservers.notify(existing);
  };

  getForAppObject = (appObjectID: string): T | undefined => {
    return this.entityLookup.get(appObjectID);
  };

  getAll = (): T[] => {
    return Array.from(this.entityLookup.values());
  };
}
