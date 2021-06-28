export interface DispatchToAppEntity {
  handler: unknown,
  setIsAuthoringPayloadVersion?: number
  showBabylonInspectorPayloadVersion?: number
  disposeAppPayloadVersion?: number,
  stopAppPayloadVersion?: number,
  setDevicePreviewPayloadVersion?:number,
  startAppPayloadVersion?: number
  transitionAppPayloadVersion?:number
}