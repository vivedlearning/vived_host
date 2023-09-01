import { Handler, Request } from './HostBoundary';

export abstract class HostDispatcher {
  abstract registerAppHandler: (appHandler: Handler) => void;
  abstract dispatch: (request: Request) => void;
  abstract showBabylonInspector: (show: boolean) => void;
  abstract setIsAuthoring: (isAuthoring: boolean) => void;
  abstract disposeApp: () => void;
  abstract stopApp: () => void;
  abstract startApp: (container: HTMLElement) => void;
  abstract setState: (finalState: string, duration?: number) => void;
  abstract setDevicePreview: (x: number, y: number) => void;
  abstract startZSpace: (device: string, session: any, emulate: boolean) => void;
  abstract stopZSpace: () => void;
}

export function makeHostDispatcher(): HostDispatcher {
  return new HostDistpatcherImp();
}

class HostDistpatcherImp extends HostDispatcher {
  private appHandler?: Handler;
  private appHandlerVersion = 0;
  private appPayloadVersions = new Map<string, number>();

  registerAppHandler = (appHandler: Handler) => {
    this.appHandler = appHandler;
    this.getAppHandlerVersion();
  };

  private getAppHandlerVersion() {
    const type = 'GET_APP_HANDLER_VERSION';
    const payload = { callback: this.setupVersion };

    try {
      this.doDispatch(type, 1, payload);
    } catch {
      // All good. this is probably an older app
    }
  }

  private setupVersion = (version: number) => {
    // Apps before app package version 2.27 will not reach this
    this.appHandlerVersion = version;
    this.getPayloadVersions();
  };

  private getPayloadVersions() {
    const type = 'GET_APP_PAYLOAD_VERSION';
    const payload = { callback: this.setupPayloadVersions };
    this.doDispatch(type, 2, payload);
  }

  private setupPayloadVersions = (payloadVersion: Map<string, number>) => {
    this.appPayloadVersions = payloadVersion;
  };

  dispatch = (request: Request) => {
    if (!this.appHandler) {
      console.error('[HostDispatcher] No app handler has been registered');
      return;
    }

    this.appHandler(request);
  };

  showBabylonInspector = (show: boolean) => {
    const type = 'SHOW_BABYLON_INSPECTOR';
    const version = this.appPayloadVersions.get(type) ?? 1;
    const payload = {
      showBabylonInspector: show,
    };
    this.doDispatch(type, version, payload);
  };

  setIsAuthoring = (isAuthoring: boolean) => {
    const type = 'SET_IS_AUTHORING';
    const version = this.appPayloadVersions.get(type) ?? 1;
    const payload = { isAuthoring };
    this.doDispatch(type, version, payload);
  };

  disposeApp = () => {
    const type = 'DISPOSE_APP';
    const version = this.appPayloadVersions.get(type) ?? 1;
    this.doDispatch(type, version);
  };

  stopApp = () => {
    const type = 'STOP_APP';
    const version = this.appPayloadVersions.get(type) ?? 1;
    this.doDispatch(type, version);
  };

  startApp = (container: HTMLElement) => {
    const type = 'START_APP';
    const version = this.appPayloadVersions.get(type) ?? 2;
    const payload = {
      container,
    };
    this.doDispatch(type, version, payload);
  };

  setState = (finalState: string, duration?: number | undefined) => {
    const type = 'SET_APP_STATE';
    const version = this.appPayloadVersions.get(type) ?? 2;
    const payload = {
      finalState,
      duration,
    };
    this.doDispatch(type, version, payload);
  };

  private doDispatch(type: string, version: number, payload?: unknown) {
    const request: Request = {
      type,
      version,
      payload,
    };
    this.dispatch(request);
  }

  setDevicePreview = (x: number, y: number) => {
    const type = 'SET_DEVICE_PREVIEW';
    const version = this.appPayloadVersions.get(type) ?? 1;

    const request: Request = {
      type,
      version,
      payload: {
        x,
        y,
      },
    };
    this.dispatch(request);
  };

  startZSpace = (device: string, session: any, emulate: boolean) => {
    const type = 'START_ZSPACE';
    const version = this.appPayloadVersions.get(type) ?? 2;

    const request: Request = {
      type,
      version,
      payload: {
        device,
        session,
        emulate
      },
    };
    this.dispatch(request);
  };

  stopZSpace = () => {
    const type = 'STOP_ZSPACE';
    const version = this.appPayloadVersions.get(type) ?? 1;

    const request: Request = {
      type,
      version,
    };
    this.dispatch(request);
  };
}
