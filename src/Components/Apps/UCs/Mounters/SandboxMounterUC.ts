import { HostAppObject } from "../../../../HostAppObject/HostAppObject";
import { VIVEDApp_3 } from "../../../../Types/PluginBoundary";
import { Version } from "../../../../ValueObjects/Version";
import {
  AppSandboxEntity,
  SandboxState
} from "../../../AppSandbox/Entities/AppSandboxEntity";
import { HostDispatchEntity } from "../../../Dispatcher/Entities/HostDispatchEntity";
import { HostHandlerEntity } from "../../../Handler/Entities/HostHandler";
import { AppEntity, AppState } from "../../Entities/AppEntity";
import { MounterUC } from "./MounterUC";

export function makeSandboxMounter(appObject: HostAppObject): MounterUC {
  return new SandboxMounterUC(appObject);
}

class SandboxMounterUC extends MounterUC {
  private get appEntity() {
    return this.getCachedLocalComponent<AppEntity>(AppEntity.type);
  }

  private get hostDispatcher() {
    return this.getCachedLocalComponent<HostDispatchEntity>(
      HostDispatchEntity.type
    );
  }

  private get hostHandler() {
    return this.getCachedLocalComponent<HostHandlerEntity>(
      HostHandlerEntity.type
    );
  }

  private get sandbox() {
    return this.getCachedSingleton<AppSandboxEntity>(AppSandboxEntity.type);
  }

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

  unmount = (): void => {
    if (!this.sandbox || !this.hostDispatcher) {
      this.error("Missing Components");
      return;
    }

    this.hostDispatcher.clearAppHandler();

    this.sandbox.state = SandboxState.UNMOUNTED;
  };

  loadScriptIntoDocument(
    scriptURL: string,
    appIDWithVersion: string
  ): Promise<void> {
    // Unused during dev
    return Promise.resolve();
  }

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

  constructor(appObject: HostAppObject) {
    super(appObject, MounterUC.type);
  }
}
