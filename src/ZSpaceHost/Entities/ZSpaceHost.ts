import { MemoizedBoolean, Version } from "@vived/core";
import {
  getSingletonComponent,
  AppObject,
  AppObjectEntity,
  AppObjectRepo
} from "@vived/core";

/**
 * ZSpaceHostEntity is a singleton entity that manages the state and functionality
 * for zSpace integration in VIVED applications.
 *
 * This entity handles:
 * 1. zSpace feature detection (isSupported)
 * 2. Emulation mode toggling (emulate)
 * 3. Active state management (isActive)
 * 4. XR Session management
 * 5. Application level enabling/disabling (isEnabled)
 * 6. App version compatibility
 *
 * Usage:
 * - To check if zSpace is available: ZSpaceHostEntity.get(appObjects)?.isSupported
 * - To check if zSpace is active: ZSpaceHostEntity.get(appObjects)?.isActive
 * - To enable/disable emulation: ZSpaceHostEntity.get(appObjects).emulate = true/false
 *
 * Important: This is a singleton entity - only one instance exists in the application.
 * Always access via ZSpaceHostEntity.get(appObjects) rather than creating new instances.
 */
export abstract class ZSpaceHostEntity extends AppObjectEntity {
  static type = "ZSpaceHostEntity";

  /**
   * Whether zSpace hardware is supported in the current environment
   */
  abstract get isSupported(): boolean;
  abstract set isSupported(val: boolean);

  /**
   * Whether zSpace is enabled at the application level
   * Can be used to conditionally enable/disable zSpace features
   */
  abstract get isEnabled(): boolean;
  abstract set isEnabled(val: boolean);

  /**
   * Whether to emulate zSpace hardware when not available
   * When true, the system will simulate zSpace capabilities
   */
  abstract get emulate(): boolean;
  abstract set emulate(val: boolean);

  /**
   * Whether zSpace is currently active
   * This is true when either real zSpace hardware is active
   * or when emulation is enabled
   */
  abstract get isActive(): boolean;
  abstract set isActive(val: boolean);

  /**
   * The current XR Session if zSpace is active
   */
  abstract session: XRSession | undefined;

  /**
   * Set the map of supported app versions for zSpace
   * @param supportedVersion Map of app IDs to minimum supported versions
   */
  abstract setSupportedAppVersions(
    supportedVersion: Map<string, Version>
  ): void;

  /**
   * Check if a specific app version is supported for zSpace
   * @param appID The ID of the app to check
   * @param version The version to check
   * @returns True if the app version is supported, false otherwise
   */
  abstract isAppSupported(appID: string, version: Version): boolean;

  /**
   * Get the singleton ZSpaceHostEntity instance
   * @param appObjects - The AppObjectRepo instance
   * @returns The ZSpaceHostEntity instance or undefined if not found
   */
  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<ZSpaceHostEntity>(
      ZSpaceHostEntity.type,
      appObjects
    );
  }
}

/**
 * Factory function to create the ZSpaceHostEntity
 * For internal use only - external code should use ZSpaceHostEntity.get()
 *
 * @param appObject - The AppObject to attach the entity to
 * @returns A new ZSpaceHostEntity instance
 */
export function makeZSpaceHostEntity(appObject: AppObject): ZSpaceHostEntity {
  return new ZSpaceHostImp(appObject);
}

/**
 * Implementation of ZSpaceHostEntity
 * Uses MemoizedBoolean for all properties to ensure proper change notifications
 */
class ZSpaceHostImp extends ZSpaceHostEntity {
  private memoizedEnabled = new MemoizedBoolean(false, this.notifyOnChange);
  get isEnabled(): boolean {
    return this.memoizedEnabled.val;
  }
  set isEnabled(val: boolean) {
    this.memoizedEnabled.val = val;
  }

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

  private supportedVersionLookup = new Map<string, Version>();
  setSupportedAppVersions(supportedVersion: Map<string, Version>): void {
    this.supportedVersionLookup = supportedVersion;
  }

  isAppSupported(appID: string, version: Version): boolean {
    const supportedVersion = this.supportedVersionLookup.get(appID);
    if (!supportedVersion) {
      return false;
    }

    if (version.major > supportedVersion.major) return true;
    if (version.major < supportedVersion.major) return false;

    if (version.minor > supportedVersion.minor) return true;
    if (version.minor < supportedVersion.minor) return false;

    if (version.patch < supportedVersion.patch) return false;

    return true;
  }

  session: XRSession | undefined;

  constructor(appObject: AppObject) {
    super(appObject, ZSpaceHostEntity.type);
    this.appObjects.registerSingleton(this);
  }
}
