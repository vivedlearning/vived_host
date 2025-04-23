import {
  AppObject,
  AppObjectEntity,
  AppObjectRepo,
  Version,
  MemoizedString
} from "@vived/core";

/**
 * Enum representing the possible states of an application
 *
 * @enum {string}
 * @property {string} INIT - Initial state before app loading starts
 * @property {string} LOADING - App is currently loading resources
 * @property {string} READY - App is loaded and ready to use
 * @property {string} ERROR - App encountered an error during loading
 */
export enum AppState {
  INIT = "INIT",
  LOADING = "LOADING",
  READY = "READY",
  ERROR = "ERROR"
}

/**
 * AppEntity - Core entity representing an application in the system
 *
 * This abstract class defines the properties and behaviors of an application.
 * It manages app state, versioning, mounting status, and error handling.
 *
 * @extends AppObjectEntity from @vived/core
 */
export abstract class AppEntity extends AppObjectEntity {
  /** Type identifier for the AppEntity component */
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
  abstract imageAssetId: string | undefined;
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

/**
 * Factory function to create a new AppEntity instance
 *
 * @param appObject - The app object to attach the entity to
 * @returns A concrete implementation of AppEntity
 */
export function makeAppEntity(appObject: AppObject): AppEntity {
  return new AppEntityImp(appObject);
}

class AppEntityImp extends AppEntity {
  get id() {
    return this.appObject.id;
  }

  private _memoizedName: MemoizedString = new MemoizedString(
    "",
    this.notifyOnChange
  );

  get name(): string {
    return this._memoizedName.val;
  }

  set name(val: string) {
    this._memoizedName.val = val;
  }

  private _memoizedDescription: MemoizedString = new MemoizedString(
    "",
    this.notifyOnChange
  );

  get description(): string {
    return this._memoizedDescription.val;
  }

  set description(val: string) {
    this._memoizedDescription.val = val;
  }

  private _memoizedImageUrl: MemoizedString = new MemoizedString(
    "",
    this.notifyOnChange
  );

  get image_url(): string {
    return this._memoizedImageUrl.val;
  }

  set image_url(val: string) {
    this._memoizedImageUrl.val = val;
  }

  private _memoizedImageAssetId = new MemoizedString("", this.notifyOnChange);

  get imageAssetId(): string | undefined {
    const value = this._memoizedImageAssetId.val;
    return value === "" ? undefined : value;
  }

  set imageAssetId(val: string | undefined) {
    this._memoizedImageAssetId.val = val ?? "";
  }

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
