import {
  AppObject,
  AppObjectRepo,
  AppObjectUC,
  Version,
  VIVEDApp_3
} from "@vived/core";
import { HostDispatchEntity } from "../../../Dispatcher/Entities/HostDispatchEntity";
import { HostHandlerEntity } from "../../../Handler/Entities/HostHandler";
import { GetAppFromAPIUC } from "../../../VivedAPI/UCs/GetAppFromAPIUC";
import { AppEntity, AppState } from "../../Entities/AppEntity";
import { formAppIDWithVersion } from "../formAppIDWithVersion";

/**
 * Abstract base class for app mounting use cases.
 *
 * The MounterUC is responsible for loading, initializing, and managing app
 * lifecycle. It handles script loading, version management, and communication
 * setup between the host and app.
 *
 * @extends AppObjectUC from @vived/core
 */
export abstract class MounterUC extends AppObjectUC {
  static type = "MounterUC";

  /**
   * Mounts a specific version of the app.
   *
   * @param majorVersion - The major version number
   * @param minorVersion - The minor version number
   * @returns A promise that resolves when the app is mounted
   */
  abstract mount(majorVersion: number, minorVersion: number): Promise<void>;

  /**
   * Mounts the latest available version of the app.
   *
   * @returns A promise that resolves when the app is mounted
   */
  abstract mountLatestVersion(): Promise<void>;

  /**
   * Unmounts the app, removing it from the runtime environment.
   */
  abstract unmount(): void;

  /**
   * Loads a script into the document.
   *
   * @param scriptURL - URL of the script to load
   * @param appIDWithVersion - Versioned ID of the app
   * @returns A promise that resolves when the script is loaded
   */
  abstract loadScriptIntoDocument(
    scriptURL: string,
    appIDWithVersion: string
  ): Promise<void>; // Exposed for testing purposes

  /**
   * Gets the app interface for a specific version.
   *
   * @param version - The version to get the interface for
   * @returns The app interface or undefined if not found
   */
  abstract getAppInterface(version: Version): VIVEDApp_3 | undefined; // Exposed for test purposes

  /**
   * Retrieves the MounterUC component from an app object.
   *
   * @param appObject - The app object to get the component from
   * @returns The MounterUC component or undefined if not found
   */
  static get(appObject: AppObject) {
    return appObject.getComponent<MounterUC>(MounterUC.type);
  }

  /**
   * Retrieves the MounterUC component by app object ID.
   *
   * @param id - The ID of the app object
   * @param appObjects - The app object repository
   * @returns The MounterUC component or undefined if not found
   */
  static getById(id: string, appObjects: AppObjectRepo) {
    const ao = appObjects.get(id);
    return ao?.getComponent<MounterUC>(MounterUC.type);
  }
}

/**
 * Factory function to create a new MounterUC instance.
 *
 * @param appObject - The app object to attach the mounter to
 * @returns A new MounterUC instance
 */
export function makeMounterUC(appObject: AppObject): MounterUC {
  return new MounterUCImp(appObject);
}

/**
 * Concrete implementation of the MounterUC abstract class.
 *
 * This implementation provides the standard mounting behavior for loading
 * and initializing apps, handling script loading, and managing app lifecycle.
 */
class MounterUCImp extends MounterUC {
  /**
   * Gets the use case for retrieving apps from the API.
   */
  private get getAppFromAPI() {
    return this.getCachedSingleton<GetAppFromAPIUC>(GetAppFromAPIUC.type);
  }

  /**
   * Gets the app entity representing the app being mounted.
   */
  private get app() {
    return this.getCachedLocalComponent<AppEntity>(AppEntity.type);
  }

  /**
   * Gets the host handler entity for receiving messages from apps.
   */
  private get hostHandler() {
    return this.getCachedLocalComponent<HostHandlerEntity>(
      HostHandlerEntity.type
    );
  }

  /**
   * Gets the host dispatcher entity for sending messages to apps.
   */
  private get hostDispatcher() {
    return this.getCachedLocalComponent<HostDispatchEntity>(
      HostDispatchEntity.type
    );
  }

  /**
   * Helper method to find a specific version of the app.
   *
   * @param major - Major version number
   * @param minor - Minor version number
   * @returns The Version object or undefined if not found
   */
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

  /**
   * Tracks script elements added to the document to enable cleanup.
   */
  private scriptElements: HTMLScriptElement[] = [];

  /**
   * Mounts the latest available version of the app.
   *
   * @returns A promise that resolves when the app is mounted
   */
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

