import {
  AppPayloadVersions,
  DisposeAppRequest,
  DISPOSE_APP,
  SetAppStateRequest,
  SetDevicePreviewRequest,
  SetIsAuthoringRequest,
  SET_APP_STATE,
  SET_DEVICE_PREVIEW,
  SET_IS_AUTHORING,
  ShowBabylonInspectorRequest,
  SHOW_BABYLON_INSPECTOR,
  StartAppPayloadV1,
  StartAppPayloadV2,
  StartAppRequst,
  START_APP,
  StopAppRequest,
  STOP_APP,
} from '@vived/app-host-boundary';
import { makeAppsUC } from '.';
import { NoPayloadVersionSpecified, UnableToFindAppByID, UnsupportedPayloadVersion } from './Errors';

function makePayloadVersions(): AppPayloadVersions {
  return {
    setIsAuthoring: 1,
    showBabylonInspector: 1,
    disposeApp: 1,
    stopApp: 1,
    setDevicePreview: 1,
    startApp: 2,
    setState: 1,
  };
}

function makeTestRig() {
  const uc = makeAppsUC();
  const handler = jest.fn();
  const payloadVersions = makePayloadVersions();

  return {uc, handler, payloadVersions}
}

test('Adding an app', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  
  expect(uc.hasApp('app1')).toEqual(false);

  uc.addApp('app1', handler, payloadVersions);

  expect(uc.hasApp('app1')).toEqual(true);
});

test('When an app is removed, it should also disposing the app', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  uc.addApp('app1', handler, payloadVersions);
  expect(uc.hasApp("app1")).toEqual(true);

  uc.removeApp('app1');

  expect(handler.mock.calls.length).toEqual(1);
  const request = handler.mock.calls[0][0] as DisposeAppRequest;
  expect(request.type).toEqual(DISPOSE_APP);
  expect(request.version).toEqual(1);

  expect(uc.hasApp("app1")).toEqual(false);
});

test('Setting is authoring', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  uc.addApp('app1', handler, payloadVersions);

  expect(uc.getIsAuthoring("app1")).toEqual(false);

  uc.setIsAuthoring('app1', true);

  expect(uc.getIsAuthoring("app1")).toEqual(true);

  expect(handler.mock.calls.length).toEqual(1);
  const request = handler.mock.calls[0][0] as SetIsAuthoringRequest;
  expect(request.type).toEqual(SET_IS_AUTHORING);
  expect(request.version).toEqual(1);
  expect(request.payload.isAuthoring).toEqual(true);
});

test("Setting is authoring should only call if there is a change", ()=>{
  const {uc, handler, payloadVersions} = makeTestRig();
  uc.addApp('app1', handler, payloadVersions);
  uc.setIsAuthoring('app1', true);

  expect(handler.mock.calls.length).toEqual(1);

  uc.setIsAuthoring('app1', true);
  uc.setIsAuthoring('app1', true);
  uc.setIsAuthoring('app1', true);

  expect(handler.mock.calls.length).toEqual(1);
})

test('Setting is authoring should throw an error for an unknown app', () => {
  const {uc} = makeTestRig();

  expect(() => uc.setIsAuthoring('unknownApp', true)).toThrowError(UnableToFindAppByID);
});

test('Getting is authoring should throw an error for an unknown app', () => {
  const {uc} = makeTestRig();

  expect(() => uc.getIsAuthoring('unknownApp')).toThrowError(UnableToFindAppByID);
});

test('If app has no author payload version, it should throw an error when trying to set the flag', () => {
  const {uc, handler } = makeTestRig();
  uc.addApp('app1', handler, {});

  expect(() => uc.setIsAuthoring('app1', true)).toThrowError(NoPayloadVersionSpecified);
});

test('An unsupported version of save flag playload should throw an error', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  payloadVersions.setIsAuthoring = -1;
  uc.addApp('app1', handler, payloadVersions);

  expect(() => uc.setIsAuthoring('app1', true)).toThrowError(UnsupportedPayloadVersion);
});

test('Setting the babylon inspector', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  uc.addApp('app1', handler, payloadVersions);

  expect(uc.getShowBabylonInspector("app1")).toEqual(false);

  uc.setShowBabylonInspector('app1', true);

  expect(uc.getShowBabylonInspector("app1")).toEqual(true);

  expect(handler.mock.calls.length).toEqual(1);
  const request = handler.mock.calls[0][0] as ShowBabylonInspectorRequest;
  expect(request.type).toEqual(SHOW_BABYLON_INSPECTOR);
  expect(request.version).toEqual(1);
  expect(request.payload.showBabylonInspector).toEqual(true);
});

test('Setting the babylon inspector should only dispatch if something changes', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  uc.addApp('app1', handler, payloadVersions);
  uc.setShowBabylonInspector('app1', true);

  expect(handler.mock.calls.length).toEqual(1);
  
  uc.setShowBabylonInspector('app1', true);
  uc.setShowBabylonInspector('app1', true);
  uc.setShowBabylonInspector('app1', true);
  uc.setShowBabylonInspector('app1', true);

  expect(handler.mock.calls.length).toEqual(1);
});

