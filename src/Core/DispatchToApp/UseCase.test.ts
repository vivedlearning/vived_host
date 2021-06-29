import {
  AppPayloadVersions,
  DisposeAppRequest,
  DISPOSE_APP,
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
import { makeDispatchToAppUC } from '.';
import { NoPayloadVersionSpecified, UnableToFindAppByID, UnsupportedPayloadVersion } from './Errors';

function makePayloadVersions(): AppPayloadVersions {
  return {
    setIsAuthoring: 1,
    showBabylonInspector: 1,
    disposeApp: 1,
    stopApp: 1,
    setDevicePreview: 1,
    startApp: 1,
    transitionApp: 1,
  };
}

function makeTestRig() {
  const uc = makeDispatchToAppUC();
  const handler = jest.fn();
  const payloadVersions = makePayloadVersions();

  return {uc, handler, payloadVersions}
}

test('Setting an app handler', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  
  expect(uc.hasAppHandler('app1')).toEqual(false);

  uc.setAppHandler('app1', handler, payloadVersions);

  expect(uc.hasAppHandler('app1')).toEqual(true);
});

test('Setting is authoring', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  uc.setAppHandler('app1', handler, payloadVersions);

  uc.setIsAuthoring('app1', true);

  expect(handler.mock.calls.length).toEqual(1);
  const request = handler.mock.calls[0][0] as SetIsAuthoringRequest;
  expect(request.type).toEqual(SET_IS_AUTHORING);
  expect(request.version).toEqual(1);
  expect(request.payload.isAuthoring).toEqual(true);
});

test('Setting is authoring should throw an error for an unknown app', () => {
  const {uc} = makeTestRig();

  expect(() => uc.setIsAuthoring('unknownApp', true)).toThrowError(UnableToFindAppByID);
});

test('If app has no author payload version, it should throw an error when trying to set the flag', () => {
  const {uc, handler } = makeTestRig();
  uc.setAppHandler('app1', handler, {});

  expect(() => uc.setIsAuthoring('app1', true)).toThrowError(NoPayloadVersionSpecified);
});

test('An unsupported version of save flag playload should throw an error', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  payloadVersions.setIsAuthoring = -1;
  uc.setAppHandler('app1', handler, payloadVersions);

  expect(() => uc.setIsAuthoring('app1', true)).toThrowError(UnsupportedPayloadVersion);
});

test('Setting the babylon inspector', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  uc.setAppHandler('app1', handler, payloadVersions);

  uc.showBabylonInspector('app1', true);

  expect(handler.mock.calls.length).toEqual(1);
  const request = handler.mock.calls[0][0] as ShowBabylonInspectorRequest;
  expect(request.type).toEqual(SHOW_BABYLON_INSPECTOR);
  expect(request.version).toEqual(1);
  expect(request.payload.showBabylonInspector).toEqual(true);
});

test('Setting babylon inspector should throw an error for an unknown app', () => {
  const {uc} = makeTestRig();

  expect(() => uc.showBabylonInspector('unknownApp', true)).toThrowError(UnableToFindAppByID);
});

test('If app has no babylon inspector payload version, it should throw an error when trying to set the flag', () => {
  const {uc, handler} = makeTestRig();
  uc.setAppHandler('app1', handler, {});

  expect(() => uc.showBabylonInspector('app1', true)).toThrowError(NoPayloadVersionSpecified);
});

test('An unsupported version of babylon inspector flag playload should throw an error', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  payloadVersions.showBabylonInspector = -1;
  uc.setAppHandler('app1', handler, payloadVersions);

  expect(() => uc.showBabylonInspector('app1', true)).toThrowError(UnsupportedPayloadVersion);
});

test('Disposing the app', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  uc.setAppHandler('app1', handler, payloadVersions);

  uc.disposeApp('app1');

  expect(handler.mock.calls.length).toEqual(1);
  const request = handler.mock.calls[0][0] as DisposeAppRequest;
  expect(request.type).toEqual(DISPOSE_APP);
  expect(request.version).toEqual(1);
});

test('Disposing should throw an error for an unknown app', () => {
  const {uc} = makeTestRig();

  expect(() => uc.disposeApp('unknownApp')).toThrowError(UnableToFindAppByID);
});

test('If app has no dispose payload version, it should throw an error when trying', () => {
  const {uc, handler} = makeTestRig();
  uc.setAppHandler('app1', handler, {});

  expect(() => uc.disposeApp('app1')).toThrowError(NoPayloadVersionSpecified);
});

test('An unsupported version of dispose playload should throw an error', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  payloadVersions.disposeApp = -1;
  uc.setAppHandler('app1', handler, payloadVersions);

  expect(() => uc.disposeApp('app1')).toThrowError(UnsupportedPayloadVersion);
});

