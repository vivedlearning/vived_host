import { MemoizedBoolean } from "@vived/core";
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

  constructor(appObject: AppObject) {
    super(appObject, ZSpaceHostEntity.type);
    this.appObjects.registerSingleton(this);
  }
}
