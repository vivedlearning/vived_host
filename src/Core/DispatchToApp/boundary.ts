import {AppPayloadVersions, GetAppPayloadVersionsRequest, Handler} from '@vived/app-host-boundary'

export interface DispatchToAppUC {
  setAppHandler(appID: string, handler: Handler, payloadVersions: AppPayloadVersions): void;
  hasAppHandler(appID: string): boolean,
  showBabylonInspector(appID: string, show: boolean):void;
  setIsAuthoring(appID: string, isAuthoring: boolean):void;
  disposeApp(appID: string): void;
  stopApp(appID: string): void;
  setDevicePreview(appID: string,x: number, y:number):void;
  startApp(appID: string, container: HTMLElement): void;
  setAppState(appID: string, finalState: string, duration?: number):void;
}