test('Setting babylon inspector should throw an error for an unknown app', () => {
  const {uc} = makeTestRig();

  expect(() => uc.setShowBabylonInspector('unknownApp', true)).toThrowError(UnableToFindAppByID);
});

test('Getting babylon inspector should throw an error for an unknown app', () => {
  const {uc} = makeTestRig();

  expect(() => uc.getShowBabylonInspector('unknownApp')).toThrowError(UnableToFindAppByID);
});

test('If app has no babylon inspector payload version, it should throw an error when trying to set the flag', () => {
  const {uc, handler} = makeTestRig();
  uc.addApp('app1', handler, {});

  expect(() => uc.setShowBabylonInspector('app1', true)).toThrowError(NoPayloadVersionSpecified);
});

test('An unsupported version of babylon inspector flag playload should throw an error', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  payloadVersions.showBabylonInspector = -1;
  uc.addApp('app1', handler, payloadVersions);

  expect(() => uc.setShowBabylonInspector('app1', true)).toThrowError(UnsupportedPayloadVersion);
});

test('Setting the device preview', () => {
  const {uc, handler, payloadVersions} = makeTestRig();

  uc.addApp('app1', handler, payloadVersions);

  uc.setDevicePreview('app1', 222, 333);

  expect(handler.mock.calls.length).toEqual(1);
  const request = handler.mock.calls[0][0] as SetDevicePreviewRequest;
  expect(request.type).toEqual(SET_DEVICE_PREVIEW);
  expect(request.version).toEqual(1);
  expect(request.payload.x).toEqual(222);
  expect(request.payload.y).toEqual(333);
});

test('Setting device preview should throw an error for an unknown app', () => {
  const {uc} = makeTestRig();

  expect(() => uc.setDevicePreview('app1', 222, 333)).toThrowError(UnableToFindAppByID);
});

test('If app has no device preview payload version, it should throw an error when trying to set the flag', () => {
  const {uc, handler} = makeTestRig();
  uc.addApp('app1', handler, {});

  expect(() => uc.setDevicePreview('app1', 222, 333)).toThrowError(NoPayloadVersionSpecified);
});

test('An unsupported version of device preview playload should throw an error', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  payloadVersions.setDevicePreview = -1;
  uc.addApp('app1', handler, payloadVersions);

  expect(() => uc.setDevicePreview('app1', 222, 333)).toThrowError(UnsupportedPayloadVersion);
});

test('Setting device preview should throw an error for an unknown app', () => {
  const {uc} = makeTestRig();

  expect(() => uc.setAppState('unknown', 'final state', 7)).toThrowError(UnableToFindAppByID);
});

test('If app has no device preview payload version, it should throw an error when trying to set the flag', () => {
  const {uc, handler} = makeTestRig();
  uc.addApp('app1', handler, {});

  expect(() => uc.setAppState('app1', 'final state', 7)).toThrowError(NoPayloadVersionSpecified);
});

test('An unsupported version of device preview playload should throw an error', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  payloadVersions.setState = -1;
  uc.addApp('app1', handler, payloadVersions);

  expect(() => uc.setAppState('app1', 'final state', 7)).toThrowError(UnsupportedPayloadVersion);
});

test('Starting the app with payload version 1', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  payloadVersions.startApp = 1;
  uc.addApp('app1', handler, payloadVersions);

  expect(uc.getAppIsRunning("app1")).toEqual(false);

  const div = document.createElement('div');
  uc.startApp('app1', div);

  expect(uc.getAppIsRunning("app1")).toEqual(true);

  expect(handler.mock.calls.length).toEqual(1);
  const request = handler.mock.calls[0][0] as StartAppRequst;
  expect(request.type).toEqual(START_APP);
  expect(request.version).toEqual(1);
  const payload = request.payload as StartAppPayloadV1;
  expect(payload.container).toEqual(div);
  expect(payload.initialState).toEqual('');
});

test('Setting start with payload version 2', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  payloadVersions.startApp = 2;
  uc.addApp('app1', handler, payloadVersions);

  expect(uc.getAppIsRunning("app1")).toEqual(false);

  const div = document.createElement('div');
  uc.startApp('app1', div);

  expect(uc.getAppIsRunning("app1")).toEqual(true);

  expect(handler.mock.calls.length).toEqual(1);
  const request = handler.mock.calls[0][0] as StartAppRequst;
  expect(request.type).toEqual(START_APP);
  expect(request.version).toEqual(2);
  const payload = request.payload as StartAppPayloadV2;
  expect(payload.container).toEqual(div);
});

test('Starting an app should dispatch if the app needs to start', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  payloadVersions.startApp = 2;
  uc.addApp('app1', handler, payloadVersions);
  const div = document.createElement('div');
  uc.startApp('app1', div);

  expect(uc.getAppIsRunning("app1")).toEqual(true);
  expect(handler.mock.calls.length).toEqual(1);

  uc.startApp('app1', div);
  uc.startApp('app1', div);
  uc.startApp('app1', div);
  uc.startApp('app1', div);
  
  expect(handler.mock.calls.length).toEqual(1);
});

