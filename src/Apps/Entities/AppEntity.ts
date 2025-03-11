import {
  AppObject,
  AppObjectEntity,
  AppObjectRepo,
  Version
} from "@vived/core";

export enum AppState {
  INIT = "INIT",
  LOADING = "LOADING",
  READY = "READY",
  ERROR = "ERROR"
}

export abstract class AppEntity extends AppObjectEntity {
  static type = "AppEntity";

  static get(id: string, appObjects: AppObjectRepo) {
    const ao = appObjects.get(id);
    if (!ao) {
      appObjects.submitWarning(
        "AppEntity.get",
        `Unable to find app object by ID: ${id}`
      );
      return;
    }

    return ao.getComponent<AppEntity>(AppEntity.type);
  }

  abstract get id(): string;
  abstract name: string;
  abstract description: string;
  abstract image_url: string;
  abstract versions: Version[];
  abstract get latestVersion(): Version | undefined;
  abstract errorMessage?: string;
  abstract get hasError(): boolean;
  abstract state: AppState;
  abstract assignedToOwner: boolean;

  abstract get isMounted(): boolean;
  abstract appAssetFolderURL?: string;
  abstract get updateIsAvailable(): boolean | undefined;
  abstract styles: string[];
  abstract mountedVersion: Version | undefined;
}

export function makeAppEntity(appObject: AppObject): AppEntity {
  return new AppEntityImp(appObject);
}

class AppEntityImp extends AppEntity {
  get id() {
    return this.appObject.id;
  }

  name: string = "";
  description: string = "";
  image_url: string = "";

  versions: Version[] = [];

  get latestVersion(): Version | undefined {
    return Version.GetLatest(this.versions);
  }

  private _mountedVersion: Version | undefined;
  get mountedVersion() {
    return this._mountedVersion;
  }
  set mountedVersion(val: Version | undefined) {
    if (this._mountedVersion === val) return;

    this._mountedVersion = val;
    this.notifyOnChange();
  }

  get updateIsAvailable(): boolean | undefined {
    if (this._mountedVersion === undefined) return undefined;
    if (this.latestVersion === undefined) return undefined;

    return Version.AreEqual(this._mountedVersion, this.latestVersion)
      ? false
      : true;
  }

  private _state: AppState = AppState.INIT;
  get state() {
    return this._state;
  }
  set state(val: AppState) {
    this._state = val;
    this.notifyOnChange();
  }

  private _assignedToOwner: boolean = false;
  get assignedToOwner(): boolean {
    return this._assignedToOwner;
  }
  set assignedToOwner(val: boolean) {
    this._assignedToOwner = val;
    this.notifyOnChange();
  }

  get isMounted(): boolean {
    return this._mountedVersion === undefined ? false : true;
  }

  styles: string[] = [];
  appAssetFolderURL: string | undefined;

  private _errorMsg?: string;
  get errorMessage() {
    return this._errorMsg;
  }
  set errorMessage(val: string | undefined) {
    if (this._errorMsg === val) return;

    this._errorMsg = val;
    this.notifyOnChange();
  }
  get hasError(): boolean {
    return this._errorMsg === undefined ? false : true;
  }

  constructor(appObject: AppObject) {
    super(appObject, AppEntity.type);
  }
}
