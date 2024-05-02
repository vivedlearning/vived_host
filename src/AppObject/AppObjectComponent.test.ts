import { AppObject, makeAppObject } from "./AppObject";
import { AppObjectComponent } from "./AppObjectComponent";
import { makeAppObjectRepo } from "./AppObjectRepo";

function makeTestRig() {
  const appObjectRepo = makeAppObjectRepo();
  const appObj = makeAppObject("appObj", appObjectRepo);
  const appObjectComponent = new AppObjectComponent(appObj, "aComponent");

  return { appObjectComponent, appObj, appObjectRepo };
}

describe("App Object Component", () => {
  it("Sets the type", () => {
    const { appObjectComponent } = makeTestRig();
    expect(appObjectComponent.type).toEqual("aComponent");
  });

  it("Stores the app object", () => {
    const { appObjectComponent, appObj } = makeTestRig();
    expect(appObjectComponent.appObject).toEqual(appObj);
  });

  it("Adds itself to the app object", () => {
    const { appObjectComponent, appObj } = makeTestRig();

    expect(appObj.hasComponent(appObjectComponent.type)).toEqual(true);
  });

  it("Removes itself from the app object when disposed", () => {
    const { appObjectComponent, appObj } = makeTestRig();

    appObjectComponent.dispose();

    expect(appObj.hasComponent(appObjectComponent.type)).toEqual(false);
  });

  it("Returns the repo", () => {
    const { appObjectComponent, appObjectRepo } = makeTestRig();
    expect(appObjectComponent.appObjects).toEqual(appObjectRepo);
  });

  it("Forwards a warn to the App Object Repo warn", () => {
    const { appObjectComponent, appObjectRepo } = makeTestRig();
    appObjectRepo.submitWarning = jest.fn();

    appObjectComponent.warn("Some warning");

    expect(appObjectRepo.submitWarning).toBeCalledWith(
      `appObj/aComponent`,
      "Some warning"
    );
  });

  it("Forwards a log to the App Object Repo log", () => {
    const { appObjectComponent, appObjectRepo } = makeTestRig();
    appObjectRepo.submitLog = jest.fn();

    appObjectComponent.log("Some log");

    expect(appObjectRepo.submitLog).toBeCalledWith(
      `appObj/aComponent`,
      "Some log"
    );
  });

  it("Forwards an error to the App Object Repo error", () => {
    const { appObjectComponent, appObjectRepo } = makeTestRig();
    appObjectRepo.submitError = jest.fn();

    appObjectComponent.error("Some error");

    expect(appObjectRepo.submitError).toBeCalledWith(
      `appObj/aComponent`,
      "Some error"
    );
  });

  it("Gets a singleton", () => {
    const { appObjectComponent, appObjectRepo } = makeTestRig();
    const mockSingleton = new MockComponent(
      appObjectRepo.getOrCreate("Some other")
    );

    const returned = appObjectComponent.getSingleton<MockComponent>(
      MockComponent.type
    );

    expect(returned).toEqual(mockSingleton);
  });

  it("Warns by default if the singleton cannot be found", () => {
    const { appObjectComponent, appObjectRepo } = makeTestRig();

    appObjectComponent.warn = jest.fn();
    appObjectRepo.submitWarning = jest.fn();

    appObjectComponent.getSingleton<MockComponent>(MockComponent.type);

    expect(appObjectComponent.warn).toBeCalled();
  });

  it("Errors if the singleton cannot be found", () => {
    const { appObjectComponent, appObjectRepo } = makeTestRig();

    appObjectComponent.error = jest.fn();
    appObjectRepo.submitWarning = jest.fn();

    appObjectComponent.getSingleton<MockComponent>(MockComponent.type, "ERROR");

    expect(appObjectComponent.error).toBeCalled();
  });

  it("Logs if the singleton cannot be found", () => {
    const { appObjectComponent, appObjectRepo } = makeTestRig();

    appObjectComponent.log = jest.fn();
    appObjectRepo.submitWarning = jest.fn();

    appObjectComponent.getSingleton<MockComponent>(MockComponent.type, "LOG");

    expect(appObjectComponent.log).toBeCalled();
  });

  it("Warns if the singleton cannot be found", () => {
    const { appObjectComponent, appObjectRepo } = makeTestRig();

    appObjectComponent.warn = jest.fn();
    appObjectRepo.submitWarning = jest.fn();

    appObjectComponent.getSingleton<MockComponent>(MockComponent.type, "WARN");

    expect(appObjectComponent.warn).toBeCalled();
  });

  it("Gets a cached singleton", () => {
    const { appObjectComponent, appObjectRepo } = makeTestRig();
    const mockSingleton = new MockComponent(
      appObjectRepo.getOrCreate("Some other")
    );

    const returned = appObjectComponent.getCachedSingleton<MockComponent>(
      MockComponent.type
    );

    expect(returned).toEqual(mockSingleton);
  });

  it("Gets a cached singleton from the local cache", () => {
    const { appObjectComponent, appObjectRepo } = makeTestRig();

    const spy = jest.spyOn(appObjectRepo, "getSingleton");

    new MockComponent(appObjectRepo.getOrCreate("Some other"));

    appObjectComponent.getCachedSingleton<MockComponent>(MockComponent.type);
    appObjectComponent.getCachedSingleton<MockComponent>(MockComponent.type);
    appObjectComponent.getCachedSingleton<MockComponent>(MockComponent.type);
    appObjectComponent.getCachedSingleton<MockComponent>(MockComponent.type);

    expect(spy).toBeCalledTimes(1);
  });

  it("Warns if the cached singleton cannot be found", () => {
    const { appObjectComponent, appObjectRepo } = makeTestRig();

    appObjectComponent.warn = jest.fn();
    appObjectRepo.submitWarning = jest.fn();

    appObjectComponent.getCachedSingleton<MockComponent>(MockComponent.type);

    expect(appObjectComponent.warn).toBeCalled();
  });
});

class MockComponent extends AppObjectComponent {
  static type = "MockComponent";

  constructor(appObject: AppObject) {
    super(appObject, MockComponent.type);
  }
}
