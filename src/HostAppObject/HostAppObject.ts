import { ObservableEntity } from '../Entities';
import { HostAppObjectComponent } from './HostAppObjectComponent';
import { HostAppObjectRepo } from './HostAppObjectRepo';

export abstract class HostAppObject extends ObservableEntity {
  abstract readonly id: string;
  abstract readonly appObjectRepo: HostAppObjectRepo;

  abstract hasComponent(type: string): boolean;
  abstract addComponent(component: HostAppObjectComponent): void;
  abstract getComponent<T extends HostAppObjectComponent>(type: string): T | undefined;
  abstract removeComponent(type: string): void;
  abstract allComponents(): HostAppObjectComponent[];

  abstract dispose(): void;
}

export function makeAppObject(id: string, repo: HostAppObjectRepo): HostAppObject {
  return new AppObjectImp(id, repo);
}

class AppObjectImp extends HostAppObject {
  readonly id: string;
  readonly appObjectRepo: HostAppObjectRepo;

  private componentLookup = new Map<string, HostAppObjectComponent>();

  hasComponent(type: string): boolean {
    return this.componentLookup.has(type);
  }

  addComponent(component: HostAppObjectComponent): void {
    const currentComponent = this.componentLookup.get(component.type);
    if (currentComponent) {
      console.warn(`[AppObject] Component ${component.type} is being replaced on ${this.id}`);
      currentComponent.dispose();
    }

    this.componentLookup.set(component.type, component);
    this.notify();
  }

  getComponent<T extends HostAppObjectComponent>(type: string): T | undefined {
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

  allComponents(): HostAppObjectComponent[] {
    return Array.from(this.componentLookup.values());
  }

  dispose = (): void => {
    const components = Array.from(this.componentLookup.values());
    this.componentLookup.clear();
    components.forEach((c) => c.dispose());

    if (this.appObjectRepo.has(this.id)) {
      this.appObjectRepo.remove(this.id);
    }
  };

  constructor(id: string, repo: HostAppObjectRepo) {
    super();
    this.id = id;
    this.appObjectRepo = repo;
    this.appObjectRepo.add(this);
  }
}
