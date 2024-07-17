import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeHostStateMachine } from "../../StateMachine";
import { makeHostHandlerEntity } from "../Entities";
import { makeHasPreviousStateHandler } from "./HasPreviousStateHandler";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("StateMachine")
  );
  stateMachine.setStates([
    { id: "state1", name: "State 1", data: { some: "State" }, assets: [] },
    { id: "state2", name: "State 2", data: { some: "Other State" }, assets: [] }
  ]);

  const uc = makeHasPreviousStateHandler(ao);
  return { registerSpy, uc, stateMachine };
}

describe("Has Previous State Handler", () => {
  it("Registers as a handler when constructed", () => {
    const { registerSpy, uc } = makeTestRig();
    expect(registerSpy).toBeCalledWith(uc);
  });

  it("Triggers the action for v1", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const mockCallback = jest.fn();
    const payload = {
      callback: mockCallback
    };
    uc.handleRequest(1, payload);

    expect(uc.action).toBeCalledWith(mockCallback);
  });

  it("Triggers the callback with true if the state machine has a previous state", (done) => {
    const { uc, stateMachine } = makeTestRig();

    stateMachine.setActiveStateByID("state2");
    expect.assertions(1);

    function callback(hasNext: boolean) {
      try {
        expect(hasNext).toEqual(true);
        done();
      } catch (e) {
        done(e);
      }
    }

    uc.action(callback);
  });

  it("Triggers the callback with false if the state machine does not have a previous state", (done) => {
    const { uc, stateMachine } = makeTestRig();

    stateMachine.setActiveStateByID("state1");
    expect.assertions(1);
    function callback(hasNext: boolean) {
      try {
        expect(hasNext).toEqual(false);
        done();
      } catch (e) {
        done(e);
      }
    }

    uc.action(callback);
  });

  it("Throws for an unsupported version", () => {
    const { uc } = makeTestRig();

    const mockCallback = jest.fn();
    const payload = {
      callback: mockCallback
    };

    expect(() => uc.handleRequest(-1, payload)).toThrowError();
  });

  it("Throws if the payload is bungled", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const payload = {
      foo: "bar"
    };

    expect(() => uc.handleRequest(1, payload)).toThrowError();
  });
});
