import { makeHostAppObjectRepo } from "../../../../HostAppObject";
import { makeAppSandboxEntity, SandboxState } from "../../../AppSandbox/Entities";
import { makeHostEditingStateEntity, makeHostStateMachine } from "../../Entities";
import { makeMockHostStateEntity } from "../../Mocks";
import { makeNewSandboxStateUC } from "./NewSandboxStateUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");
  const sandbox = makeAppSandboxEntity(appObjects.getOrCreate("Sandbox"));

  sandbox.state = SandboxState.MOUNTED;

  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("StateMachine")
  );

  const editingEntity = makeHostEditingStateEntity(
    appObjects.getOrCreate("StateMachine")
  );

  stateMachine.setStates([makeMockHostStateEntity("state1", appObjects)]);

  const uc = makeNewSandboxStateUC(appObjects.getOrCreate("AO"));

  return {
    sandbox,
    uc,
    appObjects,
    stateMachine,
    editingEntity,
    registerSingletonSpy
  };
}

describe("Author new state UC", () => {
  it("Calls new start new state on the edit uc", () => {
    const { editingEntity, uc } = makeTestRig();

    const createStateSpy = jest.spyOn(editingEntity, "startNewState");

    uc.createState();

    expect(createStateSpy).toBeCalled();
  });

  it("Authoring a new state sets the state to Playing", () => {
    const { sandbox, uc } = makeTestRig();

    expect(sandbox.state).toEqual(SandboxState.MOUNTED);

    uc.createState();

    expect(sandbox.state).toEqual(SandboxState.PLAYING);
  });

  it("Clears an active state", () => {
    const { stateMachine, uc } = makeTestRig();

    stateMachine.setActiveStateByID("state1");

    uc.createState();

    expect(stateMachine.activeState).toBeUndefined();
  });

  it("Registers as the singleton", () => {
    const { registerSingletonSpy, uc } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(uc);
  });
});
