import { reject, Rejected, resolve, Result } from "./Result";

describe("Result", () => {
  it("Resolve is marked as resolved", () => {
    const result = resolve("OK Value");
    expect(result.isResolved).toEqual(true);
  });

  it("Resolve is not marked as rejected", () => {
    const result = resolve("OK Value");
    expect(result.isRejected).toEqual(false);
  });

  it("Reject is not marked as resolved", () => {
    const result = reject("Error");
    expect(result.isResolved).toEqual(false);
  });

  it("Reject is marked as rejected", () => {
    const result = reject("Error");
    expect(result.isRejected).toEqual(true);
  });

  it("A resolve triggers then with the value", () => {
    const result = resolve("OK Value");

    const thenMock = jest.fn();

    result.then(thenMock);

    expect(thenMock).toBeCalledWith("OK Value");
  });

  it("A resolve does not trigger catch", () => {
    const result = resolve("OK Value");

    const thenMock = jest.fn();
    const catchMock = jest.fn();

    result.then(thenMock).catch(catchMock);
    expect(catchMock).not.toBeCalled();
  });

  it("Rejects triggers catch with the reject error", () => {
    const someError = new Error("Some Error");
    const result = reject(someError);

    const catchMock = jest.fn();

    result.catch(catchMock);

    expect(catchMock).toBeCalledWith(someError);
  });

  it("Reject does not trigger then", () => {
    const someError = new Error("Some Error");
    const result = reject(someError);

    const thenMock = jest.fn();
    const catchMock = jest.fn();

    result.then(thenMock).catch(catchMock);

    expect(thenMock).not.toBeCalled();
  });

  it("Resolved function exposes the value", () => {
    const result = resolve("OK Value");
    expect(result.value).toEqual("OK Value");
  });

  it("Sets a Resolved error to undefinded", () => {
    const result = resolve("OK Value");
    expect(result.error).toBeUndefined();
  });

  it("Rejected function exposes the error", () => {
    const someError = new Error("Some Error");
    const result = reject(someError);
    expect(result.error).toEqual(someError);
  });

  it("Sets a Rejected value to undefinded", () => {
    const someError = new Error("Some Error");
    const result = reject(someError);
    expect(result.value).toBeUndefined();
  });

  it("Allows an undefined function to reject", ()=>{
    const resultFunction = (rejectResult: boolean): Result<undefined, Error> => {
      if(rejectResult)
      {
        return reject(new Error("Uh Oh!"));
      } else {
        return resolve(undefined);
      }
    }

    const catchMock = jest.fn();
    resultFunction(true).catch(catchMock);

    expect(catchMock).toBeCalled();
  })

  it("Can be typed", () => {
    const mockError = new MockError();
    const mockFunction = (
      throwError: boolean
    ): Result<MockReturnType, MockError> => {
      if (throwError) {
        return reject(mockError);
      } else {
        return resolve({ foo: "bar" });
      }
    };

    const mockThen = jest.fn();
    mockFunction(false).then(mockThen);
    expect(mockThen).toBeCalledWith({ foo: "bar" });

    const mockCatch = jest.fn();
    mockFunction(true).catch(mockCatch);
    expect(mockCatch).toBeCalledWith(mockError);
  });
});

type MockReturnType = {
  foo: string;
};

class MockError extends Error {
  constructor() {
    super();
  }
}
