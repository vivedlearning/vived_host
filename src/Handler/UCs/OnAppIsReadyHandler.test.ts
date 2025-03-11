import { makeAppObjectRepo } from "@vived/core";
import { AppState, makeAppEntity } from "../../Apps";
import { makeHostHandlerEntity } from "../Entities";
import { makeOnAppIsReadyHandler } from "./OnAppIsReadyHandler";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const app = makeAppEntity(ao);
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const uc = makeOnAppIsReadyHandler(ao);
  return { registerSpy, uc, app };
}

describe("On App Ready Handler", () => {
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

  it("Sets the app state to ready", () => {
    const { uc, app } = makeTestRig();

    app.state = AppState.LOADING;

    uc.action();

    expect(app.state).toEqual(AppState.READY);
  });
});
