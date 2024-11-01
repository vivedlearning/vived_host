import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeZSpaceHostEntity } from "../../ZSpaceHost";
import { makeHostHandlerEntity } from "../Entities";
import { makeIsZSpaceAvailableHandler } from "./IsZSpaceAvailableHandler";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const zSpace = makeZSpaceHostEntity(appObjects.getOrCreate("zSpace"));

  const uc = makeIsZSpaceAvailableHandler(ao);
  return { registerSpy, uc, zSpace };
}

describe("Is zSpace Available Base Handler", () => {
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

  it("Calls back with the zSpace Entity is supported flag", (done) => {
    const { uc, zSpace } = makeTestRig();

    const cb = (isSupported: boolean) => {
      expect(isSupported).toEqual(true);
      done();
    };

    zSpace.isSupported = true;

    uc.action(cb);
  });
});
