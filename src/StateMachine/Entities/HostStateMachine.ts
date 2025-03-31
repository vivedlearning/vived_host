import { generateUniqueID, MemoizedBoolean } from "@vived/core";
import {
  getSingletonComponent,
  AppObject,
  AppObjectEntity,
  AppObjectRepo
} from "@vived/core";
import { HostStateEntity, makeHostStateEntity } from "./HostStateEntity";

export abstract class HostStateMachine extends AppObjectEntity {
  static type = "HostStateMachine";

  abstract states: string[];
  abstract stateCount: number;

  abstract activeState: string | undefined;
  abstract previousState: string | undefined;
  abstract nextState: string | undefined;

  abstract transitionDuration: number;

  abstract setActiveStateByID: (id: string) => void;
  abstract setActiveStateByIndex: (index: number) => void;
  abstract clearActiveState: () => void;
  abstract setStates: (states: HostStateEntity[]) => void;
  abstract createNewState: () => HostStateEntity;
  abstract getStateByID: (id: string) => HostStateEntity | undefined;
  abstract deleteState: (id: string) => void;
  abstract deleteAllStates: () => void;
  abstract getStateIndex: (id: string) => number | undefined;
  abstract hasState: (id: string) => boolean;
  abstract stateFactory: (id: string) => HostStateEntity;
  abstract setPreviousStateActive: () => void;
  abstract setNextStateActive: () => void;
  abstract setStateIndex: (stateID: string, index: number) => void;

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<HostStateMachine>(
      HostStateMachine.type,
      appObjects
    );
  }
}

export function makeHostStateMachine(appObject: AppObject): HostStateMachine {
  return new HostStateMachineImp(appObject);
}

class HostStateMachineImp extends HostStateMachine {
  private _states: HostStateEntity[] = [];

  transitionDuration = 1;

  get states() {
    return this._states.map((state) => state.id);
  }

  get stateCount(): number {
    return this._states.length;
  }

  private _activeState: string | undefined;
  get activeState() {
    return this._activeState;
  }

  get previousState(): string | undefined {
    if (!this._activeState) return undefined;
    
    const currentIndex = this.getStateIndex(this._activeState);
    if (currentIndex === undefined || currentIndex === 0) return undefined;
    
    return this._states[currentIndex - 1].id;
  }

  get nextState(): string | undefined {
    if (!this._activeState) return undefined;
    
    const currentIndex = this.getStateIndex(this._activeState);
    if (currentIndex === undefined || currentIndex >= this._states.length - 1) return undefined;
    
    return this._states[currentIndex + 1].id;
  }

  private memoizedIsAuthoring = new MemoizedBoolean(false, this.notifyOnChange);
  get isAuthoring() {
    return this.memoizedIsAuthoring.val;
  }
  set isAuthoring(val: boolean) {
    this.memoizedIsAuthoring.val = val;
  }

  public initialEditingState?: string;

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

  private _lastAssets: string[] = [];
  get lastAssets(): string[] {
    return this._lastAssets;
  }

  set lastAssets(lastAssets: string[]) {
    this._lastAssets = lastAssets;
  }

  public validationErrorMessage?: string;

  hasState = (id: string): boolean => {
    const state = this.findStateByID(id);
    if (state) {
      return true;
    } else {
      return false;
    }
  };

  setActiveStateByID = (id: string): void => {
    const state = this.findStateByID(id);

    if (!state) return;

    if (state.id === this._activeState) return;
    this._activeState = state.id;

    this.notifyOnChange();
  };

  setActiveStateByIndex = (index: number): void => {
    if (index < 0 || index >= this._states.length) return;

    const state = this._states[index];
    this.setActiveStateByID(state.id);
  };

  clearActiveState = (): void => {
    if (!this.activeState) return;

    this._activeState = undefined;
    this.notifyOnChange();
  };

  setStates = (states: HostStateEntity[]): void => {
    this._states = states;
    this.notifyOnChange();
  };

  stateFactory = (id: string): HostStateEntity => {
    const ao = this.appObjects.getOrCreate(id);
    return makeHostStateEntity(ao);
  };

  createNewState = (): HostStateEntity => {
    const newState = this.stateFactory(generateUniqueID());

    this._states.push(newState);
    this.notifyOnChange();
    return newState;
  };

  getStateByID = (id: string): HostStateEntity | undefined => {
    return this.findStateByID(id);
  };

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

  private findStateByID(id: string): HostStateEntity | undefined {
    for (const state of this._states) {
      if (state.id === id) {
        return state;
      }
    }

    return undefined;
  }

  setPreviousStateActive = (): void => {
    if (!this.previousState) return;

    this.setActiveStateByID(this.previousState);
  };

  setNextStateActive = (): void => {
    if (!this.nextState) return;

    this.setActiveStateByID(this.nextState);
  };

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