test('Stopping the app', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  uc.setAppHandler('app1', handler, payloadVersions);

  uc.stopApp('app1');

  expect(handler.mock.calls.length).toEqual(1);
  const request = handler.mock.calls[0][0] as StopAppRequest;
  expect(request.type).toEqual(STOP_APP);
  expect(request.version).toEqual(1);
});

test('Setting stop app should throw an error for an unknown app', () => {
  const {uc} = makeTestRig();

  expect(() => uc.stopApp('unknownApp')).toThrowError(UnableToFindAppByID);
});

test('If app has no stop app payload version, it should throw an error when trying calling it', () => {
  const {uc, handler} = makeTestRig();
  uc.setAppHandler('app1', handler, {});

  expect(() => uc.stopApp('app1')).toThrowError(NoPayloadVersionSpecified);
});

test('An unsupported version of stop app playload should throw an error', () => {
  const {uc, handler, payloadVersions} = makeTestRig();

  payloadVersions.stopApp = -1;
  uc.setAppHandler('app1', handler, payloadVersions);

  expect(() => uc.stopApp('app1')).toThrowError(UnsupportedPayloadVersion);
});

test('Setting the device preview', () => {
  const {uc, handler, payloadVersions} = makeTestRig();

  uc.setAppHandler('app1', handler, payloadVersions);

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
  uc.setAppHandler('app1', handler, {});

  expect(() => uc.setDevicePreview('app1', 222, 333)).toThrowError(NoPayloadVersionSpecified);
});

test('An unsupported version of device preview playload should throw an error', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  payloadVersions.setDevicePreview = -1;
  uc.setAppHandler('app1', handler, payloadVersions);

  expect(() => uc.setDevicePreview('app1', 222, 333)).toThrowError(UnsupportedPayloadVersion);
});

test('Setting start', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  uc.setAppHandler('app1', handler, payloadVersions);

  const div = document.createElement('div');
  uc.startApp('app1', div, 'some state');

  expect(handler.mock.calls.length).toEqual(1);
  const request = handler.mock.calls[0][0] as StartAppRequst;
  expect(request.type).toEqual(START_APP);
  expect(request.version).toEqual(1);
  expect(request.payload.container).toEqual(div);
  expect(request.payload.initialState).toEqual('some state');
});

test('Starting should throw an error for an unknown app', () => {
  const {uc } = makeTestRig();
  const div = document.createElement('div');
  expect(() => uc.startApp('unknown app', div, 'some state')).toThrowError(UnableToFindAppByID);
});

test('If app has no start payload version, it should throw an error when trying to set the flag', () => {
  const {uc, handler} = makeTestRig();
  uc.setAppHandler('app1', handler, {});

  const div = document.createElement('div');
  expect(() => uc.startApp('app1', div, 'some state')).toThrowError(NoPayloadVersionSpecified);
});

test('An unsupported version of start playload should throw an error', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  payloadVersions.startApp = -1;
  uc.setAppHandler('app1', handler, payloadVersions);

  const div = document.createElement('div');
  expect(() => uc.startApp('app1', div, 'some state')).toThrowError(UnsupportedPayloadVersion);
});

test('Transitioning the app', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  uc.setAppHandler('app1', handler, payloadVersions);

  uc.transitionApp('app1', 'final state', 7);

  expect(handler.mock.calls.length).toEqual(1);
  const request = handler.mock.calls[0][0] as TransitionAppRequest;
  expect(request.type).toEqual(TRANSITION_APP);
  expect(request.version).toEqual(1);
  expect(request.payload.finalState).toEqual('final state');
  expect(request.payload.duration).toEqual(7);
});

test('Setting device preview should throw an error for an unknown app', () => {
  const {uc} = makeTestRig();

  expect(() => uc.transitionApp('unknown', 'final state', 7)).toThrowError(UnableToFindAppByID);
});

test('If app has no device preview payload version, it should throw an error when trying to set the flag', () => {
  const {uc, handler} = makeTestRig();
  uc.setAppHandler('app1', handler, {});

  expect(() => uc.transitionApp('app1', 'final state', 7)).toThrowError(NoPayloadVersionSpecified);
});

test('An unsupported version of device preview playload should throw an error', () => {
  const {uc, handler, payloadVersions} = makeTestRig();
  payloadVersions.transitionApp = -1;
  uc.setAppHandler('app1', handler, payloadVersions);

  expect(() => uc.transitionApp('app1', 'final state', 7)).toThrowError(UnsupportedPayloadVersion);
});
