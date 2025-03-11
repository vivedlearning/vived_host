import { makeAppObjectRepo } from "@vived/core";
import { makeMockStartZSpaceUC } from "../../ZSpaceHost/Mocks/MockStartZSpaceUC";
import { makeHostHandlerEntity } from "../Entities";
import { makeStartZSpaceHandler } from "./StartZSpaceHandler";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const mockUC = makeMockStartZSpaceUC(appObjects);

  const uc = makeStartZSpaceHandler(ao);
  return { registerSpy, uc, mockUC };
}

describe("Start ZSpace handler", () => {
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

  it("Calls the UC", () => {
    const { uc, mockUC } = makeTestRig();

    uc.action();
    expect(mockUC.startZSpace).toBeCalled();
  });
});
