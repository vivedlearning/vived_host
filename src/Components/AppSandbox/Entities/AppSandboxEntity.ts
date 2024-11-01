import { MemoizedBoolean } from "../../../Entities";
import { getSingletonComponent, HostAppObject, HostAppObjectEntity, HostAppObjectRepo } from "../../../HostAppObject";
import { AppEntity, makeAppEntity } from "../../Apps";

export enum SandboxState {
  UNMOUNTED = "UNMOUNTED",
  LOADING = "LOADING",
  MOUNTED = "MOUNTED",
  PLAYING = "PLAYING",
  FATAL_ERROR = "FATAL_ERROR",
  EDIT_ASSET = "EDIT_ASSET",
  NEW_APP_ASSET = "NEW_APP_ASSET"
}

export abstract class AppSandboxEntity extends HostAppObjectEntity {
  static type = "AppSandboxEntity";

  abstract get appID(): string;

  abstract get appContainer(): HTMLDivElement | undefined;
  abstract set appContainer(container: HTMLDivElement | undefined);

  abstract get channelID(): string;
  abstract set channelID(id: string);
  
  abstract get channelName(): string;
  abstract set channelName(id: string);

  abstract get state(): SandboxState;
  abstract set state(val: SandboxState);

  abstract get startInZSpace(): boolean;
  abstract set startInZSpace(val: boolean);

  abstract get showBabylonInspector(): boolean;
  abstract set showBabylonInspector(render: boolean);

  abstract get enableDevFeatures(): boolean;
  abstract set enableDevFeatures(enable: boolean);

  abstract devFeatures: string[];

  abstract readonly app: AppEntity;

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<AppSandboxEntity>(
      AppSandboxEntity.type,
      appObjects
    );
  }
}

export function makeAppSandboxEntity(
  appObject: HostAppObject
): AppSandboxEntity {
  return new AppSandboxEntityImp(appObject);
}

class AppSandboxEntityImp extends AppSandboxEntity {
  readonly app: AppEntity;

  get appID() {
    return this.appObject.id;
  }

  mockActivityID = "74ec8149-ced4-44b7-a4e4-5238593ab36f";
  channelID = "abad8cd4-6379-4325-a7c0-3679c358ebe6";
  channelName = "Development Channel";

  private memoizedStartInZSpace = new MemoizedBoolean(
    false,
    this.notifyOnChange
  );
  get startInZSpace() {
    return this.memoizedStartInZSpace.val;
  }
  set startInZSpace(val: boolean) {
    this.memoizedStartInZSpace.val = val;
  }

  private _playerContainer?: HTMLDivElement | undefined;
  get appContainer() {
    return this._playerContainer;
  }
  set appContainer(container: HTMLDivElement | undefined) {
    if (container === this._playerContainer) return;
    this._playerContainer = container;
    this.notifyOnChange();
  }

  private memoizedShowInspector = new MemoizedBoolean(
    false,
    this.notifyOnChange
  );
  get showBabylonInspector() {
    return this.memoizedShowInspector.val;
  }
  set showBabylonInspector(val: boolean) {
    this.memoizedShowInspector.val = val;
  }

  private memoisedEnableDevFeatures = new MemoizedBoolean(
    true,
    this.notifyOnChange
  );
  get enableDevFeatures(): boolean {
    return this.memoisedEnableDevFeatures.val;
  }
  set enableDevFeatures(val: boolean) {
    this.memoisedEnableDevFeatures.val = val;
  }
  devFeatures: string[] = [];

  private _state = SandboxState.UNMOUNTED;
  get state(): SandboxState {
    return this._state;
  }
  set state(val: SandboxState) {
    if (this._state === val) return;

    this._state = val;
    this.notifyOnChange();
  }

  constructor(appObject: HostAppObject) {
    super(appObject, AppSandboxEntity.type);
    this.app = makeAppEntity(appObject);
    this.appObjects.registerSingleton(this);
  }
}
