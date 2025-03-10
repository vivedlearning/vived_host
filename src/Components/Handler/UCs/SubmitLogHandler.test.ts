import { makeAppObjectRepo } from "@vived/core";
import { makeAppEntity } from "../../Apps";
import { makeHostHandlerEntity } from "../Entities";
import { makeSubmitLogHandler } from "./SubmitLogHandler";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const ao = appObjects.getOrCreate("App1");

  const app = makeAppEntity(ao);
  app.name = "App 1";
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const uc = makeSubmitLogHandler(ao);
  return { registerSpy, uc, appObjects };
}

describe("Submit Result Base Handler", () => {
  it("Registers as a handler when constructed", () => {
    const { registerSpy, uc } = makeTestRig();
    expect(registerSpy).toBeCalledWith(uc);
  });

  it("Throws for an unsupported version", () => {
    const { uc } = makeTestRig();

    const payload = {
      sender: "a sender",
      message: "a message",
      severity: "ERROR"
    };

    expect(() => uc.handleRequest(-1, payload)).toThrowError();
  });

  it("Triggers the action for v1", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const payload = {
      sender: "a sender",
      message: "a message",
      severity: "ERROR"
    };
    uc.handleRequest(1, payload);

    expect(uc.action).toBeCalledWith("a sender", "ERROR", "a message");
  });

  it("Throws for an unsupported version", () => {
    const { uc } = makeTestRig();

    const mockCallback = jest.fn();
    const payload = {
      assetID: "anAsset",
      callback: mockCallback
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

  it("Submits a log", () => {
    const { appObjects, uc } = makeTestRig();
    const mockLog = jest.fn();
    appObjects.submitLog = mockLog;

    uc.action("Sender", "LOG", "A message");
    expect(mockLog).toBeCalledWith("[App 1] Sender", "A message");
  });

  it("Submits a warning", () => {
    const { appObjects, uc } = makeTestRig();
    const mockWarning = jest.fn();
    appObjects.submitWarning = mockWarning;

    uc.action("Sender", "WARNING", "A message");
    expect(mockWarning).toBeCalledWith("[App 1] Sender", "A message");
  });

  it("Submits an error", () => {
    const { appObjects, uc } = makeTestRig();
    const mockError = jest.fn();
    appObjects.submitError = mockError;

    uc.action("Sender", "ERROR", "A message");
    expect(mockError).toBeCalledWith("[App 1] Sender", "A message");
  });

  it("Submits an fatal error", () => {
    const { appObjects, uc } = makeTestRig();
    const mockFatal = jest.fn();
    appObjects.submitFatal = mockFatal;

    uc.action("Sender", "FATAL", "A message");
    expect(mockFatal).toBeCalledWith("[App 1] Sender", "A message");
  });
});
