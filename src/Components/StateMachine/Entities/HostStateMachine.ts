import { MemoizedBoolean } from "../../../Entities";
import {
  getSingletonComponent,
  HostAppObject,
  HostAppObjectEntity,
  HostAppObjectEntityRepo,
  HostAppObjectRepo
} from "../../../HostAppObject";
import { generateUniqueID } from "../../../Utilities";
import { HostStateEntity, makeHostStateEntity } from "./HostStateEntity";

export abstract class HostStateMachine extends HostAppObjectEntity {
  static type = "HostStateMachine";

  abstract states: string[];

  abstract activeState: string | undefined;
  abstract previousState: string | undefined;
  abstract nextState: string | undefined;

  abstract setActiveStateByID: (id: string) => void;
  abstract clearActiveState: () => void;
  abstract setStates: (states: HostStateEntity[]) => void;
  abstract createNewState: () => HostStateEntity;
  abstract getStateByID: (id: string) => HostStateEntity | undefined;
  abstract deleteState: (id: string) => void;
  abstract getStateIndex: (id: string) => number | undefined;
  abstract hasState: (id: string) => boolean;
  abstract stateFactory: (id: string) => HostStateEntity;

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
  private _states: HostStateEntity[] = [];

  get states() {
    return this._states.map((state) => state.id);
  }

  private _activeState: string | undefined;
  get activeState() {
    return this._activeState;
  }

  private _previousState: string | undefined;
  get previousState() {
    return this._previousState;
  }

  private _nextState: string | undefined;
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

    if (state.id === this._activeState) return;
    this._activeState = state.id;

    const index = this.getStateIndex(id);

    if (index === undefined) {
      this._nextState = undefined;
      this._previousState = undefined;
      return;
    }

    const prevIndex = index - 1;
    const nextIndex = index + 1;

    if (prevIndex >= 0) {
      this._previousState = this._states[prevIndex].id;
    } else {
      this._previousState = undefined;
    }

    if (nextIndex < this._states.length) {
      this._nextState = this._states[nextIndex].id;
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

  constructor(appObject: HostAppObject) {
    super(appObject, HostStateMachine.type);

    this.appObjects.registerSingleton(this);
  }
}
