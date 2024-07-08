import { makeHostHandler } from "../../../Entities";
import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeHostHandlerEntity } from "../Entities";
import { makeSubmitActivityAssetHandler } from "./SubmitActivityAssetHandler";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const uc = makeSubmitActivityAssetHandler(ao);

  const fileBits: BlobPart[] = ["test", "file"];
  const testFile: File = new File(fileBits, "filename.jpg");

  return { registerSpy, uc, testFile };
}

describe("Submit Activity Asset Base Handler", () => {
  it("Registers as a handler when constructed", () => {
    const { registerSpy, uc } = makeTestRig();
    expect(registerSpy).toBeCalledWith(uc);
  });

  it("Throws an error if the action is not overwritten", () => {
    const { uc, testFile } = makeTestRig();

    expect(() => uc.action(testFile, jest.fn())).toThrowError();
  });

  it("Triggers the action for v1", () => {
    const { uc, testFile } = makeTestRig();
    uc.action = jest.fn();

    const mockCallback = jest.fn();
    const payload = {
      assetFile: testFile,
      callback: mockCallback
    };
    uc.handleRequest(1, payload);

    expect(uc.action).toBeCalledWith(testFile, mockCallback);
  });

  it("Throws for an unsupported version", () => {
    const { uc, testFile } = makeTestRig();

    const mockCallback = jest.fn();
    const payload = {
      assetFile: testFile,
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
