import {
  GetAppAssetURLRequest,
  GET_APP_ASSET_URL,
  OnStateChangeRequest,
  OnStateCompleteRequest,
  ON_STATE_CHANGE,
  ON_STATE_COMPLETED,
  Request,
  SubmitResultsRequest,
  SUBMIT_RESULTS,
  UnsupportedRequestTypeError,
  UnsupportedRequestVerion,
} from '@vived/app-host-boundary';
import { makeHostHandler } from './hostHandler';

function makeTestRig() {
  const handlerFunctions = {
    getAppAssetsURL: jest.fn(),
    onStateChange: jest.fn(),
    onStateComplete: jest.fn(),
    submitResults: jest.fn(),
  };

  const handler = makeHostHandler(
    handlerFunctions.onStateChange,
    handlerFunctions.onStateComplete,
    handlerFunctions.submitResults,
    handlerFunctions.getAppAssetsURL,
  );
  return { handler, handlerFunctions };
}

test('Handle get asset url', () => {
  const { handler, handlerFunctions } = makeTestRig();

  const callback = jest.fn();
  const request: GetAppAssetURLRequest = {
    type: GET_APP_ASSET_URL,
    version: 1,
    payload: {
      callback,
    },
  };
  handler(request);

  const mockCall = handlerFunctions.getAppAssetsURL as jest.Mock<any, any>;
  expect(mockCall.mock.calls.length).toEqual(1);
});

test('Unsupported request version for get asset url should throw an error', () => {
  const { handler } = makeTestRig();
  const callback = jest.fn();
  const request: GetAppAssetURLRequest = {
    type: GET_APP_ASSET_URL,
    version: -1,
    payload: {
      callback,
    },
  };
  expect(() => handler(request)).toThrowError(UnsupportedRequestVerion);
});

test('Unsupported request type should throw an error', () => {
  const { handler } = makeTestRig();
  const request: Request = {
    type: 'UNKNOWN',
    version: 1,
  };
  expect(() => handler(request)).toThrowError(UnsupportedRequestTypeError);
});

test('Handle on state change', () => {
  const { handler, handlerFunctions } = makeTestRig();

  const request: OnStateChangeRequest = {
    type: ON_STATE_CHANGE,
    version: 1,
    payload: {
      stateObject: { some: 'state' },
    },
  };
  handler(request);

  const mockCall = handlerFunctions.onStateChange as jest.Mock<any, any>;
  expect(mockCall.mock.calls.length).toEqual(1);
  expect(mockCall.mock.calls[0][0]).toEqual({ some: 'state' });
});

test('Unsupported request version for handle on state change should throw an error', () => {
  const { handler } = makeTestRig();
  const callback = jest.fn();
  const request: GetAppAssetURLRequest = {
    type: GET_APP_ASSET_URL,
    version: -1,
    payload: {
      callback,
    },
  };
  expect(() => handler(request)).toThrowError(UnsupportedRequestVerion);
});

test('Handle on state complete', () => {
  const { handler, handlerFunctions } = makeTestRig();

  const request: OnStateCompleteRequest = {
    type: ON_STATE_COMPLETED,
    version: 1,
  };
  handler(request);

  const mockCall = handlerFunctions.onStateComplete as jest.Mock<any, any>;
  expect(mockCall.mock.calls.length).toEqual(1);
});

test('Unsupported request version for handle on state completed should throw an error', () => {
  const { handler } = makeTestRig();
  const request: OnStateCompleteRequest = {
    type: ON_STATE_COMPLETED,
    version: -1,
  };
  expect(() => handler(request)).toThrowError(UnsupportedRequestVerion);
});

test('Handle submitting results', () => {
  const { handler, handlerFunctions } = makeTestRig();

  const request: SubmitResultsRequest = {
    type: SUBMIT_RESULTS,
    version: 1,
    payload: {
      results: { score: 50 },
    },
  };
  handler(request);

  const mockCall = handlerFunctions.submitResults as jest.Mock<any, any>;
  expect(mockCall.mock.calls.length).toEqual(1);
  expect(mockCall.mock.calls[0][0]).toEqual({ score: 50 });
});

test('Unsupported request version for handle submitting a result should throw an error', () => {
  const { handler } = makeTestRig();
  const request: SubmitResultsRequest = {
    type: SUBMIT_RESULTS,
    version: -1,
    payload: {
      results: { score: 50 },
    },
  };
  expect(() => handler(request)).toThrowError(UnsupportedRequestVerion);
});
