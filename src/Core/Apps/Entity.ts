export interface AppEntity {
  handler: unknown,
  setIsAuthoringPayloadVersion?: number
  showBabylonInspectorPayloadVersion?: number
  disposeAppPayloadVersion?: number,
  stopAppPayloadVersion?: number,
  setDevicePreviewPayloadVersion?:number,
  startAppPayloadVersion?: number
  setAppStatePayloadVersion?:number
  getPayloadVersionsVersion?:number
  isAuthoring: boolean,
  isRunning: boolean,
  isInspecting: boolean
}