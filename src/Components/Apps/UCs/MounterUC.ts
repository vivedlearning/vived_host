import {
  HostAppObject,
  HostAppObjectRepo,
  HostAppObjectUC
} from "../../../HostAppObject";
import { VIVEDApp_3 } from "../../../Types";
import { Version } from "../../../ValueObjects";
import { HostDispatchEntity } from "../../Dispatcher";
import { HostHandlerEntity } from "../../Handler";
import { GetAppFromAPIUC } from "../../VivedAPI";
import { AppEntity, AppState } from "../Entities";
import { appIDWithVersion } from "./appIDWithVersion";

export abstract class MounterUC extends HostAppObjectUC {
  static type = "MounterUC";

  abstract mount(majorVersion: number, minorVersion: number): Promise<void>;
  abstract mountLatestVersion(): Promise<void>;
  abstract unmount(): void;
  abstract loadScriptIntoDocument(
    scriptURL: string,
    appIDWithVersion: string
  ): Promise<void>; // Exposed for testing purposes
  abstract getAppInterface(version: Version): VIVEDApp_3 | undefined; // Exposed for test purposes

  static get(appObject: HostAppObject) {
    return appObject.getComponent<MounterUC>(MounterUC.type);
  }

  static getById(id: string, appObjects: HostAppObjectRepo) {
    const ao = appObjects.get(id);
    return ao?.getComponent<MounterUC>(MounterUC.type);
  }
}


export function makeMounterUC(appObject: HostAppObject): MounterUC {
  return new MounterUCImp(appObject);
}

class MounterUCImp extends MounterUC {
  private get getAppFromAPI() {
    return this.getCachedSingleton<GetAppFromAPIUC>(GetAppFromAPIUC.type);
  }

  private get app() {
    return this.getCachedLocalComponent<AppEntity>(AppEntity.type);
  }

  private get hostHandler() {
    return this.getCachedLocalComponent<HostHandlerEntity>(
      HostHandlerEntity.type
    );
  }

  private get hostDispatcher() {
    return this.getCachedLocalComponent<HostDispatchEntity>(
      HostDispatchEntity.type
    );
  }

  private getAppVersion(major: number, minor: number): Version | undefined {
    if (!this.app) {
      return;
    }

    let appVersion = Version.GetLatestWithMajorMinor(
      this.app.versions,
      major,
      minor
    );

    if (!appVersion) {
      appVersion = Version.GetLatestWithMajor(this.app.versions, major);
    }

    if (!appVersion) {
      this.error(
        `Unable to find version ${major}.${minor}.X for App ${this.app.name}`
      );
    }

    return appVersion;
  }

  private scriptElements: HTMLScriptElement[] = [];

  mountLatestVersion(): Promise<void> {
    if (!this.app) {
      this.error("Missing Components");
      return Promise.reject();
    }

    const version = this.app.latestVersion;
    if (!version) {
      this.error("No Version");
      return Promise.reject();
    }

    return this.mount(version.major, version.minor);
  }

  unmount = () => {
    if (!this.app) return;
    if (!this.app.mountedVersion) return;

    const versionID = appIDWithVersion(this.app, this.app.mountedVersion);
    (window as any)[versionID] = undefined;
    delete (window as any)[versionID];

    this.scriptElements.forEach((element) => {
      element.remove();
    });
    this.scriptElements = [];

    this.app.styles = [];
    this.app.appAssetFolderURL = undefined;
    this.app.mountedVersion = undefined;
    this.app.state = AppState.INIT;
  };

  mount = (majorVersion: number, minorVersion: number): Promise<void> => {
    const fetchApp = this.getAppFromAPI;
    if (!fetchApp) {
      this.error("No Fetch App UC");
      return Promise.reject();
    }

    const app = this.app;
    if (!app) {
      this.error("No App");
      return Promise.reject();
    }

    const hostHandler = this.hostHandler;
    if (!hostHandler) {
      this.error("No Host Handler");
      return Promise.reject();
    }

    const hostDispatcher = this.hostDispatcher;
    if (!hostDispatcher) {
      this.error("No Host Dispatcher");
      return Promise.reject();
    }

    const version = this.getAppVersion(majorVersion, minorVersion);
    if (!version) {
      return Promise.reject(
        new Error(
          `Unable to find version ${majorVersion}.${minorVersion}.X for App ${app.name}`
        )
      );
    }

    this.log(
      `Initializing App ${app.name} [${app.id}] version ${version.displayString}`
    );

    if (app.mountedVersion) {
      if (Version.AreEqual(app.mountedVersion, version)) {
        return Promise.resolve();
      } else {
        this.unmount();
      }
    }

    app.state = AppState.LOADING;

    return new Promise<void>((resolve, reject) => {
      fetchApp
        .getApp(this.appObject.id, version.baseVersionString)
        .then((appDTO) => {
          app.appAssetFolderURL = appDTO.assetFolderURL;
          const { scripts, styles } = this.parseEndpoints(appDTO.entrypoints);
          app.styles = styles;
          return this.loadScripts(scripts, version);
        })
        .then((appInterface) => {
          const appHandler = appInterface.mount(hostHandler.handler);
          hostDispatcher.registerAppHandler(appHandler);
          return this.waitForAppIsReady(app, version);
        })
        .then(() => {
          app.mountedVersion = version;
          resolve();
        })
        .catch((e) => {
          app.state = AppState.ERROR;
          reject(e);
        });
    });
  };

