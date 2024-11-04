import { makeHostAppObjectRepo } from "../../../HostAppObject";
import {
  MockDispatchIsAuthoringUC,
  MockDispatchSetStateUC,
  MockDispatchStartAppUC,
  MockDispatchThemeUC
} from "../../Dispatcher/Mocks";
import {
  makeHostEditingStateEntity,
  makeHostStateMachine
} from "../../StateMachine/Entities";
import { makeMockHostStateEntity } from "../../StateMachine/Mocks/MockHostStateEntity";
import { makeStartAppUC, StartAppUC } from "./StartAppUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("StateMachine")
  );

  const state1 = makeMockHostStateEntity("state1", appObjects);
  stateMachine.setStates([state1]);

  const editingState = makeHostEditingStateEntity(
    appObjects.getOrCreate("StateMachine")
  );

  const ao = appObjects.getOrCreate("App1");
  const mockStart = new MockDispatchStartAppUC(ao);
  const mockSetState = new MockDispatchSetStateUC(ao);
  const mockSetAuthoring = new MockDispatchIsAuthoringUC(ao);
  const mockSetTheme = new MockDispatchThemeUC(ao);
  const uc = makeStartAppUC(ao);

  const container = document.createElement("div");

  return {
    uc,
    ao,
    appObjects,
    mockStart,
    mockSetState,
    mockSetAuthoring,
    mockSetTheme,
    stateMachine,
    container,
    editingState,
    state1
  };
}

describe("Start App UC", () => {
  it("Gets an app object", () => {
    const { ao, uc } = makeTestRig();

    expect(StartAppUC.get(ao)).toEqual(uc);
  });

  it("Gets by ID", () => {
    const { uc, appObjects } = makeTestRig();

    expect(StartAppUC.getByID("App1", appObjects)).toEqual(uc);
  });

  it("Starts by ID", () => {
    const { uc, appObjects } = makeTestRig();

    uc.start = jest.fn();
    const container = document.createElement("div");

    StartAppUC.startByID(container, "App1", appObjects);
    expect(uc.start).toBeCalledWith(container);
  });

  it("Dispatches start app with the container", () => {
    const { uc, container, mockStart } = makeTestRig();

    uc.start(container);

    expect(mockStart.doDispatch).toBeCalledWith(container);
  });

  it("Send the state on start if one is set as active", () => {
    const { stateMachine, mockSetState, container, uc } = makeTestRig();
    stateMachine.setActiveStateByID("state1");

    uc.start(container);

    const expectedStateStr = JSON.stringify({ foo: "bar" });
    expect(mockSetState.doDispatch).toBeCalledWith(expectedStateStr);
  });

  it("Sends start in author mode when true", () => {
    const {
      mockSetAuthoring,
      uc,
      container,
      editingState,
      state1
    } = makeTestRig();
    editingState.startEditing(state1);

    uc.start(container);

    expect(mockSetAuthoring.doDispatch).toBeCalledWith(true);
  });

  it("Sends start in author mode when false and there is a state", () => {
    const { stateMachine, mockSetAuthoring, uc, container } = makeTestRig();

    stateMachine.setActiveStateByID("state1");

    uc.start(container);

    expect(mockSetAuthoring.doDispatch).toBeCalledWith(false);
  });

  it("Sends the theme colors", () => {
    const { mockSetTheme, uc, container } = makeTestRig();

    uc.start(container);

    expect(mockSetTheme.doDispatch).toBeCalled();
  });
});
