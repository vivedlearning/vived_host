import { MemoizedBoolean } from "@vived/core";
import {
  getSingletonComponent,
  AppObject,
  AppObjectEntity,
  AppObjectRepo
} from "@vived/core";
import { HostStateEntity, StateDTO } from "./HostStateEntity";
import { HostStateMachine } from "./HostStateMachine";

/**
 * HostEditingStateEntity handles the editing workflow for state entities.
 *
 * This singleton component manages the process of creating new states or editing
 * existing states in the host state machine. It tracks changes made during editing,
 * maintains the original state for cancellation/rollback, and provides validation.
 *
 * The component implements a standard editing pattern:
 * 1. Start editing (startEditing) or create new (startNewState)
 * 2. Make changes to the editingState directly
 * 3. Complete with either finishEditing (commit) or cancelEditState (rollback)
 *
 * This entity is a critical part of the state authoring workflow and works closely
 * with HostStateMachine and HostStateEntity.
 */
export abstract class HostEditingStateEntity extends AppObjectEntity {
  static type = "HostEditingStateEntity";

  /** Whether currently in edit mode for a state */
  abstract get isEditing(): boolean;

  /** Whether editing a newly created state (true) or existing state (false) */
  abstract get isNewState(): boolean;

  /** The state entity currently being edited, if any */
  abstract get editingState(): HostStateEntity | undefined;

  /** Whether changes have been made since starting edit mode */
  abstract get somethingHasChanged(): boolean;

  /** Validation message if the current state is invalid, undefined if valid */
  abstract stateValidationMessage?: string;

  /**
   * Creates a new state entity and begins editing it
   * @returns The newly created state entity that's being edited
   */
  abstract startNewState(): HostStateEntity | undefined;

  /**
   * Begins editing an existing state entity
   * @param state The state entity to begin editing
   */
  abstract startEditing(state: HostStateEntity): void;

  /**
   * Cancels the current edit operation and reverts any changes
   * For new states, removes them from the state machine
   * For existing states, reverts to original values
   */
  abstract cancelEditState(): void;

  /**
   * Completes the current edit operation, keeping all changes
   * Performs no validation - validation should happen before calling this
   */
  abstract finishEditing(): void;

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<HostEditingStateEntity>(
      HostEditingStateEntity.type,
      appObjects
    );
  }
}

/**
 * Factory function for creating a HostEditingStateEntity instance
 * @param appObject The AppObject to associate with this entity
 * @returns A new HostEditingStateEntity instance
 */
export function makeHostEditingStateEntity(
  appObject: AppObject
): HostEditingStateEntity {
  return new HostEditingStateEntityImp(appObject);
}

/**
 * Implementation of the HostEditingStateEntity abstract class
 * Manages the state editing workflow and tracks changes
 */
class HostEditingStateEntityImp extends HostEditingStateEntity {
  /** Stores the original state data for reverting changes on cancel */
  private originalStateData?: StateDTO;

  private _editingState?: HostStateEntity;
  get editingState() {
    return this._editingState;
  }

  get isEditing(): boolean {
    return this._editingState !== undefined;
  }

  private _isNewState = false;
  get isNewState(): boolean {
    return this._isNewState;
  }

  private _stateValidationMessage?: string | undefined;
  get stateValidationMessage(): string | undefined {
    return this._stateValidationMessage;
  }
  set stateValidationMessage(val: string | undefined) {
    if (this._stateValidationMessage === val) return;

    this._stateValidationMessage = val;
    this.notifyOnChange();
  }

  /**
   * Reference to the HostStateMachine singleton
   * Used for creating and managing states
   */
  private get hostStateMachine() {
    return this.getCachedSingleton<HostStateMachine>(HostStateMachine.type);
  }

  /**
   * Tracks whether changes have been made to the state being edited
   * Uses a memoized value to efficiently notify observers only when value changes
   */
  private memoizedSomethingHasChanged = new MemoizedBoolean(
    false,
    this.notifyOnChange
  );
  get somethingHasChanged(): boolean {
    return this.memoizedSomethingHasChanged.val;
  }

  /**
   * Compares the current state with the original state to detect changes
   * Performs deep comparison of all relevant properties
   * @returns true if changes were detected, false otherwise
   */
  private checkForChange = () => {
    if (!this._editingState) return false;
    if (!this.originalStateData) return true;

    if (this._editingState.name !== this.originalStateData.name) return true;

    if (this._editingState.expectedResponse !== this.originalStateData.response)
      return true;

    if (
      this._editingState.assets.length !== this.originalStateData.assets.length
    )
      return true;
    let assetsHaveChanged = false;
    this._editingState.assets.forEach((currentAssetID, i) => {
      const originalAssetId = this.originalStateData!.assets[i];
      if (originalAssetId !== currentAssetID) {
        assetsHaveChanged = true;
      }
    });

    if (assetsHaveChanged) {
      return true;
    }

    const currentDataString = JSON.stringify(this._editingState.stateData);
    const originalData = JSON.stringify(this.originalStateData?.data ?? "");
    if (currentDataString !== originalData) return true;

    return false;
  };

  /**
   * Observer callback for state changes
   * Updates the somethingHasChanged flag when the state being edited changes
   */
  private onStateEntityChange = (): void => {
    this.memoizedSomethingHasChanged.val = this.checkForChange();
  };

  /**
   * Creates a new state and begins editing it
   * @returns The newly created state entity or undefined if creation failed
   */
  startNewState = (): HostStateEntity | undefined => {
    if (!this.hostStateMachine) return;

    this.originalStateData = undefined;
    this._isNewState = true;
    this._editingState = this.hostStateMachine.createNewState();
    this._editingState.addChangeObserver(this.onStateEntityChange);
    this.memoizedSomethingHasChanged.val = true;

    return this._editingState;
  };

  /**
   * Begins editing an existing state
   * @param state The state entity to edit
   */
  startEditing = (state: HostStateEntity): void => {
    this._editingState = state;

    this.originalStateData = state.getDTO();
    this._editingState.addChangeObserver(this.onStateEntityChange);

    this.notifyOnChange();
  };

  /**
   * Cancels editing and reverts changes
   * For new states, removes them from the state machine
   * For existing states, restores the original values
   */
  cancelEditState = (): void => {
    if (!this._editingState) return;

    if (this.originalStateData) {
      this._editingState.setDTO(this.originalStateData);
    } else {
      this.hostStateMachine?.deleteState(this._editingState.id);
    }

    this.resetInternalState();
  };

  /**
   * Completes editing, keeping all changes
   * Simply cleans up the internal state without reverting changes
   */
  finishEditing = (): void => {
    this.resetInternalState();
  };

  /**
   * Resets the internal state after editing is complete
   * Cleans up observers and notifies clients of the change
   */
  private resetInternalState = () => {
    if (!this._editingState) return;

    this._isNewState = false;
    this._editingState.removeChangeObserver(this.onStateEntityChange);
    this._stateValidationMessage = undefined;
    this._editingState = undefined;
    this.memoizedSomethingHasChanged.val = false;
    this.notifyOnChange();
  };

  constructor(appObject: AppObject) {
    super(appObject, HostEditingStateEntity.type);
    this.appObjects.registerSingleton(this);
  }
}
