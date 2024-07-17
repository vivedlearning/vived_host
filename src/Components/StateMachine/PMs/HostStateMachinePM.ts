import {
  getSingletonComponent,
  HostAppObject,
  HostAppObjectPM,
  HostAppObjectRepo
} from "../../../HostAppObject";
import { HostStateMachine } from "../Entities";

export interface HostStateMachineVM {
  activeSlideID: string | undefined;
  nextSlideID: string | undefined;
  previousSlideID: string | undefined;
  states: { id: string; name: string }[];
}

export abstract class HostStateMachinePM extends HostAppObjectPM<HostStateMachineVM> {
  static type = "HostStateMachinePM";

  static get(appObjects: HostAppObjectRepo): HostStateMachinePM | undefined {
    return getSingletonComponent(HostStateMachinePM.type, appObjects);
  }
}

export function makeHostStateMachinePM(appObject: HostAppObject) {
  return new HostStateMachinePMImp(appObject);
}

class HostStateMachinePMImp extends HostStateMachinePM {
  private stateMachine?: HostStateMachine;

  vmsAreEqual(a: HostStateMachineVM, b: HostStateMachineVM): boolean {
    if (a.activeSlideID !== b.activeSlideID) return false;
    if (a.nextSlideID !== b.nextSlideID) return false;
    if (a.previousSlideID !== b.previousSlideID) return false;
    if (a.states.length !== b.states.length) return false;

    let statesAreEqual = true;
    a.states.forEach((stateA, i) => {
      const stateB = b.states[i];
      if (stateA.id !== stateB.id) statesAreEqual = false;
      if (stateA.name !== stateB.name) statesAreEqual = false;
    });

    return statesAreEqual;
  }

  private onEntityChange = () => {
    if (!this.stateMachine) return;

    const vm: HostStateMachineVM = {
      activeSlideID: this.stateMachine.activeState
        ? this.stateMachine.activeState.id
        : undefined,
      nextSlideID: this.stateMachine.nextState
        ? this.stateMachine.nextState.id
        : undefined,
      previousSlideID: this.stateMachine.previousState
        ? this.stateMachine.previousState.id
        : undefined,
      states: this.stateMachine.states.map((state) => {
        return { id: state.id, name: state.name };
      })
    };

    this.doUpdateView(vm);
  };

  constructor(appObject: HostAppObject) {
    super(appObject, HostStateMachinePM.type);

    this.stateMachine = appObject.getComponent<HostStateMachine>(
      HostStateMachine.type
    );
    if (!this.stateMachine) {
      this.error(
        "PM has been added to an App Object that does not have a HostStateMachine"
      );
      return;
    }

    this.stateMachine.addChangeObserver(this.onEntityChange);
    this.onEntityChange();
    this.appObjects.registerSingleton(this);
  }
}

export const defaultHostStateMachineVM: HostStateMachineVM = {
  activeSlideID: undefined,
  nextSlideID: undefined,
  previousSlideID: undefined,
  states: []
};
