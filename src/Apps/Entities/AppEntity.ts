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

  /**
   * Retrieves an AppEntity from a specific AppObject
   * @param appObj - The AppObject to retrieve the AppEntity from
   * @returns The AppEntity instance if found, undefined otherwise
   * @throws Error if appObj is null or undefined
   * @example
   * ```typescript
   * const appObject = appObjects.getOrCreate("myApp");
   * const appEntity = AppEntity.get(appObject);
   * ```
   */
  static get(appObj: AppObject): AppEntity | undefined {
    if (!appObj) {
      throw new Error("AppObject cannot be null or undefined");
    }
    return appObj.getComponent<AppEntity>(AppEntity.type);
  }

  /**
   * Retrieves an AppEntity by ID from the AppObjectRepo
   * @param id - The unique identifier of the app
   * @param appObjects - The AppObjectRepo to search within
   * @returns The AppEntity instance if found, undefined otherwise
   * @throws Error if id is empty or appObjects is null
   * @example
   * ```typescript
   * const appEntity = AppEntity.getById("myAppId", appObjects);
   * if (appEntity) {
   *   console.log(`Found app: ${appEntity.name}`);
   * }
   * ```
   */
  static getById(id: string, appObjects: AppObjectRepo): AppEntity | undefined {
    if (!id) {
      throw new Error("ID cannot be empty");
    }
    if (!appObjects) {
      throw new Error("AppObjectRepo cannot be null or undefined");
    }

    const ao = appObjects.get(id);
    if (!ao) {
      appObjects.submitWarning(
        "AppEntity.getById",
        `Unable to find app object by ID: ${id}`
      );
      return;
    }

    return ao.getComponent<AppEntity>(AppEntity.type);
  }

  /**
   * Safely creates an AppEntity if it doesn't already exist on the AppObject
   * @param appObject - The AppObject to add the AppEntity to
   * @returns The AppEntity instance (existing or newly created)
   * @throws Error if appObject is null or undefined
   * @example
   * ```typescript
   * const appObject = appObjects.getOrCreate("newApp");
   * const appEntity = AppEntity.addIfMissing(appObject);
   * // appEntity is guaranteed to exist
   * ```
   */
  static addIfMissing(appObject: AppObject): AppEntity {
    if (!appObject) {
      throw new Error("AppObject cannot be null or undefined");
    }

    // Check if AppEntity already exists
    const existingEntity = appObject.getComponent<AppEntity>(AppEntity.type);
    if (existingEntity) {
      return existingEntity;
    }

    // Create new AppEntity if it doesn't exist
    return makeAppEntity(appObject);
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

  private memoizedName: MemoizedString = new MemoizedString(
    "",
    this.notifyOnChange
  );

  get name(): string {
    return this.memoizedName.val;
  }

  set name(val: string) {
    this.memoizedName.val = val;
  }

  private memoizedDescription: MemoizedString = new MemoizedString(
    "",
    this.notifyOnChange
  );

  get description(): string {
    return this.memoizedDescription.val;
  }

  set description(val: string) {
    this.memoizedDescription.val = val;
  }

  private memoizedImageUrl: MemoizedString = new MemoizedString(
    "",
    this.notifyOnChange
  );

  get image_url(): string {
    return this.memoizedImageUrl.val;
  }

  set image_url(val: string) {
    this.memoizedImageUrl.val = val;
  }

  private memoizedImageAssetId = new MemoizedString("", this.notifyOnChange);

  get imageAssetId(): string | undefined {
    const value = this.memoizedImageAssetId.val;
    return value === "" ? undefined : value;
  }

  set imageAssetId(val: string | undefined) {
    this.memoizedImageAssetId.val = val ?? "";
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
