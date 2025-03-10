import { makeAppObjectRepo } from "@vived/core";
import { makeAppEntity } from "../../Apps";
import { makeHostHandlerEntity } from "../Entities";
import { makeRegisterExternalStyleSheetsHandler } from "./RegisterExternalStyleSheetsHandler";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const app = makeAppEntity(ao);
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const logger = jest.fn();
  appObjects.submitLog = logger;

  const uc = makeRegisterExternalStyleSheetsHandler(ao);
  return { registerSpy, uc, logger, app };
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

  it("Adds the sheets to the app", () => {
    const { uc, app } = makeTestRig();

    app.styles = ["existing sheet"];

    uc.action(["sheet 1"]);

    expect(app.styles).toEqual(["existing sheet", "sheet 1"]);
  });
});
