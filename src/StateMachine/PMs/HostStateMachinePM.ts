import {
  getSingletonComponent,
  AppObject,
  AppObjectPM,
  AppObjectRepo
} from "@vived/core";
import { HostStateMachine } from "../Entities";

export interface HostStateMachineVM {
  activeSlideID: string | undefined;
  activeSlideName: string | undefined;
  nextSlideID: string | undefined;
  previousSlideID: string | undefined;
  states: string[];
  isSingleSlide: boolean;
}

export abstract class HostStateMachinePM extends AppObjectPM<HostStateMachineVM> {
  static type = "HostStateMachinePM";

  static get(appObjects: AppObjectRepo): HostStateMachinePM | undefined {
    return getSingletonComponent(HostStateMachinePM.type, appObjects);
  }
}

export function makeHostStateMachinePM(appObject: AppObject) {
  return new HostStateMachinePMImp(appObject);
}

class HostStateMachinePMImp extends HostStateMachinePM {
  private stateMachine?: HostStateMachine;

  vmsAreEqual(a: HostStateMachineVM, b: HostStateMachineVM): boolean {
    if (a.activeSlideID !== b.activeSlideID) return false;
    if (a.activeSlideName !== b.activeSlideName) return false;
    if (a.nextSlideID !== b.nextSlideID) return false;
    if (a.previousSlideID !== b.previousSlideID) return false;
    if (a.states.length !== b.states.length) return false;
    if (a.isSingleSlide !== b.isSingleSlide) return false;

    // Compare states arrays
    for (let i = 0; i < a.states.length; i++) {
      if (a.states[i] !== b.states[i]) return false;
    }

    return true;
  }

  private onEntityChange = () => {
    if (!this.stateMachine) return;

    // Get the state IDs directly without mapping to name
    const states = [...this.stateMachine.states];

    const activeStateName = this.stateMachine.activeState
      ? this.stateMachine.getStateByID(this.stateMachine.activeState)?.name
      : undefined;

    const vm: HostStateMachineVM = {
      activeSlideID: this.stateMachine.activeState,
      activeSlideName: activeStateName,
      nextSlideID: this.stateMachine.nextState,
      previousSlideID: this.stateMachine.previousState,
      states,
      isSingleSlide: states.length === 1
    };

    this.doUpdateView(vm);
  };

  constructor(appObject: AppObject) {
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
  activeSlideName: undefined,
  nextSlideID: undefined,
  previousSlideID: undefined,
  states: [],
  isSingleSlide: false
};
