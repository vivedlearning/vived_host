import { makeAppObjectRepo } from "@vived/core";
import {
  makeEndActivityUCMock,
  makeHostStateMachine,
  makeMockHostStateEntity,
  makeMockTransitionToStateUC
} from "../../StateMachine";
import { makeHostHandlerEntity } from "../Entities";
import { makeOnStateCompleteHandler } from "./OnStateCompleteHandler";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("StateMachine")
  );
  stateMachine.setStates([
    makeMockHostStateEntity("state1", appObjects),
    makeMockHostStateEntity("state2", appObjects)
  ]);
  stateMachine.setActiveStateByID("state1");

  const mockTransitionToState = makeMockTransitionToStateUC(appObjects);
  const mockEnd = makeEndActivityUCMock(appObjects);

  const uc = makeOnStateCompleteHandler(ao);
  return { registerSpy, uc, mockEnd, mockTransitionToState, stateMachine };
}

describe("On State Complete Base Handler", () => {
  it("Registers as a handler when constructed", () => {
    const { registerSpy, uc } = makeTestRig();
    expect(registerSpy).toBeCalledWith(uc);
  });

  it("Triggers the action for v1", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    uc.handleRequest(1);

    expect(uc.action).toBeCalled();
  });

  it("Throws for an unsupported version", () => {
    const { uc } = makeTestRig();

    expect(() => uc.handleRequest(-1)).toThrowError();
  });

  it("Advances to the next state if there is one", () => {
    const { uc, mockTransitionToState } = makeTestRig();

    uc.action();

    expect(mockTransitionToState.transitionToState).toBeCalledWith("state2");
  });

  it("Stops the activity if there are no more states", () => {
    const { uc, mockEnd, stateMachine } = makeTestRig();

    stateMachine.setActiveStateByID("state2");

    uc.action();

    expect(mockEnd.end).toBeCalled();
  });
});
