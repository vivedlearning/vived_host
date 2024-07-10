import { MemoizedBoolean } from "../../../Entities";
import {
  getSingletonComponent,
  HostAppObject,
  HostAppObjectEntity,
  HostAppObjectRepo
} from "../../../HostAppObject";

export abstract class ZSpaceHostEntity extends HostAppObjectEntity {
  static type = "ZSpaceHostEntity";

  abstract get isSupported(): boolean;
  abstract set isSupported(val: boolean);

  abstract get emulate(): boolean;
  abstract set emulate(val: boolean);

  abstract get isActive(): boolean;
  abstract set isActive(val: boolean);

  abstract session: XRSession | undefined;

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<ZSpaceHostEntity>(
      ZSpaceHostEntity.type,
      appObjects
    );
  }
}

export function makeZSpaceHostEntity(
  appObject: HostAppObject
): ZSpaceHostEntity {
  return new ZSpaceHostImp(appObject);
}

class ZSpaceHostImp extends ZSpaceHostEntity {
  private memoizedIsSupported = new MemoizedBoolean(false, this.notifyOnChange);
  get isSupported(): boolean {
    return this.memoizedIsSupported.val;
  }
  set isSupported(val: boolean) {
    this.memoizedIsSupported.val = val;
  }

  private memoizedEmulate = new MemoizedBoolean(true, this.notifyOnChange);
  get emulate(): boolean {
    return this.memoizedEmulate.val;
  }
  set emulate(val: boolean) {
    this.memoizedEmulate.val = val;
  }

  private memoizedActive = new MemoizedBoolean(false, this.notifyOnChange);
  get isActive(): boolean {
    return this.memoizedActive.val;
  }
  set isActive(val: boolean) {
    this.memoizedActive.val = val;
  }

  session: XRSession | undefined;

  constructor(appObject: HostAppObject) {
    super(appObject, ZSpaceHostEntity.type);
    this.appObjects.registerSingleton(this);
  }
}
