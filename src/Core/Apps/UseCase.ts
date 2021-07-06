import {
  AppPayloadVersions,
  DisposeAppRequest,
  DISPOSE_APP,
  Handler,
  Request,
  SetAppStateRequest,
  SetDevicePreviewRequest,
  SetIsAuthoringRequest,
  SET_APP_STATE,
  SET_DEVICE_PREVIEW,
  SET_IS_AUTHORING,
  ShowBabylonInspectorRequest,
  SHOW_BABYLON_INSPECTOR,
  StartAppRequst,
  START_APP,
  StopAppRequest,
  STOP_APP,
} from '@vived/app-host-boundary';
import { AppsUC } from './boundary';
import { AppEntity } from './Entity';
import { NoPayloadVersionSpecified, UnableToFindAppByID, UnsupportedPayloadVersion } from './Errors';

export class AppsUCImp implements AppsUC {
  private appLookup = new Map<string, AppEntity>();

  addApp(appID: string, handler: Handler, payloadVersions: AppPayloadVersions): void {
    const app: AppEntity = {
      handler,
      isAuthoring: false,
      isInspecting: false,
      isRunning: false,
    };

    if (payloadVersions.setIsAuthoring) {
      app.setIsAuthoringPayloadVersion = payloadVersions.setIsAuthoring;
    }

    if (payloadVersions.showBabylonInspector) {
      app.showBabylonInspectorPayloadVersion = payloadVersions.showBabylonInspector;
    }

    if (payloadVersions.disposeApp) {
      app.disposeAppPayloadVersion = payloadVersions.disposeApp;
    }

    if (payloadVersions.stopApp) {
      app.stopAppPayloadVersion = payloadVersions.stopApp;
    }

    if (payloadVersions.setDevicePreview) {
      app.setDevicePreviewPayloadVersion = payloadVersions.setDevicePreview;
    }

    if (payloadVersions.startApp) {
      app.startAppPayloadVersion = payloadVersions.startApp;
    }

    if (payloadVersions.setState) {
      app.setAppStatePayloadVersion = payloadVersions.setState;
    }

    // This is where we will add support for future payloads

    this.appLookup.set(appID, app);
  }
  hasApp(appID: string): boolean {
    return this.appLookup.has(appID);
  }
  removeApp(appID: string): void {
    const app = this.appLookup.get(appID)
    if(!app) return;
  
    const type = DISPOSE_APP;
    const payloadVersion = app.disposeAppPayloadVersion;
    if (!payloadVersion) {
      throw new NoPayloadVersionSpecified(appID, type);
    }

    if (payloadVersion === 1) {
      const request: DisposeAppRequest = {
        type,
        version: 1,
      };
      this.dispatch(app, request);
    }

    this.appLookup.delete(appID);
  }

  getIsAuthoring(appID: string): boolean {
    const app = this.getAppByID(appID);
    if (!app) return false;

    return app.isAuthoring;
  }
  setIsAuthoring(appID: string, isAuthoring: boolean): void {
    const app = this.getAppByID(appID);
    if (!app) return;

    if (app.isAuthoring === isAuthoring) return;

    app.isAuthoring = isAuthoring;

    const type = SET_IS_AUTHORING;
    const payloadVersion = app.setIsAuthoringPayloadVersion;
    if (!payloadVersion) {
      throw new NoPayloadVersionSpecified(appID, type);
    }

    if (payloadVersion === 1) {
      const request: SetIsAuthoringRequest = {
        type,
        version: 1,
        payload: {
          isAuthoring,
        },
      };
      this.dispatch(app, request);
    }
    // This is where we will add support for future versions of the payload
    else {
      throw new UnsupportedPayloadVersion(appID, type, payloadVersion);
    }
  }