  private loadScripts = (
    scripts: string[],
    version: Version
  ): Promise<VIVEDApp_3> => {
    const app = this.app;
    if (!app) {
      this.error("No app entity");
      return Promise.reject();
    }

    let appInterface = this.getAppInterface(version);
    const versionID = appIDWithVersion(app, version);

    if (appInterface) {
      return Promise.resolve(appInterface);
    }

    return new Promise<VIVEDApp_3>((resolve, reject) => {
      const loaders = scripts.map((entryPoint) => {
        return this.loadScriptIntoDocument(entryPoint, versionID);
      });
      Promise.all(loaders)
        .then(() => {
          let appInterface = this.getAppInterface(version);

          if (!appInterface) {
            reject(
              "App is undefined for ID: " +
                app.id +
                ". Make sure ID is correct in the 3 files in the app project."
            );
          } else {
            resolve(appInterface);
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  };

  loadScriptIntoDocument = (
    scriptURL: string,
    appIDWithVersion: string
  ): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const aScript = document.createElement("script");

      aScript.onload = function () {
        resolve();
      };

      aScript.onerror = function (e) {
        reject(new Error(`Failed to add script to document`));
      };

      aScript.type = "text/javascript";
      aScript.src = scriptURL;
      aScript.className = appIDWithVersion;
      this.scriptElements.push(aScript);

      document.head.appendChild(aScript);
    });
  };

  getAppInterface = (version: Version): VIVEDApp_3 | undefined => {
    if (!this.app) return;

    const versionID = appIDWithVersion(this.app, version);

    let appInterface = (window as any)[versionID] as VIVEDApp_3;

    if (!appInterface) {
      appInterface = (window as any)[this.app.id] as VIVEDApp_3; //Old way of identifying apps
    }

    return appInterface;
  };

  private parseEndpoints(endpoints: string[]): {
    scripts: string[];
    styles: string[];
  } {
    const scripts: string[] = [];
    const styles: string[] = [];

    endpoints.forEach((endpoint) => {
      if (endpoint.includes(".js")) {
        scripts.push(endpoint);
      } else if (endpoint.includes(".css")) {
        styles.push(endpoint);
      } else {
        this.warn("Unknown endpoint: " + endpoint);
      }
    });

    return {
      scripts,
      styles
    };
  }

  waitForAppIsReady(app: AppEntity, appVersion: Version): Promise<void> {
    //Edge cases here
    if (
      app.id === "app4e48fbaa815a4857821bf7569b003751" &&
      appVersion.major === 1 &&
      appVersion.minor === 0
    ) {
      //Mark board app has a problem with version 1.0
      app.state = AppState.READY;
      return Promise.resolve();
    }

    if (
      app.id === "appe860b51f49414e20ae7995dff4d9b152" &&
      appVersion.major === 1 &&
      appVersion.minor <= 2
    ) {
      //Older versions of the text app do not report when ready
      app.state = AppState.READY;
      return Promise.resolve();
    }

    if (
      app.id === "app41df8a36f628451d9f633f8a9bdf3edb" &&
      appVersion.major === 1 &&
      appVersion.minor <= 1
    ) {
      //Older versions of the YouTube app do not report when ready
      app.state = AppState.READY;
      return Promise.resolve();
    }

    if (app.id === "app448f8f293fbb493a9e233f113ce8b56a") {
      //Asset Plugin
      app.state = AppState.READY;
      return Promise.resolve();
    }

    //Allows testing to not get hung up waiting for this
    if (app.id === "APP_FOR_JEST_TEST") {
      //Older versions of the YouTube app do not report when ready
      app.state = AppState.READY;
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      const appObserver = () => {
        if (app.state === AppState.READY) {
          app.removeChangeObserver(appObserver);
          resolve();
        }
      };
      app.addChangeObserver(appObserver);
    });
  }

  constructor(appObject: HostAppObject) {
    super(appObject, MounterUC.type);
  }
}
