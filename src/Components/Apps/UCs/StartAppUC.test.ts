import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { DispatchStateDTO } from "../../Dispatcher";
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
  const state2 = makeMockHostStateEntity("state2", appObjects);
  stateMachine.setStates([state1, state2]);

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

  it("Sends the state on start if one is set as active", () => {
    const { stateMachine, mockSetState, container, uc } = makeTestRig();
    stateMachine.setActiveStateByID("state1");

    uc.start(container);

    const dispatchDTO = mockSetState.doDispatch.mock.calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.finalState).toEqual({ foo: "bar" });
  });

  it("Does not send a duration", () => {
    const { stateMachine, mockSetState, container, uc } = makeTestRig();
    stateMachine.setActiveStateByID("state1");

    uc.start(container);

    const dispatchDTO = mockSetState.doDispatch.mock.calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.duration).toBeUndefined();
  });

  it("Sends true if there is a previous slide", () => {
    const { stateMachine, mockSetState, container, uc } = makeTestRig();
    stateMachine.setActiveStateByID("state1");

    uc.start(container);

    const dispatchDTO = mockSetState.doDispatch.mock.calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.hasNextSlide).toEqual(true)
  });

  it("Sends false if there is not a previous slide", () => {
    const { stateMachine, mockSetState, container, uc } = makeTestRig();
    stateMachine.setActiveStateByID("state1");

    uc.start(container);

    const dispatchDTO = mockSetState.doDispatch.mock.calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.hasPreviousSlide).toEqual(false)
  });

  it("Sends false if there is not a next slide", () => {
    const { stateMachine, mockSetState, container, uc } = makeTestRig();
    stateMachine.setActiveStateByID("state2");

    uc.start(container);

    const dispatchDTO = mockSetState.doDispatch.mock.calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.hasNextSlide).toEqual(false)
  });

  it("Sends true if there is a previous slide", () => {
    const { stateMachine, mockSetState, container, uc } = makeTestRig();
    stateMachine.setActiveStateByID("state2");

    uc.start(container);

    const dispatchDTO = mockSetState.doDispatch.mock.calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.hasPreviousSlide).toEqual(true)
  });

  it("Sends false for has hide nav if there are at least two slides", () => {
    const { stateMachine, mockSetState, container, uc } = makeTestRig();
    stateMachine.setActiveStateByID("state1");

    uc.start(container);

    const dispatchDTO = mockSetState.doDispatch.mock.calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.hideNavigation).toEqual(false)
  });

  it("Sends true for has hide nav of there are less than 2 slides", () => {
    const { stateMachine, mockSetState, container, uc, state1 } = makeTestRig();
    stateMachine.setStates([state1]);
    stateMachine.setActiveStateByID("state1");

    uc.start(container);

    const dispatchDTO = mockSetState.doDispatch.mock.calls[0][0] as DispatchStateDTO;
    expect(dispatchDTO.hideNavigation).toEqual(true)
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
