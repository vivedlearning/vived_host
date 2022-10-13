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
}

export function makeHostDispatcher(): HostDispatcher {
  return new HostDistpatcherImp();
}

class HostDistpatcherImp extends HostDispatcher {
  private appHandler?: Handler;

  registerAppHandler = (appHandler: Handler) => {
    this.appHandler = appHandler;
  };

  dispatch = (request: Request) => {
    if (!this.appHandler) {
      console.error('[HostDispatcher] No app handler has been registered');
      return;
    }

    this.appHandler(request);
  };

  showBabylonInspector = (show: boolean) => {
    const request: Request = {
      type: 'SHOW_BABYLON_INSPECTOR',
      version: 1,
      payload: {
        showBabylonInspector: show,
      },
    };

    this.dispatch(request);
  };

  setIsAuthoring = (isAuthoring: boolean) => {
    const request: Request = {
      type: 'SET_IS_AUTHORING',
      version: 1,
      payload: {
        isAuthoring,
      },
    };

    this.dispatch(request);
  };

  disposeApp = () => {
    const request: Request = {
      type: 'DISPOSE_APP',
      version: 1,
    };

    this.dispatch(request);
  };

  stopApp = () => {
    const request: Request = {
      type: 'STOP_APP',
      version: 1,
    };

    this.dispatch(request);
  };

  startApp = (container: HTMLElement) => {
    const request: Request = {
      type: 'START_APP',
      version: 2,
      payload: {
        container,
      },
    };

    this.dispatch(request);
  };

  setState = (finalState: string, duration?: number | undefined) => {
    const request: Request = {
      type: 'SET_APP_STATE',
      version: 2,
      payload: {
        finalState,
        duration,
      },
    };
    this.dispatch(request);
  };

  setDevicePreview = (x: number, y: number) => {
    const request: Request = {
      type: 'SET_DEVICE_PREVIEW',
      version: 1,
      payload: {
        x,
        y,
      },
    };
    this.dispatch(request);
  };
}