test('Starting should throw an error for an unknown app', () => {
  const {uc } = makeTestRig();
  const div = document.createElement('div');
  expect(() => uc.startApp('unknown app', div)).toThrowError(UnableToFindAppByID);
});

test('Getting is running should throw an error for an unknown app', () => {
  const {uc } = makeTestRig();
  expect(() => uc.getAppIsRunning('unknown app')).toThrowError(UnableToFindAppByID);
});

test('If app has no start payload version, it should throw an error when trying to set the flag', () => {
  const {uc, handler} = makeTestRig();
  uc.addApp('app1', handler, {});

  const div = document.createElement('div');
  expect(() => uc.startApp('app1', div)).toThrowError(NoPayloadVersionSpecified);
});

test('An unsupported version of start playload should throw an error', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  payloadVersions.startApp = -1;
  uc.addApp('app1', handler, payloadVersions);

  const div = document.createElement('div');
  expect(() => uc.startApp('app1', div)).toThrowError(UnsupportedPayloadVersion);
});

test('Stopping the app', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  uc.addApp('app1', handler, payloadVersions);
  const div = document.createElement('div');
  uc.startApp('app1', div);

  expect(handler.mock.calls.length).toEqual(1);
  expect(uc.getAppIsRunning("app1")).toEqual(true);

  uc.stopApp('app1');

  expect(uc.getAppIsRunning("app1")).toEqual(false);

  expect(handler.mock.calls.length).toEqual(2);
  const request = handler.mock.calls[1][0] as StopAppRequest;
  expect(request.type).toEqual(STOP_APP);
  expect(request.version).toEqual(1);
});

test("Stopping the app should dispatch if the app needs to stop", ()=>{
  const {uc, handler, payloadVersions} = makeTestRig();
  uc.addApp('app1', handler, payloadVersions);
  const div = document.createElement('div');
  uc.startApp('app1', div);
  
  uc.stopApp('app1');
  expect(handler.mock.calls.length).toEqual(2);

  uc.stopApp('app1');
  uc.stopApp('app1');
  uc.stopApp('app1');
  uc.stopApp('app1');

  expect(handler.mock.calls.length).toEqual(2);
})

test('Setting stop app should throw an error for an unknown app', () => {
  const {uc} = makeTestRig();

  expect(() => uc.stopApp('unknownApp')).toThrowError(UnableToFindAppByID);
});

test('If app has no stop app payload version, it should throw an error when trying calling it', () => {
  const {uc, handler} = makeTestRig();
  uc.addApp('app1', handler, {startApp:1});
  const div = document.createElement('div');
  uc.startApp('app1', div);

  expect(() => uc.stopApp('app1')).toThrowError(NoPayloadVersionSpecified);
});

test('An unsupported version of stop app playload should throw an error', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  
  payloadVersions.stopApp = -1;
  uc.addApp('app1', handler, payloadVersions);
  const div = document.createElement('div');
  uc.startApp('app1', div);

  expect(() => uc.stopApp('app1')).toThrowError(UnsupportedPayloadVersion);
});

test('Setting app state with payload version 1', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  payloadVersions.setState = 1;
  uc.addApp('app1', handler, payloadVersions);

  uc.setAppState('app1', 'final state', 7);

  expect(handler.mock.calls.length).toEqual(1);
  const request = handler.mock.calls[0][0] as SetAppStateRequest;
  expect(request.type).toEqual(SET_APP_STATE);
  expect(request.version).toEqual(1);
  expect(request.payload.finalState).toEqual('final state');
  expect(request.payload.duration).toEqual(7);
});

test('Setting app state with payload version 1 and not specifying duration', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  payloadVersions.setState = 1;
  uc.addApp('app1', handler, payloadVersions);

  uc.setAppState('app1', 'final state');

  expect(handler.mock.calls.length).toEqual(1);
  const request = handler.mock.calls[0][0] as SetAppStateRequest;
  expect(request.payload.duration).toEqual(0);
});

test('Setting app state with payload version 2', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  payloadVersions.setState = 2;
  uc.addApp('app1', handler, payloadVersions);

  uc.setAppState('app1', 'final state', 7);

  expect(handler.mock.calls.length).toEqual(1);
  const request = handler.mock.calls[0][0] as SetAppStateRequest;
  expect(request.type).toEqual(SET_APP_STATE);
  expect(request.version).toEqual(2);
  expect(request.payload.finalState).toEqual('final state');
  expect(request.payload.duration).toEqual(7);
});

test('Setting app state with payload version 2 with no duration specified', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  payloadVersions.setState = 2;
  uc.addApp('app1', handler, payloadVersions);

  uc.setAppState('app1', 'final state');

  expect(handler.mock.calls.length).toEqual(1);
  const request = handler.mock.calls[0][0] as SetAppStateRequest;
  expect(request.type).toEqual(SET_APP_STATE);
  expect(request.version).toEqual(2);
  expect(request.payload.finalState).toEqual('final state');
  expect(request.payload.duration).toBeUndefined();
});