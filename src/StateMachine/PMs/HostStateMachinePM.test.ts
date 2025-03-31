import { makeAppObjectRepo } from "@vived/core";
import { makeHostStateEntity } from "../Entities";
import { makeHostStateMachine } from "../Entities/HostStateMachine";
import {
  HostStateMachinePM,
  HostStateMachineVM,
  makeHostStateMachinePM
} from "./HostStateMachinePM";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const ao = appObjects.getOrCreate("AO");
  const stateMachine = makeHostStateMachine(ao);

  const state1 = makeHostStateEntity(appObjects.getOrCreate("state1"));
  state1.name = "State 1";

  const state2 = makeHostStateEntity(appObjects.getOrCreate("state2"));
  state2.name = "State 2";

  const state3 = makeHostStateEntity(appObjects.getOrCreate("state3"));
  state3.name = "State 3";

  stateMachine.setStates([state1, state2, state3]);
  stateMachine.setActiveStateByID("state2");

  const pm = makeHostStateMachinePM(ao);

  return { stateMachine, pm, registerSingletonSpy, appObjects };
}

describe("Host State Machine Presentation Manager", () => {
  it("Initializes the last vm", () => {
    const { pm } = makeTestRig();
    expect(pm.lastVM).not.toBeUndefined();
  });

  it("Registers as the singleton", () => {
    const { registerSingletonSpy, pm } = makeTestRig();
    expect(registerSingletonSpy).toBeCalledWith(pm);
  });

  it("Initializes the VM", () => {
    const { pm } = makeTestRig();

    expect(pm).not.toBeUndefined();
  });

  it("Updates if the entity changes", () => {
    const { pm, stateMachine } = makeTestRig();

    stateMachine.setActiveStateByID("state1");

    const vm = pm.lastVM as HostStateMachineVM;
    expect(vm.activeSlideID).toEqual("state1");
    expect(vm.activeSlideName).toEqual("State 1");
    expect(vm.previousSlideID).toBeUndefined();
    expect(vm.nextSlideID).toEqual("state2");
    expect(vm.states).toHaveLength(3);
    expect(vm.states).toEqual(["state1", "state2", "state3"]);
    expect(vm.isSingleSlide).toEqual(false);
  });

  it("Checks for equal vms", () => {
    const { pm } = makeTestRig();

    const vm1: HostStateMachineVM = {
      activeSlideID: "activeSlideID",
      activeSlideName: "Active Slide",
      nextSlideID: "newSlideID",
      previousSlideID: "previousSlideID",
      states: ["state1", "state2"],
      isSingleSlide: false
    };

    const vm2 = { ...vm1 };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(true);
  });

  it("Sets isSingleSlide to true when there is only one state", () => {
    const { pm, stateMachine } = makeTestRig();

    stateMachine.setStates([stateMachine.getStateByID("state1")!]);

    const vm = pm.lastVM as HostStateMachineVM;
    expect(vm.states).toHaveLength(1);
    expect(vm.states).toEqual(["state1"]);
    expect(vm.isSingleSlide).toEqual(true);
  });

  it("Checks for a change in isSingleSlide", () => {
    const { pm } = makeTestRig();

    const vm1: HostStateMachineVM = {
      activeSlideID: "activeSlideID",
      activeSlideName: "Active Slide",
      nextSlideID: "newSlideID",
      previousSlideID: "previousSlideID",
      states: ["state1"],
      isSingleSlide: true
    };

    const vm2 = { ...vm1, isSingleSlide: false };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the active slide", () => {
    const { pm } = makeTestRig();

    const vm1: HostStateMachineVM = {
      activeSlideID: "activeSlideID",
      activeSlideName: "Active Slide",
      nextSlideID: "newSlideID",
      previousSlideID: "previousSlideID",
      states: ["state1", "state2"],
      isSingleSlide: false
    };

    const vm2 = { ...vm1, activeSlideID: "CHANGED" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the active slide name", () => {
    const { pm } = makeTestRig();

    const vm1: HostStateMachineVM = {
      activeSlideID: "activeSlideID",
      activeSlideName: "Active Slide",
      nextSlideID: "newSlideID",
      previousSlideID: "previousSlideID",
      states: ["state1", "state2"],
      isSingleSlide: false
    };

    const vm2 = { ...vm1, activeSlideName: "CHANGED" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the next slide", () => {
    const { pm } = makeTestRig();

    const vm1: HostStateMachineVM = {
      activeSlideID: "activeSlideID",
      activeSlideName: "Active Slide",
      nextSlideID: "newSlideID",
      previousSlideID: "previousSlideID",
      states: ["state1", "state2"],
      isSingleSlide: false
    };

    const vm2 = { ...vm1, nextSlideID: "CHANGED" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the previous slide", () => {
    const { pm } = makeTestRig();

    const vm1: HostStateMachineVM = {
      activeSlideID: "activeSlideID",
      activeSlideName: "Active Slide",
      nextSlideID: "newSlideID",
      previousSlideID: "previousSlideID",
      states: ["state1", "state2"],
      isSingleSlide: false
    };

    const vm2 = { ...vm1, previousSlideID: "CHANGED" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for state to be added", () => {
    const { pm } = makeTestRig();

    const vm1: HostStateMachineVM = {
      activeSlideID: "activeSlideID",
      activeSlideName: "Active Slide",
      nextSlideID: "newSlideID",
      previousSlideID: "previousSlideID",
      states: ["state1", "state2"],
      isSingleSlide: false
    };

    const vm2 = {
      ...vm1,
      states: ["state1", "state2", "state3"],
      isSingleSlide: false
    };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for state to be removed", () => {
    const { pm } = makeTestRig();

    const vm1: HostStateMachineVM = {
      activeSlideID: "activeSlideID",
      activeSlideName: "Active Slide",
      nextSlideID: "newSlideID",
      previousSlideID: "previousSlideID",
      states: ["state1", "state2"],
      isSingleSlide: false
    };

    const vm2 = {
      ...vm1,
      states: ["state1"],
      isSingleSlide: true
    };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for state order to change", () => {
    const { pm } = makeTestRig();

    const vm1: HostStateMachineVM = {
      activeSlideID: "activeSlideID",
      activeSlideName: "Active Slide",
      nextSlideID: "newSlideID",
      previousSlideID: "previousSlideID",
      states: ["state1", "state2"],
      isSingleSlide: false
    };

    const vm2 = {
      ...vm1,
      states: ["state2", "state1"],
      isSingleSlide: false
    };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });
});
