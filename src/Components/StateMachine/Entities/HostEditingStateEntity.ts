import { MemoizedBoolean } from "@vived/core";
import {
  getSingletonComponent,
  AppObject,
  AppObjectEntity,
  AppObjectRepo
} from "@vived/core";
import { HostStateEntity, StateDTO } from "./HostStateEntity";
import { HostStateMachine } from "./HostStateMachine";

export abstract class HostEditingStateEntity extends AppObjectEntity {
  static type = "HostEditingStateEntity";

  abstract get isEditing(): boolean;
  abstract get isNewState(): boolean;
  abstract get editingState(): HostStateEntity | undefined;
  abstract get somethingHasChanged(): boolean;
  abstract stateValidationMessage?: string;

  abstract startNewState(): HostStateEntity | undefined;
  abstract startEditing(state: HostStateEntity): void;
  abstract cancelEditState(): void;
  abstract finishEditing(): void;

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<HostEditingStateEntity>(
      HostEditingStateEntity.type,
      appObjects
    );
  }
}

export function makeHostEditingStateEntity(
  appObject: AppObject
): HostEditingStateEntity {
  return new HostEditingStateEntityImp(appObject);
}

class HostEditingStateEntityImp extends HostEditingStateEntity {
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

  private get hostStateMachine() {
    return this.getCachedSingleton<HostStateMachine>(HostStateMachine.type);
  }

  private memoizedSomethingHasChanged = new MemoizedBoolean(
    false,
    this.notifyOnChange
  );
  get somethingHasChanged(): boolean {
    return this.memoizedSomethingHasChanged.val;
  }

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

  private onStateEntityChange = (): void => {
    this.memoizedSomethingHasChanged.val = this.checkForChange();
  };

  get isEditing(): boolean {
    return this._editingState !== undefined;
  }

  private _editingState?: HostStateEntity;

  get editingState() {
    return this._editingState;
  }

  private originalStateData?: StateDTO;

  startNewState = (): HostStateEntity | undefined => {
    if (!this.hostStateMachine) return;

    this.originalStateData = undefined;
    this._isNewState = true;
    this._editingState = this.hostStateMachine.createNewState();
    this._editingState.addChangeObserver(this.onStateEntityChange);
    this.memoizedSomethingHasChanged.val = true;

    return this._editingState;
  };

  startEditing = (state: HostStateEntity): void => {
    this._editingState = state;

    this.originalStateData = state.getDTO();
    this._editingState.addChangeObserver(this.onStateEntityChange);

    this.notifyOnChange();
  };

  cancelEditState = (): void => {
    if (!this._editingState) return;

    if (this.originalStateData) {
      this._editingState.setDTO(this.originalStateData);
    } else {
      this.hostStateMachine?.deleteState(this._editingState.id);
    }

    this.resetInternalState();
  };

  finishEditing = (): void => {
    this.resetInternalState();
  };

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