  /**
   * Unmounts the app, removing it from the runtime environment.
   *
   * This removes script elements, cleans up global references,
   * and resets app state.
   */
  unmount = () => {
    if (!this.app) return;
    if (!this.app.mountedVersion) return;

    const versionID = formAppIDWithVersion(this.app, this.app.mountedVersion);
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

  /**
   * Mounts a specific version of the app.
   *
   * This method fetches the app from the API, loads scripts,
   * establishes communication with the app, and waits for the
   * app to be ready.
   *
   * @param majorVersion - The major version number
   * @param minorVersion - The minor version number
   * @returns A promise that resolves when the app is mounted
   */
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

  /**
   * Loads app scripts and retrieves the app interface.
   *
   * @param scripts - Array of script URLs to load
   * @param version - The app version
   * @returns A promise that resolves with the app interface
   */
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
    const versionID = formAppIDWithVersion(app, version);

    if (appInterface) {
      return Promise.resolve(appInterface);
    }

    return new Promise<VIVEDApp_3>((resolve, reject) => {
      const loaders = scripts.map((entryPoint) => {
        return this.loadScriptIntoDocument(entryPoint, versionID);
      });
      Promise.all(loaders)
        .then(() => {
          appInterface = this.getAppInterface(version);

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

  /**
   * Loads a script into the document.
   *
   * @param scriptURL - URL of the script to load
   * @param appIDWithVersion - Versioned ID of the app
   * @returns A promise that resolves when the script is loaded
   */
  loadScriptIntoDocument = (
    scriptURL: string,
    appIDWithVersion: string
  ): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const aScript = document.createElement("script");

      aScript.onload = function onLoad() {
        resolve();
      };

      aScript.onerror = function onError(e) {
        reject(new Error(`Failed to add script to document`));
      };

      aScript.type = "text/javascript";
      aScript.src = scriptURL;
      aScript.className = appIDWithVersion;
      this.scriptElements.push(aScript);

      document.head.appendChild(aScript);
    });
  };

  /**
   * Gets the app interface for a specific version.
   *
   * @param version - The version to get the interface for
   * @returns The app interface or undefined if not found
   */
  getAppInterface = (version: Version): VIVEDApp_3 | undefined => {
    if (!this.app) return;

    const versionID = formAppIDWithVersion(this.app, version);

    let appInterface = (window as any)[versionID] as VIVEDApp_3;

    if (!appInterface) {
      appInterface = (window as any)[this.app.id] as VIVEDApp_3; // Old way of identifying apps
    }

    return appInterface;
  };

  /**
   * Parses app entrypoints into scripts and styles.
   *
   * @param endpoints - Array of endpoint URLs
   * @returns Object with separate arrays for scripts and styles
   */
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

  /**
   * Waits for an app to report it's ready.
   *
   * This method handles special cases for apps that don't properly
   * report their ready state, as well as the normal case where
   * apps transition to the READY state.
   *
   * @param app - The app entity
   * @param appVersion - The app version
   * @returns A promise that resolves when the app is ready
   */
  waitForAppIsReady(app: AppEntity, appVersion: Version): Promise<void> {
    // Edge cases here
    if (
      app.id === "app4e48fbaa815a4857821bf7569b003751" &&
      appVersion.major === 1 &&
      appVersion.minor === 0
    ) {
      // Mark board app has a problem with version 1.0
      app.state = AppState.READY;
      return Promise.resolve();
    }

    if (
      app.id === "appe860b51f49414e20ae7995dff4d9b152" &&
      appVersion.major === 1 &&
      appVersion.minor <= 2
    ) {
      // Older versions of the text app do not report when ready
      app.state = AppState.READY;
      return Promise.resolve();
    }

    if (
      app.id === "app41df8a36f628451d9f633f8a9bdf3edb" &&
      appVersion.major === 1 &&
      appVersion.minor <= 1
    ) {
      // Older versions of the YouTube app do not report when ready
      app.state = AppState.READY;
      return Promise.resolve();
    }

    if (app.id === "app448f8f293fbb493a9e233f113ce8b56a") {
      // Asset Plugin
      app.state = AppState.READY;
      return Promise.resolve();
    }

    // Allows testing to not get hung up waiting for this
    if (app.id === "APP_FOR_JEST_TEST") {
      // Older versions of the YouTube app do not report when ready
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

  /**
   * Creates a new MounterUCImp instance.
   *
   * @param appObject - The app object to attach to
   */
  constructor(appObject: AppObject) {
    super(appObject, MounterUC.type);
  }
}
