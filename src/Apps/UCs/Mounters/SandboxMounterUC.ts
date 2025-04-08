import { AppObject, Version, VIVEDApp_3 } from "@vived/core";
import {
  AppSandboxEntity,
  SandboxState
} from "../../../AppSandbox/Entities/AppSandboxEntity";
import { HostDispatchEntity } from "../../../Dispatcher/Entities/HostDispatchEntity";
import { HostHandlerEntity } from "../../../Handler/Entities/HostHandler";
import { AppEntity, AppState } from "../../Entities/AppEntity";
import { MounterUC } from "./MounterUC";

/**
 * Factory function to create a sandbox mounter for apps.
 *
 * The sandbox mounter is designed to mount apps in a sandboxed environment,
 * providing isolation and security for app execution.
 *
 * @param appObject - The app object to attach the mounter to
 * @returns A new SandboxMounterUC instance
 */
export function makeSandboxMounter(appObject: AppObject): MounterUC {
  return new SandboxMounterUC(appObject);
}

/**
 * Implementation of MounterUC for mounting apps in a sandbox environment.
 *
 * The SandboxMounterUC is responsible for safely loading and initializing apps
 * in a sandboxed context, handling app lifecycle events, and managing the
 * communication between the host and app.
 */
class SandboxMounterUC extends MounterUC {
  /**
   * Gets the app entity representing the app being mounted
   */
  private get appEntity() {
    return this.getCachedLocalComponent<AppEntity>(AppEntity.type);
  }

  /**
   * Gets the host dispatcher entity for sending messages to apps
   */
  private get hostDispatcher() {
    return this.getCachedLocalComponent<HostDispatchEntity>(
      HostDispatchEntity.type
    );
  }

  /**
   * Gets the host handler entity for receiving messages from apps
   */
  private get hostHandler() {
    return this.getCachedLocalComponent<HostHandlerEntity>(
      HostHandlerEntity.type
    );
  }

  /**
   * Gets the sandbox entity that manages the sandbox state
   */
  private get sandbox() {
    return this.getCachedSingleton<AppSandboxEntity>(AppSandboxEntity.type);
  }

  /**
   * Mounts the latest version of the app.
   *
   * @returns A promise that resolves when the app is mounted or rejects if an error occurs
   */
  mountLatestVersion = (): Promise<void> => {
    if (!this.appEntity) {
      this.error("Missing Components");
      return Promise.reject();
    }

    const version = this.appEntity.latestVersion;
    if (!version) {
      this.error("No Version");
      return Promise.reject();
    }

    return this.mount(version.major, version.minor);
  };

  /**
   * Mounts a specific version of the app.
   *
   * @param majorVersion - The major version number
   * @param minorVersion - The minor version number
   * @returns A promise that resolves when the app is mounted or rejects if an error occurs
   */
  mount = (majorVersion: number, minorVersion: number): Promise<void> => {
    if (
      !this.appEntity ||
      !this.hostDispatcher ||
      !this.hostHandler ||
      !this.sandbox
    ) {
      this.error("Missing Components");
      return Promise.reject();
    }

    const version = this.getAppVersion(majorVersion, minorVersion);
    if (!version) {
      this.error("No Version");
      return Promise.reject();
    }

    const appInterface = this.getAppInterface(version);
    if (!appInterface) {
      this.error("No App Interface");
      return Promise.reject();
    }

    const appHandler = appInterface.mount(this.hostHandler.handler);
    this.hostDispatcher.registerAppHandler(appHandler);

    const app = this.appEntity;
    const sandbox = this.sandbox;

    return new Promise((resolve) => {
      const waitForReady = () => {
        if (app.state === AppState.READY) {
          sandbox.state = SandboxState.MOUNTED;
          app.removeChangeObserver(waitForReady);
          resolve();
        }
      };

      app.addChangeObserver(waitForReady);
    });
  };

  /**
   * Helper method to find a specific version of the app.
   *
   * @param major - Major version number
   * @param minor - Minor version number
   * @returns The Version object or undefined if not found
   */
  private getAppVersion(major: number, minor: number): Version | undefined {
    if (!this.appEntity) {
      return;
    }

    let appVersion = Version.GetLatestWithMajorMinor(
      this.appEntity.versions,
      major,
      minor
    );

    if (!appVersion) {
      appVersion = Version.GetLatestWithMajor(this.appEntity.versions, major);
    }

    if (!appVersion) {
      this.error(
        `Unable to find version ${major}.${minor}.X for App ${this.appEntity.name}`
      );
    }

    return appVersion;
  }

  /**
   * Unmounts the app from the sandbox.
   */
  unmount = (): void => {
    if (!this.sandbox || !this.hostDispatcher) {
      this.error("Missing Components");
      return;
    }

    this.hostDispatcher.clearAppHandler();

    this.sandbox.state = SandboxState.UNMOUNTED;
  };

  /**
   * Loads a script into the document.
   * This is a placeholder implementation for sandbox mounting.
   *
   * @param scriptURL - URL of the script to load
   * @param appIDWithVersion - Versioned ID of the app
   * @returns A promise that resolves when the script is loaded
   */
  loadScriptIntoDocument(
    scriptURL: string,
    appIDWithVersion: string
  ): Promise<void> {
    // Unused during dev
    return Promise.resolve();
  }

  /**
   * Gets the app interface for a specific version.
   *
   * @param version - The version to get the interface for
   * @returns The app interface or undefined if not found
   */
  getAppInterface(version: Version): VIVEDApp_3 | undefined {
    const modifiedVersion = version.baseVersionString.split(".").join("_");
    const idWithVersion = `${this.appObject.id}-${modifiedVersion}`;
    const appInterface = (window as any)[idWithVersion] as VIVEDApp_3;
    if (!appInterface) {
      this.appObjects.submitFatal(
        "LocalMounterUC",
        "Unable to find App Interface"
      );
      return;
    }

    return appInterface;
  }

  /**
   * Creates a new SandboxMounterUC instance.
   *
   * @param appObject - The app object to attach to
   */
  constructor(appObject: AppObject) {
    super(appObject, MounterUC.type);
  }
}
