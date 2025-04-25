import { generateUniqueID, MemoizedBoolean } from "@vived/core";
import {
  getSingletonComponent,
  AppObject,
  AppObjectEntity,
  AppObjectRepo
} from "@vived/core";
import { HostStateEntity, makeHostStateEntity } from "./HostStateEntity";

/**
 * HostStateMachine manages a collection of states and controls state transitions.
 *
 * This singleton component serves as the central controller for the VIVED platform's
 * state-based application model. It maintains an ordered collection of states,
 * tracks the currently active state, and provides methods for state transitions,
 * creation, deletion, and reordering.
 *
 * The state machine can be used in both runtime and authoring modes:
 * - In runtime: For navigating between predefined states in an application
 * - In authoring: For creating and organizing states through a content editor
 *
 * This entity works closely with HostStateEntity (individual states) and
 * HostEditingStateEntity (for state authoring).
 */
export abstract class HostStateMachine extends AppObjectEntity {
  static type = "HostStateMachine";

  /** Array of all state IDs in order */
  abstract states: string[];

  /** Total number of states in the machine */
  abstract stateCount: number;

  /** ID of the currently active state, if any */
  abstract activeState: string | undefined;

  /** ID of the state preceding the active state, if any */
  abstract previousState: string | undefined;

  /** ID of the state following the active state, if any */
  abstract nextState: string | undefined;

  /** Duration of transition animations between states (in seconds) */
  abstract transitionDuration: number;

  /**
   * Sets a state as active by its ID
   * @param id ID of the state to activate
   */
  abstract setActiveStateByID: (id: string) => void;

  /**
   * Sets a state as active by its position in the states array
   * @param index Zero-based index of the state to activate
   */
  abstract setActiveStateByIndex: (index: number) => void;

  /** Deactivates the current state (no state will be active) */
  abstract clearActiveState: () => void;

  /**
   * Replaces all states with a new collection
   * @param states Array of state entities to use
   */
  abstract setStates: (states: HostStateEntity[]) => void;

  /** Creates a new empty state and adds it to the end of the states array */
  abstract createNewState: () => HostStateEntity;

  /**
   * Retrieves a state entity by its ID
   * @param id The ID of the state to retrieve
   * @returns The state entity or undefined if not found
   */
  abstract getStateByID: (id: string) => HostStateEntity | undefined;

  /**
   * Removes a state from the machine
   * @param id ID of the state to remove
   */
  abstract deleteState: (id: string) => void;

  /** Removes all states from the machine */
  abstract deleteAllStates: () => void;

  /**
   * Gets the index of a state in the states array
   * @param id ID of the state
   * @returns Zero-based index or undefined if not found
   */
  abstract getStateIndex: (id: string) => number | undefined;

  /**
   * Checks if a state with the given ID exists in the machine
   * @param id ID to check
   * @returns true if the state exists, false otherwise
   */
  abstract hasState: (id: string) => boolean;

  /**
   * Factory function for creating state entities
   * @param id ID for the new state
   * @returns A new HostStateEntity instance
   */
  abstract stateFactory: (id: string) => HostStateEntity;

  /** Activates the state before the current active state */
  abstract setPreviousStateActive: () => void;

  /** Activates the state after the current active state */
  abstract setNextStateActive: () => void;

  /**
   * Moves a state to a different position in the states array
   * @param stateID ID of the state to move
   * @param index Destination index
   */
  abstract setStateIndex: (stateID: string, index: number) => void;

  /**
   * Gets the singleton instance of HostStateMachine
   * @param appObjects The app object repository
   * @returns The HostStateMachine instance
   */
  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<HostStateMachine>(
      HostStateMachine.type,
      appObjects
    );
  }
}

/**
 * Factory function for creating a HostStateMachine instance
 * @param appObject The AppObject to associate with this entity
 * @returns A new HostStateMachine instance
 */
export function makeHostStateMachine(appObject: AppObject): HostStateMachine {
  return new HostStateMachineImp(appObject);
}

