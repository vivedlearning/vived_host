import {AppPayloadVersions, Handler} from '@vived/app-host-boundary'

export type onAppsChange = () => void;
export interface AppsUC {
  addApp(appID: string, handler: Handler, payloadVersions: AppPayloadVersions): void;
  hasApp(appID: string): boolean,
  removeApp(appID: string): void;

  setDevicePreview(appID: string,x: number, y:number):void;
  setAppState(appID: string, finalState: string, duration?: number):void;

  getAppIsRunning(appID: string): boolean;
  startApp(appID: string, container: HTMLElement): void;
  stopApp(appID: string): void;

  getIsAuthoring(appID: string):boolean;
  setIsAuthoring(appID: string, isAuthoring: boolean): void;
  
  getShowBabylonInspector(appID: string): boolean;
  setShowBabylonInspector(appID: string, showInspector: boolean): void;

  addObserver(observer: onAppsChange): void;
  removeObserver(observer: onAppsChange): void;
}
