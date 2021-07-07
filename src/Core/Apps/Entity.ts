export interface AppEntity {
  handler: unknown,

  isAuthoring: boolean,
  isRunning: boolean,
  isInspecting: boolean

  setIsAuthoringPayloadVersion?: number
  showBabylonInspectorPayloadVersion?: number
  disposeAppPayloadVersion?: number,
  stopAppPayloadVersion?: number,
  setDevicePreviewPayloadVersion?:number,
  startAppPayloadVersion?: number
  setAppStatePayloadVersion?:number
  getPayloadVersionsVersion?:number
  
}