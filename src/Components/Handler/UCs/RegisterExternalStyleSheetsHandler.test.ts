import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeHostHandlerEntity } from "../Entities";
import { makeRegisterExternalStyleSheetsHandler } from "./RegisterExternalStyleSheetsHandler";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const logger = jest.fn();
  appObjects.submitLog = logger;

  const uc = makeRegisterExternalStyleSheetsHandler(ao);
  return { registerSpy, uc, logger };
}

describe("Register Style Sheets Handler", () => {
  it("Registers as a handler when constructed", () => {
    const { registerSpy, uc } = makeTestRig();
    expect(registerSpy).toBeCalledWith(uc);
  });

  it("Triggers the action for v1", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const payload = {
      stylesheets: ["a stylesheet"]
    };
    uc.handleRequest(1, payload);

    expect(uc.action).toBeCalledWith(["a stylesheet"]);
  });

  it("Throws for an unsupported version", () => {
    const { uc } = makeTestRig();

    const payload = {
      stylesheets: ["a stylesheet"]
    };

    expect(() => uc.handleRequest(-1, payload)).toThrowError();
  });

  it("Throws if the v1 payload is bungled", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const payload = {
      foo: "bar"
    };

    expect(() => uc.handleRequest(1, payload)).toThrowError();
  });

  it("Defaults to logging the sheets", () => {
    const { uc, logger } = makeTestRig();

    uc.action(["sheet 1"]);

    expect(logger).toBeCalled();
  });
});