  getShowBabylonInspector(appID: string): boolean {
    const app = this.getAppByID(appID);
    if (!app) return false;

    return app.isInspecting;
  }
  setShowBabylonInspector(appID: string, showInspector: boolean): void {
    const app = this.getAppByID(appID);
    if (!app) return;

    if (app.isInspecting === showInspector) return;
    app.isInspecting = showInspector;

    const type = SHOW_BABYLON_INSPECTOR;
    const payloadVersion = app.showBabylonInspectorPayloadVersion;
    if (!payloadVersion) {
      throw new NoPayloadVersionSpecified(appID, type);
    }

    if (payloadVersion === 1) {
      const request: ShowBabylonInspectorRequest = {
        type,
        version: 1,
        payload: {
          showBabylonInspector: showInspector,
        },
      };
      this.dispatch(app, request);
    }
    // This is where we will add support for future versions of the payload
    else {
      throw new UnsupportedPayloadVersion(appID, type, payloadVersion);
    }
  }

  getAppIsRunning(appID: string): boolean {
    const app = this.getAppByID(appID);
    if (!app) return false;

    return app.isRunning;
  }
  startApp(appID: string, container: HTMLElement): void {
    const app = this.getAppByID(appID);
    if (!app) return;

    if(app.isRunning) return;

    const type = START_APP;
    const payloadVersion = app.startAppPayloadVersion;
    if (!payloadVersion) {
      throw new NoPayloadVersionSpecified(appID, type);
    }

    if (payloadVersion === 1) {
      const request: StartAppRequst = {
        type,
        version: 1,
        payload: {
          container,
          initialState: '',
        },
      };
      this.dispatch(app, request);
    } else if (payloadVersion === 2) {
      const request: StartAppRequst = {
        type,
        version: 2,
        payload: {
          container,
        },
      };
      this.dispatch(app, request);
    } else {
      throw new UnsupportedPayloadVersion(appID, type, payloadVersion);
    }

    app.isRunning = true;
  }
  stopApp(appID: string): void {
    const app = this.getAppByID(appID);
    if (!app) return;

    if(!app.isRunning) return;

    const payloadVersion = app.stopAppPayloadVersion;
    const type = STOP_APP;
    if (!payloadVersion) {
      throw new NoPayloadVersionSpecified(appID, type);
    }

    if (payloadVersion === 1) {
      const request: StopAppRequest = {
        type,
        version: 1,
      };
      this.dispatch(app, request);
    }
    // This is where we will add support for future versions of the payload
    else {
      throw new UnsupportedPayloadVersion(appID, type, payloadVersion);
    }

    app.isRunning = false;
  }

  setDevicePreview(appID: string, x: number, y: number): void {
    const app = this.getAppByID(appID);
    if (!app) return;

    const type = SET_DEVICE_PREVIEW;
    const payloadVersion = app.setDevicePreviewPayloadVersion;
    if (!payloadVersion) {
      throw new NoPayloadVersionSpecified(appID, type);
    }

    if (payloadVersion === 1) {
      const request: SetDevicePreviewRequest = {
        type,
        version: 1,
        payload: {
          x,
          y,
        },
      };
      this.dispatch(app, request);
    }
    // This is where we will add support for future versions of the payload
    else {
      throw new UnsupportedPayloadVersion(appID, type, payloadVersion);
    }
  }

  setAppState(appID: string, finalState: string, duration?: number): void {
    const app = this.getAppByID(appID);
    if (!app) return;

    const type = SET_APP_STATE;
    const payloadVersion = app.setAppStatePayloadVersion;
    if (!payloadVersion) {
      throw new NoPayloadVersionSpecified(appID, type);
    }

    if (payloadVersion === 1) {
      const request: SetAppStateRequest = {
        type,
        version: 1,
        payload: {
          finalState,
          duration: duration ?? 0,
        },
      };
      this.dispatch(app, request);
    } else if (payloadVersion === 2) {
      const request: SetAppStateRequest = {
        type,
        version: 2,
        payload: {
          finalState,
          duration,
        },
      };
      this.dispatch(app, request);
    } else {
      throw new UnsupportedPayloadVersion(appID, type, payloadVersion);
    }
  }

  private getAppByID(id: string): AppEntity | undefined {
    const app = this.appLookup.get(id);

    if (!app) {
      throw new UnableToFindAppByID(id);
    }

    return app;
  }

  private dispatch(app: AppEntity, request: Request) {
    const handler = app.handler as Handler;
    handler(request);
  }
}
