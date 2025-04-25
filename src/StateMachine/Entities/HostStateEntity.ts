import { MemoizedString } from "@vived/core";
import { AppObject, AppObjectEntity, AppObjectRepo } from "@vived/core";

/**
 * Defines the types of challenge responses that can be expected in a state
 * These represent different feedback mechanisms available to the user
 */
export enum ChallengeResponse {
  NONE = "NONE", // No specific response expected
  SCORE = "SCORE", // Numeric score-based response
  HIT = "HIT", // Binary hit/miss response
  MULTIHIT = "MULTIHIT", // Multiple hit targets response
  PROGRESS = "PROGRESS", // Continuous progress response
  QUALITY = "QUALITY" // Quality-rated response
}

/**
 * Defines the loading states for streaming assets in a state
 */
export enum StreamState {
  INIT = "INIT", // Initial state before loading
  LOADING = "LOADING", // Assets are currently loading
  READY = "READY", // Assets have loaded successfully
  ERROR = "ERROR" // Error occurred during loading
}

/**
 * Data Transfer Object for serializing/deserializing state data
 * Used for persistence, state management, and undo/redo operations
 */
export interface StateDTO {
  id: string; // Unique identifier for the state
  name: string; // Display name for the state
  data: object; // Custom state data - structure depends on app implementation
  assets: string[]; // Array of asset IDs referenced by this state
  response: string | undefined; // Expected challenge response type
  appID: string; // ID of the app this state belongs to
}

/**
 * HostStateEntity represents a single state within a state machine.
 *
 * Each state contains:
 * - Metadata (name, ID)
 * - References to assets needed by the state
 * - Custom state data specific to the app implementation
 * - Expected response type for challenge/interaction
 *
 * States are managed by the HostStateMachine and can be persisted/restored
 * through the DTO pattern.
 *
 * This is a core component of the VIVED platform's state-based application model,
 * allowing apps to define discrete states with specific content and behaviors.
 */
export abstract class HostStateEntity extends AppObjectEntity {
  static type = "HostStateEntity";

  /** Unique identifier for this state */
  abstract get id(): string;

  /** Human-readable name of the state */
  abstract name: string;

  /** List of asset IDs required by this state */
  abstract assets: string[];

  /** Type of response expected from user interactions in this state */
  abstract expectedResponse: ChallengeResponse | undefined;

  /** ID of the app this state belongs to */
  abstract appID: string;

  /** Current loading state for streaming assets */
  abstract streamState: StreamState;

  /**
   * Serializes the state to a plain object for persistence
   * @returns StateDTO containing all state data
   */
  abstract getDTO(): StateDTO;

  /**
   * Deserializes from a DTO and updates this state's properties
   * @param dto The state data transfer object to apply
   */
  abstract setDTO(dto: StateDTO): void;

  /**
   * Gets the custom state data object
   * Structure is specific to the app implementation
   */
  abstract get stateData(): object;

  /**
   * Updates the custom state data object
   * @param val New state data object
   * @param checkForChange If true, only notifies observers when actual changes occur
   */
  abstract setStateData(val: object, checkForChange?: boolean): void;

  /**
   * Gets an existing HostStateEntity by ID
   * @param id The unique identifier for the state
   * @param appObjects The app object repository
   * @returns The state entity if found, undefined otherwise
   */
  static get(id: string, appObjects: AppObjectRepo) {
    const ao = appObjects.get(id);
    return ao?.getComponent<HostStateEntity>(HostStateEntity.type);
  }
}

/**
 * Factory function for creating a HostStateEntity instance
 * @param appObject The AppObject to associate with this entity
 * @returns A new HostStateEntity instance
 */
export function makeHostStateEntity(appObject: AppObject): HostStateEntity {
  return new HostStateEntityImp(appObject);
}

/**
 * Implementation of the HostStateEntity abstract class
 * Provides concrete implementation of state properties and methods
 */
