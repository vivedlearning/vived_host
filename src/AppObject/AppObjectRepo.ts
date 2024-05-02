import { ObservableEntity, ObserverList } from "../Entities";
import { AppObject, makeAppObject } from "./AppObject";
import { AppObjectComponent } from "./AppObjectComponent";

export abstract class AppObjectRepo extends ObservableEntity {
  abstract has(appObjectID: string): boolean;
  abstract add(appObject: AppObject): void;
  abstract remove(appObjectID: string): void;
  abstract get(appObjectID: string): AppObject | undefined;
  abstract getOrCreate(appObjectID: string): AppObject;
  abstract getAll(): AppObject[];

  abstract submitLog(sender: string, message: string): void;
  abstract submitWarning(sender: string, message: string): void;
  abstract submitError(sender: string, message: string): void;
  abstract submitFatal(sender: string, message: string): void;

  abstract registerSingleton(component: AppObjectComponent): void;
  abstract getSingleton<T extends AppObjectComponent>(
    type: string
  ): T | undefined;

  abstract getAppObjectComponent<T extends AppObjectComponent>(
    appObjectID: string,
    type: string
  ): T | undefined;
  abstract getAllAppObjectsWithComponent(componentType: string): AppObject[];
  abstract getAllComponents<T extends AppObjectComponent>(type: string): T[];

  abstract addAppObjectAddedObserver: (
    observer: (addedEntity: AppObject) => void
  ) => void;
  abstract removeAppObjectAddedObserver: (
    observer: (addedEntity: AppObject) => void
  ) => void;

  abstract addAppObjectRemovedObserver: (
    observer: (addedEntity: AppObject) => void
  ) => void;
  abstract removedAppObjectRemovedObserver: (
    observer: (addedEntity: AppObject) => void
  ) => void;
}

export function makeAppObjectRepo(): AppObjectRepo {
  return new AppObjectRepoImp();
}

class AppObjectRepoImp extends AppObjectRepo {
  private appObjectLookup = new Map<string, AppObject>();
  private singletons = new Map<string, AppObjectComponent>();

  private onAppObjectAddedObserver = new ObserverList<AppObject>();
  addAppObjectAddedObserver = (observer: (addedEntity: AppObject) => void) => {
    this.onAppObjectAddedObserver.add(observer);
  };
  removeAppObjectAddedObserver = (
    observer: (addedEntity: AppObject) => void
  ): void => {
    this.onAppObjectAddedObserver.remove(observer);
  };

  private onAppObjectRemovedObservers = new ObserverList<AppObject>();
  addAppObjectRemovedObserver = (
    observer: (removedEntity: AppObject) => void
  ) => {
    this.onAppObjectRemovedObservers.add(observer);
  };
  removedAppObjectRemovedObserver = (
    observer: (removedEntity: AppObject) => void
  ): void => {
    this.onAppObjectRemovedObservers.remove(observer);
  };

  has = (id: string): boolean => {
    return this.appObjectLookup.has(id);
  };

  add = (appObject: AppObject) => {
    const existing = this.appObjectLookup.get(appObject.id);
    if (existing) {
      existing.removeObserver(this.notify);
    }

    this.appObjectLookup.set(appObject.id, appObject);
    appObject.addObserver(this.notify);
    this.notify();
    this.onAppObjectAddedObserver.notify(appObject);
  };

  remove = (id: string) => {
    const existing = this.appObjectLookup.get(id);
    if (!existing) return;

    this.appObjectLookup.delete(id);
    existing.removeObserver(this.notify);
    this.notify();
    this.onAppObjectRemovedObservers.notify(existing);
  };

  get = (id: string): AppObject | undefined => {
    return this.appObjectLookup.get(id);
  };

  getOrCreate = (id: string): AppObject => {
    const existing = this.appObjectLookup.get(id);

    if (!existing) {
      return makeAppObject(id, this);
    } else {
      return existing;
    }
  };

  getAll = (): AppObject[] => {
    return Array.from(this.appObjectLookup.values());
  };

  getAllAppObjectsWithComponent(componentType: string): AppObject[] {
    const rArray: AppObject[] = [];

    this.appObjectLookup.forEach((appObj) => {
      if (appObj.hasComponent(componentType)) {
        rArray.push(appObj);
      }
    });

    return rArray;
  }

  getAllComponents<T extends AppObjectComponent>(type: string): T[] {
    const rArray: T[] = [];

    this.appObjectLookup.forEach((appObj) => {
      const aoEntity = appObj.getComponent(type);
      if (aoEntity) {
        rArray.push(aoEntity as T);
      }
    });

    return rArray;
  }

  getAppObjectComponent<T extends AppObjectComponent>(
    id: string,
    entityType: string
  ): T | undefined {
    const ao = this.appObjectLookup.get(id);
    if (!ao) {
      return undefined;
    }

    return ao.getComponent(entityType) as T;
  }

  submitLog(sender: string, message: string): void {
    console.log(`[${sender}]: ${message}`);
  }
  submitWarning(sender: string, message: string): void {
    console.warn(`[${sender}]: ${message}`);
  }
  submitError(sender: string, message: string): void {
    console.error(`[${sender}]: ${message}`);
  }
  submitFatal(sender: string, message: string): void {
    console.error(`FATAL ERROR - [${sender}]: ${message}`);
  }

  registerSingleton(component: AppObjectComponent): void {
    if (this.singletons.has(component.type)) {
      this.submitWarning(
        "AppObjectRepo",
        `Singleton for type ${component.type} already exists. Relpacing`
      );
    }

    this.singletons.set(component.type, component);
  }

  getSingleton<T extends AppObjectComponent>(type: string): T | undefined {
    if (this.singletons.has(type)) {
      return this.singletons.get(type) as T;
    }

    const components = this.getAllComponents<AppObjectComponent>(type);
    if (components.length === 1) {
      this.singletons.set(components[0].type, components[0]);
      return components[0] as T;
    } else if (components.length === 0) {
      this.submitWarning(
        "AppObjectRepo",
        `Unable to find a singleton for ${type}`
      );
      return undefined;
    } else if (components.length > 1) {
      this.submitWarning(
        "AppObjectRepo",
        `Multiple ${type} found. There should only be one if it truly a singleton. Using the first one`
      );
      return components[0] as T;
    }
  }
}
