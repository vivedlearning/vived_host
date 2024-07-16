import { MemoizedBoolean } from "../../../Entities";
import {
  getSingletonComponent,
  HostAppObject,
  HostAppObjectEntity,
  HostAppObjectRepo
} from "../../../HostAppObject";
import { generateUniqueID } from "../../../Utilities";

export type OnStateMachineChange = () => void;

export interface StateMachineState {
  id: string;
  name: string;
  data: object;
  assets: string[];
}

export interface StateMachineStringState {
  id: string;
  name: string;
  data: string;
}

export abstract class HostStateMachine extends HostAppObjectEntity {
  static type = "HostStateMachine";

  abstract states: StateMachineState[];

  abstract activeState: StateMachineState | undefined;
  abstract previousState: StateMachineState | undefined;
  abstract nextState: StateMachineState | undefined;

  abstract isAuthoring: boolean;

  abstract lastAssets: string[];
  abstract lastEditingState: object | undefined;
  abstract validationErrorMessage?: string;

  abstract setActiveStateByID: (id: string) => void;
  abstract clearActiveState: () => void;
  abstract setStates: (states: StateMachineState[]) => void;
  abstract setStatesFromString: (states: StateMachineStringState[]) => void;
  abstract createState: (
    name: string,
    data: object,
    assets: string[]
  ) => StateMachineState;
  abstract retrieveState: (id: string) => StateMachineState | undefined;
  abstract updateState: (state: StateMachineState) => void;
  abstract deleteState: (id: string) => void;
  abstract getStateIndex: (id: string) => number | undefined;
  abstract hasState: (id: string) => boolean;

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<HostStateMachine>(
      HostStateMachine.type,
      appObjects
    );
  }
}

export function makeHostStateMachine(
  appObject: HostAppObject
): HostStateMachine {
  return new HostStateMachineImp(appObject);
}

class HostStateMachineImp extends HostStateMachine {
  private _states: StateMachineState[] = [];
  get states() {
    return this._states.map((state) => ({ ...state }));
  }

  private _activeState: StateMachineState | undefined;
  get activeState() {
    return this._activeState;
  }

  private _previousState: StateMachineState | undefined;
  get previousState() {
    return this._previousState;
  }

  private _nextState: StateMachineState | undefined;
  get nextState() {
    return this._nextState;
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

    if (state.id === this._activeState?.id) return;
    this._activeState = state;

    const index = this.getStateIndex(id);

    if (index === undefined) {
      this._nextState = undefined;
      this._previousState = undefined;
      return;
    }

    const prevIndex = index - 1;
    const nextIndex = index + 1;

    if (prevIndex >= 0) {
      this._previousState = this._states[prevIndex];
    } else {
      this._previousState = undefined;
    }

    if (nextIndex < this._states.length) {
      this._nextState = this._states[nextIndex];
    } else {
      this._nextState = undefined;
    }

    this.notifyOnChange();
  };

  clearActiveState = (): void => {
    if (!this.activeState) return;

    this._nextState = undefined;
    this._previousState = undefined;
    this._activeState = undefined;
    this.notifyOnChange();
  };

  setStates = (states: StateMachineState[]): void => {
    this._states = states.map((state) => ({ ...state }));
    this.notifyOnChange();
  };

  setStatesFromString = (states: StateMachineStringState[]): void => {
    this._states = states.map((state) => {
      const { data, id, name } = state;

      const dataObject = JSON.parse(data);

      const rVal: StateMachineState = {
        id,
        name,
        data: dataObject,
        assets: []
      };

      return rVal;
    });
    this.notifyOnChange();
  };

  createState = (
    name: string,
    data: object,
    assets: string[]
  ): StateMachineState => {
    const newState: StateMachineState = {
      id: generateUniqueID(),
      name,
      data,
      assets
    };

    this._states.push(newState);
    this.notifyOnChange();
    return { ...newState };
  };

  retrieveState = (id: string): StateMachineState | undefined => {
    return this.findStateByID(id);
  };

  updateState = (updatedState: StateMachineState): void => {
    let found = false;

    this._states.forEach((state, i) => {
      if (state.id === updatedState.id) {
        this._states[i] = { ...updatedState };
        found = true;
      }
    });

    if (found) {
      this.notifyOnChange();
    }
  };

  deleteState = (id: string): void => {
    const index = this.getStateIndex(id);

    if (index === undefined) {
      return;
    }

    this._states.splice(index, 1);
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

  private findStateByID(id: string): StateMachineState | undefined {
    for (const state of this._states) {
      if (state.id === id) {
        return state;
      }
    }

    return undefined;
  }

  constructor(appObject: HostAppObject) {
    super(appObject, HostStateMachine.type);

    this.appObjects.registerSingleton(this);
  }
}
