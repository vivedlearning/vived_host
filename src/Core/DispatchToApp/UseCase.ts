import {
  AppPayloadVersions,
  DisposeAppRequest,
  DISPOSE_APP,
  Handler,
  Request,
  SetDevicePreviewRequest,
  SetIsAuthoringRequest,
  SET_DEVICE_PREVIEW,
  SET_IS_AUTHORING,
  ShowBabylonInspectorRequest,
  SHOW_BABYLON_INSPECTOR,
  StartAppRequst,
  START_APP,
  StopAppRequest,
  STOP_APP,
  TransitionAppRequest,
  TRANSITION_APP,
} from '@vived/app-host-boundary';
import { DispatchToAppUC } from './boundary';
import { DispatchToAppEntity } from './Entity';
import { NoPayloadVersionSpecified, UnableToFindAppByID, UnsupportedPayloadVersion } from './Errors';

export class DispatchToAppUCImp implements DispatchToAppUC {
  private appLookup = new Map<string, DispatchToAppEntity>();

  setAppHandler(appID: string, handler: Handler, payloadVersions: AppPayloadVersions): void {
    const app: DispatchToAppEntity = {
      handler,
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

    if (payloadVersions.transitionApp) {
      app.transitionAppPayloadVersion = payloadVersions.transitionApp;
    }

    // This is where we will add support for future payloads

    this.appLookup.set(appID, app);
  }
  hasAppHandler(appID: string): boolean {
    return this.appLookup.has(appID);
  }
  removeAppHandler(appID: string): void {
    this.appLookup.delete(appID);
  }

  showBabylonInspector(appID: string, show: boolean): void {
    const app = this.getAppByID(appID);
    if (!app) return;

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
          showBabylonInspector: show,
        },
      };
      this.dispatch(app, request);
    }
    // This is where we will add support for future versions of the payload
    else {
      throw new UnsupportedPayloadVersion(appID, type, payloadVersion);
    }
  }

  setIsAuthoring(appID: string, isAuthoring: boolean): void {
    const app = this.getAppByID(appID);
    if (!app) return;

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

  disposeApp(appID: string): void {
    const app = this.getAppByID(appID);
    if (!app) return;

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
    // This is where we will add support for future versions of the payload
    else {
      throw new UnsupportedPayloadVersion(appID, type, payloadVersion);
    }
  }

  stopApp(appID: string): void {
    const app = this.getAppByID(appID);
    if (!app) return;

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

  startApp(appID: string, container: HTMLElement, initialState: string): void {
    const app = this.getAppByID(appID);
    if (!app) return;

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
          initialState,
        },
      };
      this.dispatch(app, request);
    }
    // This is where we will add support for future versions of the payload
    else {
      throw new UnsupportedPayloadVersion(appID, type, payloadVersion);
    }
  }

  transitionApp(appID: string, finalState: string, duration: number): void {
    const app = this.getAppByID(appID);
    if (!app) return;

    const type = TRANSITION_APP;
    const payloadVersion = app.transitionAppPayloadVersion;
    if (!payloadVersion) {
      throw new NoPayloadVersionSpecified(appID, type);
    }

    if (payloadVersion === 1) {
      const request: TransitionAppRequest = {
        type,
        version: 1,
        payload: {
          finalState,
          duration,
        },
      };
      this.dispatch(app, request);
    }
    // This is where we will add support for future versions of the payload
    else {
      throw new UnsupportedPayloadVersion(appID, type, payloadVersion);
    }
  }

  private getAppByID(id: string): DispatchToAppEntity | undefined {
    const app = this.appLookup.get(id);

    if (!app) {
      throw new UnableToFindAppByID(id);
    }

    return app;
  }

  private dispatch(app: DispatchToAppEntity, request: Request) {
    const handler = app.handler as Handler;
    handler(request);
  }
}
