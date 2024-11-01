import { makeHostAppObjectRepo } from "../../../../HostAppObject";
import { makeAppSandboxEntity, SandboxState } from "../../../AppSandbox";
import { makeMockStartZSpaceUC } from "../../../ZSpaceHost";
import { makeHostStateMachine } from "../../Entities";
import { makeMockHostEditingStateEntity, makeMockHostStateEntity } from "../../Mocks";
import { makeConsumeSandboxStateUC } from "./ConsumeSandboxStateUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");
  const sandbox = makeAppSandboxEntity(appObjects.getOrCreate("Sandbox"));

  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("StateMachine")
  );

  const editingState = makeMockHostEditingStateEntity(appObjects);

  stateMachine.setStates([makeMockHostStateEntity("state1", appObjects)]);

  sandbox.state = SandboxState.MOUNTED;

  const mockStart = makeMockStartZSpaceUC(appObjects);

  const uc = makeConsumeSandboxStateUC(appObjects.getOrCreate("AO"));

  return {
    uc,
    sandbox,
    mockStart,
    stateMachine,
    editingState,
    registerSingletonSpy
  };
}

describe("Consume State Use Case", () => {
  it("Set the active state", () => {
    const { uc, stateMachine } = makeTestRig();

    expect(stateMachine.activeState).toBeUndefined();

    uc.consume("state1");

    expect(stateMachine.activeState).toEqual("state1");
  });

  it("Sets the state to Playing", () => {
    const { uc, sandbox } = makeTestRig();

    expect(sandbox.state).toEqual(SandboxState.MOUNTED);

    uc.consume("state1");

    expect(sandbox.state).toEqual(SandboxState.PLAYING);
  });

  it("Cancels any authoring", () => {
    const { uc, editingState } = makeTestRig();

    uc.consume("state1");

    expect(editingState.cancelEditState).toBeCalled();
  });

  it("Registers as the singleton", () => {
    const { registerSingletonSpy, uc } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(uc);
  });
});
