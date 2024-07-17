import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeHostStateMachine } from "../Entities/HostStateMachine";
import {
  HostStateMachinePM,
  HostStateMachineVM,
  makeHostStateMachinePM
} from "./HostStateMachinePM";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const ao = appObjects.getOrCreate("AO");
  const stateMachine = makeHostStateMachine(ao);

  stateMachine.setStates([
    { id: "state1", data: { state: "Data1" }, name: "State 1", assets: [] },
    { id: "state2", data: { state: "Data2" }, name: "State 2", assets: [] },
    { id: "state3", data: { state: "Data3" }, name: "State 3", assets: [] }
  ]);
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
    expect(vm.previousSlideID).toBeUndefined();
    expect(vm.nextSlideID).toEqual("state2");
    expect(vm.states).toHaveLength(3);
  });

  it("Checks for equal vms", () => {
    const { pm } = makeTestRig();

    const vm1: HostStateMachineVM = {
      activeSlideID: "activeSlideID",
      nextSlideID: "newSlideID",
      previousSlideID: "previousSlideID",
      states: [
        { id: "state1", name: "State 1" },
        { id: "state2", name: "State 2" }
      ]
    };

    const vm2 = { ...vm1 };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(true);
  });

  it("Checks for a change in the active slide", () => {
    const { pm } = makeTestRig();

    const vm1: HostStateMachineVM = {
      activeSlideID: "activeSlideID",
      nextSlideID: "newSlideID",
      previousSlideID: "previousSlideID",
      states: [
        { id: "state1", name: "State 1" },
        { id: "state2", name: "State 2" }
      ]
    };

    const vm2 = { ...vm1, activeSlideID: "CHANGED" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the next slide", () => {
    const { pm } = makeTestRig();

    const vm1: HostStateMachineVM = {
      activeSlideID: "activeSlideID",
      nextSlideID: "newSlideID",
      previousSlideID: "previousSlideID",
      states: [
        { id: "state1", name: "State 1" },
        { id: "state2", name: "State 2" }
      ]
    };

    const vm2 = { ...vm1, nextSlideID: "CHANGED" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the previous slide", () => {
    const { pm } = makeTestRig();

    const vm1: HostStateMachineVM = {
      activeSlideID: "activeSlideID",
      nextSlideID: "newSlideID",
      previousSlideID: "previousSlideID",
      states: [
        { id: "state1", name: "State 1" },
        { id: "state2", name: "State 2" }
      ]
    };

    const vm2 = { ...vm1, previousSlideID: "CHANGED" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for state to be added", () => {
    const { pm } = makeTestRig();

    const vm1: HostStateMachineVM = {
      activeSlideID: "activeSlideID",
      nextSlideID: "newSlideID",
      previousSlideID: "previousSlideID",
      states: [
        { id: "state1", name: "State 1" },
        { id: "state2", name: "State 2" }
      ]
    };

    const vm2 = {
      ...vm1,
      states: [
        { id: "state1", name: "State 1" },
        { id: "state2", name: "State 2" },
        { id: "state3", name: "State 3" }
      ]
    };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for state to be removed", () => {
    const { pm } = makeTestRig();

    const vm1: HostStateMachineVM = {
      activeSlideID: "activeSlideID",
      nextSlideID: "newSlideID",
      previousSlideID: "previousSlideID",
      states: [
        { id: "state1", name: "State 1" },
        { id: "state2", name: "State 2" }
      ]
    };

    const vm2 = { ...vm1, states: [{ id: "state1", name: "State 1" }] };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for state to be renamed", () => {
    const { pm } = makeTestRig();

    const vm1: HostStateMachineVM = {
      activeSlideID: "activeSlideID",
      nextSlideID: "newSlideID",
      previousSlideID: "previousSlideID",
      states: [
        { id: "state1", name: "State 1" },
        { id: "state2", name: "State 2" }
      ]
    };

    const vm2 = {
      ...vm1,
      states: [
        { id: "state1", name: "State 1" },
        { id: "state2", name: "RENAMED" }
      ]
    };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for state to have a different it", () => {
    const { pm } = makeTestRig();

    const vm1: HostStateMachineVM = {
      activeSlideID: "activeSlideID",
      nextSlideID: "newSlideID",
      previousSlideID: "previousSlideID",
      states: [
        { id: "state1", name: "State 1" },
        { id: "state2", name: "State 2" }
      ]
    };

    const vm2 = {
      ...vm1,
      states: [
        { id: "state1", name: "State 1" },
        { id: "CHANGED", name: "State 2" }
      ]
    };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });
});
