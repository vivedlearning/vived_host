import { makeAppObjectRepo } from "@vived/core";
import { makeAppEntity } from "../../Apps";
import { makeHostHandlerEntity } from "../Entities";
import { makeGetAssetFolderURLHandler } from "./GetAssetFolderURLHandler";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const app = makeAppEntity(ao);
  app.appAssetFolderURL = "some/folder";

  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const uc = makeGetAssetFolderURLHandler(ao);
  return { registerSpy, uc };
}

describe("Get Asset Folder URL Handler", () => {
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

  it("Calls back the folder", () => {
    const { uc } = makeTestRig();

    const cb = jest.fn();

    uc.action(cb);

    expect(cb).toBeCalledWith("some/folder");
  });
});
