import { makeAppObjectRepo } from "@vived/core";
import { makeHostHandlerEntity } from "../Entities";
import { makeSubmitExpectedResultHandler } from "./SubmitExpectedResultHandler";
import {
  HostStateMachine,
  makeHostStateMachine
} from "../../StateMachine/Entities/HostStateMachine";
import { ChallengeResponse } from "../../StateMachine/Entities/HostStateEntity";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const uc = makeSubmitExpectedResultHandler(ao);

  // Mock state machine
  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("stateMachine")
  );
  const state1 = stateMachine.createNewState();
  stateMachine.setActiveStateByID(state1.id);

  return {
    registerSpy,
    uc,
    stateMachine,
    state1
  };
}

describe("Submit Expected Result Handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Registers as a handler when constructed", () => {
    const { registerSpy, uc } = makeTestRig();
    expect(registerSpy).toHaveBeenCalledWith(uc);
  });

  it("Sets the expected response on the active state", () => {
    const { uc, state1 } = makeTestRig();

    const responseType = ChallengeResponse.SCORE;
    uc.action(responseType);

    expect(state1.expectedResponse).toBe(responseType);
  });

  it("Does nothing if there is no active state", () => {
    const { uc, stateMachine, state1 } = makeTestRig();
    stateMachine.clearActiveState();

    const responseType = ChallengeResponse.SCORE;
    uc.action(responseType);

    expect(state1.expectedResponse).toBeUndefined();
  });

  it("Triggers the action for v1", () => {
    const { uc } = makeTestRig();
    const actionSpy = jest.spyOn(uc, "action");

    const responseType = ChallengeResponse.SCORE;
    const payload = {
      responseType
    };
    uc.handleRequest(1, payload);

    expect(actionSpy).toBeCalledWith(responseType);
  });

  it("Throws for an unsupported version", () => {
    const { uc } = makeTestRig();

    const payload = {
      responseType: ChallengeResponse.SCORE
    };

    expect(() => uc.handleRequest(-1, payload)).toThrowError();
  });

  it("Throws if the payload is missing required fields", () => {
    const { uc } = makeTestRig();

    const payload = {
      foo: "bar"
    };

    expect(() => uc.handleRequest(1, payload)).toThrowError();
  });

  it("Does not set expected response if it is already set", () => {
    const { uc, state1 } = makeTestRig();

    const responseType = ChallengeResponse.SCORE;
    state1.expectedResponse = responseType;

    uc.action(responseType);

    expect(state1.expectedResponse).toBe(responseType);
  });
});