/**
 * Implementation of the HostStateMachine abstract class
 * Provides concrete implementation of state machine functionality
 */
class HostStateMachineImp extends HostStateMachine {
  /** Internal storage for state entities */
  private _states: HostStateEntity[] = [];

  /** Duration for transitions between states (in seconds) */
  transitionDuration = 1;

  /**
   * List of all state IDs in order
   * @returns Array of state IDs
   */
  get states() {
    return this._states.map((state) => state.id);
  }

  /**
   * Total number of states in the machine
   * @returns Number of states
   */
  get stateCount(): number {
    return this._states.length;
  }

  /** ID of the currently active state */
  private _activeState: string | undefined;
  get activeState() {
    return this._activeState;
  }

  /**
   * ID of the state preceding the active state
   * Returns undefined if:
   * - No active state
   * - Active state is the first state
   */
  get previousState(): string | undefined {
    if (!this._activeState) return undefined;

    const currentIndex = this.getStateIndex(this._activeState);
    if (currentIndex === undefined || currentIndex === 0) return undefined;

    return this._states[currentIndex - 1].id;
  }

  /**
   * ID of the state following the active state
   * Returns undefined if:
   * - No active state
   * - Active state is the last state
   */
  get nextState(): string | undefined {
    if (!this._activeState) return undefined;

    const currentIndex = this.getStateIndex(this._activeState);
    if (currentIndex === undefined || currentIndex >= this._states.length - 1)
      return undefined;

    return this._states[currentIndex + 1].id;
  }

  /**
   * Whether the state machine is in authoring mode
   * In authoring mode, additional editing features are enabled
   */
  private memoizedIsAuthoring = new MemoizedBoolean(false, this.notifyOnChange);
  get isAuthoring() {
    return this.memoizedIsAuthoring.val;
  }
  set isAuthoring(val: boolean) {
    this.memoizedIsAuthoring.val = val;
  }

  /** State to initially show in editing mode */
  public initialEditingState?: string;

  /**
   * Last state data that was being edited
   * Used to restore editing state when returning to editor
   */
  private _lastEditingState: object | undefined;
  get lastEditingState(): object | undefined {
    return this._lastEditingState;
  }
  set lastEditingState(val: object | undefined) {
    if (this._lastEditingState === undefined && val === undefined) return;

    const lastStateStr =
      this.lastEditingState === undefined
        ? ""
        : JSON.stringify(this.lastEditingState);
    const valStateStr = val === undefined ? "" : JSON.stringify(val);

    if (lastStateStr === valStateStr) return;

    this._lastEditingState = val;
    this.notifyOnChange();
  }

  /**
   * Tracks assets used in previous state for preloading optimization
   * Helps optimize asset loading between state transitions
   */
  private _lastAssets: string[] = [];
  get lastAssets(): string[] {
    return this._lastAssets;
  }
  set lastAssets(lastAssets: string[]) {
    this._lastAssets = lastAssets;
  }

  /** Error message for state validation failures */
  public validationErrorMessage?: string;

