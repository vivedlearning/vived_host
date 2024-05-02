import { ObservableEntity } from "../Entities";
import { AppObjectComponent } from "./AppObjectComponent";
import { AppObjectRepo } from "./AppObjectRepo";

export abstract class AppObject extends ObservableEntity {
  abstract readonly id: string;
  abstract readonly appObjectRepo: AppObjectRepo;

  abstract hasComponent(type: string): boolean;
  abstract addComponent(component: AppObjectComponent): void;
  abstract getComponent<T extends AppObjectComponent>(type: string): T | undefined;
  abstract removeComponent(type: string): void;
  abstract allComponents(): AppObjectComponent[];

  abstract dispose(): void;
}

export function makeAppObject(id: string, repo: AppObjectRepo): AppObject {
  return new AppObjectImp(id, repo);
}

class AppObjectImp extends AppObject {
  readonly id: string;
  readonly appObjectRepo: AppObjectRepo;

  private componentLookup = new Map<string, AppObjectComponent>();

  hasComponent(type: string): boolean {
    return this.componentLookup.has(type);
  }

  addComponent(component: AppObjectComponent): void {
    const currentComponent = this.componentLookup.get(component.type);
    if (currentComponent) {
      console.warn(
        `[AppObject] Component ${component.type} is being replaced on ${this.id}`
      );
      currentComponent.dispose();
    }

    this.componentLookup.set(component.type, component);
    this.notify();
  }

  getComponent<T extends AppObjectComponent>(type: string): T | undefined {
    if (this.componentLookup.has(type)) {
      return this.componentLookup.get(type) as T;
    } else {
      return undefined;
    }
  }

  removeComponent(type: string): void {
    const component = this.componentLookup.get(type);

    if (!component) return;

    this.componentLookup.delete(type);
    this.notify();
  }

  allComponents(): AppObjectComponent[] {
    return Array.from(this.componentLookup.values());
  }


  dispose = (): void => {
    const components = Array.from(this.componentLookup.values());
    this.componentLookup.clear();
    components.forEach(c => c.dispose());

    if (this.appObjectRepo.has(this.id)) {
      this.appObjectRepo.remove(this.id);
    }
  };

  constructor(id: string, repo: AppObjectRepo) {
    super();
    this.id = id;
    this.appObjectRepo = repo;
    this.appObjectRepo.add(this);
  }
}
