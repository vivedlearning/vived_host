import { getSingletonComponent, HostAppObject, HostAppObjectPM, HostAppObjectRepo } from "../../../HostAppObject";
import { AppSandboxEntity, SandboxState } from "../Entities/AppSandboxEntity";


export abstract class SandboxStatePM extends HostAppObjectPM<SandboxState> {
  static type = "SandboxStatePM";

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<SandboxStatePM>(
      SandboxStatePM.type,
      appObjects
    );
  }
}

export function makeSandboxStatePM(appObject: HostAppObject): SandboxStatePM {
  return new SandboxStatePMImp(appObject);
}

class SandboxStatePMImp extends SandboxStatePM {
  private get sandbox() {
    return this.getCachedSingleton<AppSandboxEntity>(AppSandboxEntity.type);
  }

  vmsAreEqual(a: SandboxState, b: SandboxState): boolean {
    return a === b;
  }

  onEntityChange = () => {
    if (!this.sandbox) return;

    this.doUpdateView(this.sandbox.state);
  };

  constructor(appObject: HostAppObject) {
    super(appObject, SandboxStatePM.type);
    this.appObjects.registerSingleton(this);

    this.sandbox?.addChangeObserver(this.onEntityChange);
    this.onEntityChange();
  }
}