  /**
   * Checks if a state with the given ID exists
   * @param id ID to check
   * @returns true if state exists, false otherwise
   */
  hasState = (id: string): boolean => {
    const state = this.findStateByID(id);
    if (state) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * Sets the active state by its ID
   * @param id ID of the state to activate
   */
  setActiveStateByID = (id: string): void => {
    const state = this.findStateByID(id);

    if (!state) return;

    if (state.id === this._activeState) return;
    this._activeState = state.id;

    this.notifyOnChange();
  };

  /**
   * Sets the active state by its index in the states array
   * @param index Zero-based index of the state to activate
   */
  setActiveStateByIndex = (index: number): void => {
    if (index < 0 || index >= this._states.length) return;

    const state = this._states[index];
    this.setActiveStateByID(state.id);
  };

  /**
   * Clears the active state (no state will be active)
   */
  clearActiveState = (): void => {
    if (!this.activeState) return;

    this._activeState = undefined;
    this.notifyOnChange();
  };

  /**
   * Replaces all states with a new collection
   * @param states Array of state entities to use
   */
  setStates = (states: HostStateEntity[]): void => {
    this._states = states;
    this.notifyOnChange();
  };

  /**
   * Factory function for creating state entities
   * Creates a new AppObject with the given ID and wraps it in a HostStateEntity
   * @param id ID for the new state
   * @returns A new HostStateEntity instance
   */
  stateFactory = (id: string): HostStateEntity => {
    const ao = this.appObjects.getOrCreate(id);
    return makeHostStateEntity(ao);
  };

  /**
   * Creates a new empty state and adds it to the end of the states array
   * @returns The newly created state entity
   */
  createNewState = (): HostStateEntity => {
    const newState = this.stateFactory(generateUniqueID());

    this._states.push(newState);
    this.notifyOnChange();
    return newState;
  };

  /**
   * Gets a state entity by its ID
   * @param id ID of the state to retrieve
   * @returns The state entity or undefined if not found
   */
  getStateByID = (id: string): HostStateEntity | undefined => {
    return this.findStateByID(id);
  };

  /**
   * Deletes a state from the machine by its ID
   * Also disposes the associated AppObject
   * @param id ID of the state to delete
   */
  deleteState = (id: string): void => {
    const index = this.getStateIndex(id);

    if (index === undefined) {
      return;
    }

    const state = this.getStateByID(id);
    state?.appObject.dispose();

    this._states.splice(index, 1);
    this.notifyOnChange();
  };

  /**
   * Deletes all states from the machine
   * Also disposes all associated AppObjects
   */
  deleteAllStates = (): void => {
    if (this._states.length === 0) return;

    // Dispose all state app objects
    this._states.forEach((state) => {
      state.appObject.dispose();
    });

    this._states = [];
    this.clearActiveState();
    this.notifyOnChange();
  };

  /**
   * Gets the index of a state in the states array
   * @param id ID of the state
   * @returns Zero-based index or undefined if not found
   */
  getStateIndex = (id: string): number | undefined => {
    let index = -1;

    this._states.forEach((state, i) => {
      if (state.id === id) {
        index = i;
      }
    });

    if (index >= 0) {
      return index;
    } else {
      return undefined;
    }
  };

  /**
   * Helper method to find a state by ID
   * @param id ID to search for
   * @returns The state entity or undefined if not found
   */
  private findStateByID(id: string): HostStateEntity | undefined {
    for (const state of this._states) {
      if (state.id === id) {
        return state;
      }
    }

    return undefined;
  }

  /**
   * Activates the state before the current active state
   * Does nothing if there is no previous state
   */
  setPreviousStateActive = (): void => {
    if (!this.previousState) return;

    this.setActiveStateByID(this.previousState);
  };

  /**
   * Activates the state after the current active state
   * Does nothing if there is no next state
   */
  setNextStateActive = (): void => {
    if (!this.nextState) return;

    this.setActiveStateByID(this.nextState);
  };

  /**
   * Moves a state to a different position in the states array
   * Used for reordering states in the state machine
   * @param stateID ID of the state to move
   * @param index Destination index
   */
  setStateIndex = (stateID: string, index: number): void => {
    // Check if the state exists
    const state = this.getStateByID(stateID);
    if (!state) return;

    // Check if the index is valid
    if (index < 0 || index >= this._states.length) return;

    // Get the current index
    const currentIndex = this.getStateIndex(stateID);
    if (currentIndex === undefined) return;

    // If the index is the same, do nothing
    if (currentIndex === index) return;

    // Remove the state from the current position
    const stateToMove = this._states.splice(currentIndex, 1)[0];

    // Insert it at the new position
    this._states.splice(index, 0, stateToMove);

    // If the moved state was active, update previous and next states
    if (stateID === this._activeState) {
      this.setActiveStateByID(stateID);
    }

    this.notifyOnChange();
  };

  constructor(appObject: AppObject) {
    super(appObject, HostStateMachine.type);

    this.appObjects.registerSingleton(this);
  }
}
