import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { Handler, VIVEDApp_3 } from "../../../Types";
import { Version, VersionStage } from "../../../ValueObjects";
import { makeHostDispatchEntity } from "../../Dispatcher";
import { makeHostHandlerEntity } from "../../Handler";
import { AppState, makeAppEntity } from "../Entities";
import { makeMounterUC } from "./MounterUC";
import { makeMockGetAppFromAPIUC } from "../../VivedAPI/Mocks/MockGetAppFromAPIUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

  const ao = appObjects.getOrCreate("APP_FOR_JEST_TEST");

  const app = makeAppEntity(ao);
  const hostHandler = makeHostHandlerEntity(ao);
  const hostDispatcher = makeHostDispatchEntity(ao);
  app.versions = [
    new Version(0, 1, 0, VersionStage.RELEASED),
    new Version(0, 2, 0, VersionStage.RELEASED)
  ];

  const appHandler = jest.fn();
  const mockApp: VIVEDApp_3 = {
    mount: (hostHandler: Handler) => {
      return appHandler;
    },
    mountDev: (container: HTMLElement) => {}
  };

  const mockAPIFetch = jest.fn();
  mockAPIFetch.mockResolvedValue({
    interfaceVersion: "1.2.3",
    assetFolderURL: "https://www.someurl.com/apps/app0/0.1.0/assets",
    entrypoints: [
      "www.script1.js",
      "www.script2.js",
      "www.style1.css",
      "www.style2.css"
    ]
  });

  const mockGetFromApi = makeMockGetAppFromAPIUC(appObjects);
  mockGetFromApi.getApp = mockAPIFetch;

  const uc = makeMounterUC(ao);
  uc.log = jest.fn();

  const mockLoadScript = jest.fn().mockResolvedValue(undefined);
  uc.loadScriptIntoDocument = mockLoadScript;

  const mockGetInterface = jest.fn().mockReturnValue(mockApp);
  uc.getAppInterface = mockGetInterface;

  return {
    uc,
    mockGetFromApi,
    mockLoadScript,
    app,
    mockAPIFetch,
    mockApp,
    appHandler,
    hostDispatcher,
    hostHandler,
    mockGetInterface
  };
}

describe("Initialize App UC", () => {
  it("Successfully loads an app", async () => {
    const { uc, app } = makeTestRig();

    await uc.mount(0, 1);

    expect(app.isMounted).toEqual(true);
    expect(app.mountedVersion!.displayString).toEqual("0.1.0");
    expect(app.appAssetFolderURL).toEqual(
      "https://www.someurl.com/apps/app0/0.1.0/assets"
    );
    expect(app.styles.length).toEqual(2);
  });

  it("App is immediately set to loading", () => {
    const { uc, app } = makeTestRig();

    uc.mount(0, 1);

    expect(app.state).toEqual(AppState.LOADING);
  });

  it("Rejects if the api fetch fails and sets the app state to error", async () => {
    const { uc, app, mockAPIFetch } = makeTestRig();
    mockAPIFetch.mockRejectedValue(new Error("Some Error"));

    await expect(uc.mount(0, 1)).rejects.toEqual(new Error("Some Error"));

    expect(app.state).toBe(AppState.ERROR);
  });

  it("Rejects if the app loader fails and sets the app state to error", async () => {
    const { uc, app, mockLoadScript, mockGetInterface } = makeTestRig();

    mockLoadScript.mockRejectedValue(new Error("Some Error"));
    mockGetInterface.mockReturnValue(undefined);

    await expect(uc.mount(0, 1)).rejects.toEqual(new Error("Some Error"));

    expect(app.state).toBe(AppState.ERROR);
  });

  it("Should unmounts a previous version of the app if it is not the right version", async () => {
    const { uc } = makeTestRig();

    await uc.mount(0, 1);

    uc.unmount = jest.fn();

    await uc.mount(0, 2);

    expect(uc.unmount).toBeCalled();
  });

  it("Does not try to download an app if it is already loaded with the correct version", async () => {
    const { uc, app, mockAPIFetch } = makeTestRig();

    app.mountedVersion = new Version(0, 1, 0, VersionStage.RELEASED);

    await uc.mount(0, 1);

    expect(mockAPIFetch).not.toBeCalled();
  });

  it("Kicks off the API call", async () => {
    const { uc, mockAPIFetch } = makeTestRig();

    await uc.mount(0, 1);

    expect(mockAPIFetch).toBeCalledWith("APP_FOR_JEST_TEST", "0.1.0");
  });

  it("Stores the styles", async () => {
    const { uc, app } = makeTestRig();

    app.styles = ["someOtherStyle"];

    await uc.mount(0, 1);

    expect(app.styles).toEqual(["www.style1.css", "www.style2.css"]);
  });

  it("Loads the scripts if the interface does not exist", async () => {
    const { uc, mockLoadScript, mockGetInterface, mockApp } = makeTestRig();

    mockGetInterface.mockReturnValueOnce(undefined).mockReturnValue(mockApp);

    await uc.mount(0, 1);

    expect(mockLoadScript).toBeCalledTimes(2);
  });

  it("Does not load the scripts if the interface exist", async () => {
    const { uc, mockLoadScript, mockGetInterface, mockApp } = makeTestRig();

    mockGetInterface.mockReturnValue(mockApp);

    await uc.mount(0, 1);

    expect(mockLoadScript).toBeCalledTimes(0);
  });

  it("Calls Mount on the App, passing the host handler", async () => {
    const { mockApp, hostHandler, uc } = makeTestRig();

    const mountSpy = jest.spyOn(mockApp, "mount");

    await uc.mount(0, 1);

    expect(mountSpy).toBeCalledWith(hostHandler.handler);
  });

  it("Registers the app handler", async () => {
    const { appHandler, hostDispatcher, uc } = makeTestRig();

    const registerSpy = jest.spyOn(hostDispatcher, "registerAppHandler");

    await uc.mount(0, 1);

    expect(registerSpy).toBeCalledWith(appHandler);
  });
});
