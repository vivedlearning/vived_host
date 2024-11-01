import { makeHostAppObjectRepo } from "../../../../HostAppObject";
import { makeAppSandboxEntity } from "../../../AppSandbox";
import { MockDispatchIsAuthoringUC } from "../../../Dispatcher";
import { makeHostEditingStateEntity, makeHostStateMachine } from "../../Entities";
import { makeMockHostStateEntity } from "../../Mocks";
import { makeSaveAuthoringSandboxUC } from "./SaveAuthoringSandboxUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const sandboxAO = appObjects.getOrCreate("anApp");
  const sandbox = makeAppSandboxEntity(sandboxAO);
  const mockDispatchSetAuthoring = new MockDispatchIsAuthoringUC(sandboxAO);

  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("StateMachine")
  );
  stateMachine.setStates([makeMockHostStateEntity("state1", appObjects)]);
  stateMachine.setActiveStateByID("state1");

  const editingState = makeHostEditingStateEntity(
    appObjects.getOrCreate("StateMachine")
  );

  const uc = makeSaveAuthoringSandboxUC(appObjects.getOrCreate("StateMachine"));

  return {
    sandbox,
    uc,
    mockDispatchSetAuthoring,
    appObjects,
    registerSingletonSpy,
    stateMachine,
    editingState
  };
}

describe("Edit Active State UC", () => {
  it("Finishes editing", () => {
    const { editingState, uc } = makeTestRig();

    const spy = jest.spyOn(editingState, "finishEditing");

    uc.saveAuthoring();

    expect(spy).toBeCalled();
  });

  it("Dispatches the authoring flag to the app", () => {
    const { uc, mockDispatchSetAuthoring } = makeTestRig();

    uc.saveAuthoring();

    expect(mockDispatchSetAuthoring.doDispatch).toBeCalledWith(false);
  });

  it("Logs an error if there is no dispatch authoring", () => {
    const { uc, mockDispatchSetAuthoring, appObjects } = makeTestRig();
    const mockLog = jest.fn();
    uc.error = mockLog;
    appObjects.submitWarning = jest.fn(); //Suppresses the warning from getSingleton

    mockDispatchSetAuthoring.dispose();

    uc.saveAuthoring();

    expect(mockLog).toBeCalled();
  });

  it("Alerts if there is validation error", () => {
    const { uc, editingState } = makeTestRig();
    window.alert = jest.fn();
    editingState.stateValidationMessage = "Some validation message";

    uc.saveAuthoring();

    expect(window.alert).toBeCalledWith("Some validation message");
  });

  it("Register as the singleton", () => {
    const { uc, registerSingletonSpy } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(uc);
  });
});
