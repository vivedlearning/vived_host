import { makeHostAppObjectRepo } from "../../../../HostAppObject";
import { makeAppSandboxEntity, SandboxState } from "../../../AppSandbox/Entities";
import {
  MockDispatchIsAuthoringUC,
  MockDispatchSetStateUC
} from "../../../Dispatcher/Mocks";
import { makeHostStateMachine } from "../../Entities";
import { makeMockHostEditingStateEntity } from "../../Mocks/MockHostEditingStateEntity";
import {
  makeMockHostStateEntity
} from "../../Mocks/MockHostStateEntity";
import { makeCancelSandboxEditingUC } from "./CancelSandboxEditingUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const sandboxAO = appObjects.getOrCreate("app1");
  const sandbox = makeAppSandboxEntity(sandboxAO);
  const mockDispatchIsAuthoring = new MockDispatchIsAuthoringUC(sandboxAO);
  const mockDispatchState = new MockDispatchSetStateUC(sandboxAO);

  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("StateMachine")
  );
  stateMachine.setStates([makeMockHostStateEntity("state1", appObjects)]);

  const editingState = makeMockHostEditingStateEntity(appObjects);

  const uc = makeCancelSandboxEditingUC(appObjects.getOrCreate("AO"));

  return {
    sandbox,
    uc,
    mockDispatchIsAuthoring,
    mockDispatchState,
    stateMachine,
    editingState,
    registerSingletonSpy
  };
}

describe("Cancel Sandbox Authoring UC", () => {
  it("Calls Cancel Editing", () => {
    const { editingState, uc } = makeTestRig();

    uc.cancel();

    expect(editingState.cancelEditState).toBeCalled();
  });

  it("Dispatches authoring as false to the app", () => {
    const { uc, mockDispatchIsAuthoring } = makeTestRig();
    uc.cancel();

    expect(mockDispatchIsAuthoring.doDispatch).toBeCalledWith(false);
  });

  it("Dispatches the original state to the app if a state was selected", () => {
    const { stateMachine, uc, mockDispatchState } = makeTestRig();
    stateMachine.setActiveStateByID("state1");
    uc.cancel();

    const expectedStateStr = JSON.stringify({ foo: "bar" });
    expect(mockDispatchState.doDispatch).toBeCalledWith(expectedStateStr);
  });

  it("Puts the state back to mounted if there is no active state", () => {
    const { sandbox, uc } = makeTestRig();

    sandbox.state = SandboxState.PLAYING;

    uc.cancel();

    expect(sandbox.state).toEqual(SandboxState.MOUNTED);
  });

  it("Registers as the singleton", () => {
    const { registerSingletonSpy, uc } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(uc);
  });
});
