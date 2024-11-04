import { makeHostAppObjectRepo } from "../../../../HostAppObject";
import { makeAppSandboxEntity, SandboxState } from "../../../AppSandbox/Entities";
import { makeHostStateMachine } from "../../Entities";
import { makeMockHostEditingStateEntity, makeMockHostStateEntity } from "../../Mocks";
import { makeEditSandboxStateUC } from "./EditSandboxStateUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const sandbox = makeAppSandboxEntity(appObjects.getOrCreate("Sandbox"));

  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("StateMachine")
  );
  const state1Entity = makeMockHostStateEntity("state1", appObjects);
  stateMachine.setStates([state1Entity]);
  sandbox.state = SandboxState.MOUNTED;

  const editingState = makeMockHostEditingStateEntity(appObjects);

  const uc = makeEditSandboxStateUC(appObjects.getOrCreate("AO"));

  return {
    sandbox,
    uc,
    stateMachine,
    appObjects,
    editingState,
    state1Entity,
    registerSingletonSpy
  };
}

describe("Consume State Use Case", () => {
  it("Set the active state", () => {
    const { uc, stateMachine } = makeTestRig();

    expect(stateMachine.activeState).toBeUndefined();

    uc.edit("state1");

    expect(stateMachine.activeState).toEqual("state1");
  });

  it("Sets the state to Playing", () => {
    const { uc, sandbox } = makeTestRig();

    expect(sandbox.state).toEqual(SandboxState.MOUNTED);

    uc.edit("state1");

    expect(sandbox.state).toEqual(SandboxState.PLAYING);
  });

  it("Warns if the state cannot be found", () => {
    const { uc, appObjects } = makeTestRig();

    const mockWarn = jest.fn();
    appObjects.submitWarning = mockWarn;

    uc.edit("whatTheHell?");

    expect(mockWarn).toBeCalled();
  });

  it("Starts editing the state", () => {
    const { uc, editingState, state1Entity } = makeTestRig();

    uc.edit("state1");

    expect(editingState.startEditing).toBeCalledWith(state1Entity);
  });

  it("Registers as the singleton", () => {
    const { registerSingletonSpy, uc } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(uc);
  });
});