class HostStateEntityImp extends HostStateEntity {
  /**
   * The unique identifier for this state
   * Derived from the associated AppObject ID
   */
  get id(): string {
    return this.appObject.id;
  }

  /**
   * Memoized name property with change notification
   * Uses MemoizedString to efficiently track changes
   */
  private memoizedName = new MemoizedString("", this.notifyOnChange);
  get name(): string {
    return this.memoizedName.val;
  }
  set name(val: string) {
    this.memoizedName.val = val;
  }

  /**
   * Custom state data object
   * This is app-specific data that defines the state behavior
   */
  private _data = {};
  get stateData(): object {
    return this._data;
  }

  /**
   * Updates the state data, optionally checking if it actually changed
   * @param val New state data
   * @param checkForChange If true, only notifies on actual changes
   */
  setStateData(val: object, checkForChange?: boolean): void {
    let notify = true;
    if (checkForChange) {
      const currentData = JSON.stringify(this._data);
      const newData = JSON.stringify(val);

      if (currentData === newData) {
        notify = false;
      }
    }

    this._data = val;
    if (notify) {
      this.notifyOnChange();
    }
  }

  /**
   * Array of asset IDs required by this state
   * Assets are loaded before the state becomes active
   */
  private _assets: string[] = [];
  get assets() {
    return [...this._assets];
  }
  set assets(val: string[]) {
    if (val.length !== this._assets.length) {
      this._assets = val;
      this.notifyOnChange();
      return;
    }

    let somethingHasChanged = false;
    val.forEach((newAsset, i) => {
      const existingAsset = this._assets[i];
      if (existingAsset !== newAsset) {
        somethingHasChanged = true;
      }
    });

    if (!somethingHasChanged) {
      return;
    }

    this._assets = val;
    this.notifyOnChange();
  }

  /**
   * Type of response expected from user interactions
   * Determines how challenge results are processed
   */
  private _expectedResponse: ChallengeResponse | undefined;
  get expectedResponse() {
    return this._expectedResponse;
  }
  set expectedResponse(val: ChallengeResponse | undefined) {
    if (val === this._expectedResponse) return;

    this._expectedResponse = val;
    this.notifyOnChange();
  }

  /**
   * Serializes state to a data transfer object
   * Used for persistence and state management
   */
  getDTO(): StateDTO {
    return {
      id: this.id,
      assets: [...this._assets],
      data: this._data,
      name: this.memoizedName.val,
      response: this._expectedResponse,
      appID: this.appID
    };
  }

  /**
   * Applies state data from a DTO
   * Used when restoring state or rolling back changes
   * @param dto The data transfer object to apply
   */
  setDTO(dto: StateDTO): void {
    if (dto.id !== this.id) {
      this.warn("DTO id does not match my ID. Skipping");
      return;
    }

    this.setStateData(dto.data, true);
    this.assets = [...dto.assets];
    this.memoizedName.val = dto.name;
    this.memoisedAppID.val = dto.appID;

    if ((Object as any).values(ChallengeResponse).includes(dto.response)) {
      this.expectedResponse = dto.response as ChallengeResponse;
    } else {
      this.expectedResponse = undefined;
    }
  }

  /**
   * ID of the app this state belongs to
   * States can only be used with their associated app
   */
  private memoisedAppID = new MemoizedString("", this.notifyOnChange);
  get appID(): string {
    return this.memoisedAppID.val;
  }
  set appID(val: string) {
    this.memoisedAppID.val = val;
  }

  /**
   * Current loading state for streaming assets
   * Used to track progress when loading assets for this state
   */
  private memoizedStreamState = new MemoizedString(
    StreamState.INIT,
    this.notifyOnChange
  );
  get streamState(): StreamState {
    return this.memoizedStreamState.val as StreamState;
  }
  set streamState(val: StreamState) {
    this.memoizedStreamState.val = val;
  }

  constructor(appObject: AppObject) {
    super(appObject, HostStateEntity.type);
  }
}
