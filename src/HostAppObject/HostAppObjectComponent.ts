import { HostAppObject } from './HostAppObject';
import { HostAppObjectRepo } from './HostAppObjectRepo';

export class HostAppObjectComponent {
  readonly type: string;
  readonly appObject: HostAppObject;
  get appObjects(): HostAppObjectRepo {
    return this.appObject.appObjectRepo;
  }

  private cachedSingletons = new Map<string, HostAppObjectComponent>();
  getCachedSingleton<T extends HostAppObjectComponent>(type: string): T | undefined {
    if (!this.cachedSingletons.has(type)) {
      const component = this.appObjects.getSingleton(type);
      if (!component) {
        this.warn('Unable to get cached singleton type ' + type);
      } else {
        this.cachedSingletons.set(type, component);
      }
    }

    return this.cachedSingletons.get(type) as T;
  }

  getSingleton<T extends HostAppObjectComponent>(
    type: string,
    logType: 'LOG' | 'WARN' | 'ERROR' = 'WARN',
  ): T | undefined {
    const comp = this.appObjects.getSingleton<T>(type);

    if (!comp) {
      const msg = 'Unable to get singleton type ' + type;
      switch (logType) {
        case 'ERROR':
          this.error(msg);
          break;
        case 'LOG':
          this.log(msg);
          break;
        case 'WARN':
          this.warn(msg);
          break;
      }
    }

    return comp;
  }

  dispose() {
    if (this.appObject.getComponent(this.type) === this) {
      this.appObject.removeComponent(this.type);
    }
  }

  log(message: string) {
    this.appObjects.submitLog(`${this.appObject.id}/${this.type}`, message);
  }

  warn(message: string) {
    this.appObjects.submitWarning(`${this.appObject.id}/${this.type}`, message);
  }

  error(message: string) {
    this.appObjects.submitError(`${this.appObject.id}/${this.type}`, message);
  }

  constructor(appObject: HostAppObject, type: string) {
    this.appObject = appObject;
    this.type = type;
    appObject.addComponent(this);
  }
}
