import { makeAppObjectRepo } from "@vived/core";
import { makeHostStateMachine } from "../../StateMachine/Entities";
import {
  makeMockHostStateEntity,
  makeMockTransitionToStateUC
} from "../../StateMachine/Mocks";
import { makeHostHandlerEntity } from "../Entities";
import { makeGoToPreviousStateHandler } from "./GoToPreviousStateHandler";

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
  stateMachine.setActiveStateByID("state2");

  const mockTransitionToState =
    makeMockTransitionToStateUC(appObjects).transitionToState;

  const uc = makeGoToPreviousStateHandler(ao);
  return { registerSpy, uc, mockTransitionToState, stateMachine };
}

describe("Go to previous state handler", () => {
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

  it("Transitions to the next state", () => {
    const { stateMachine, uc, mockTransitionToState } = makeTestRig();

    expect(stateMachine.activeState).toEqual("state2");
    uc.action();

    expect(mockTransitionToState).toBeCalledWith("state1");
  });
});
