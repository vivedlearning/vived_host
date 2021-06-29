import {
  AppPayloadVersions,
  GetAppPayloadVersionsRequest,
  GET_APP_PAYLOAD_VERSIONS,
  Request,
} from '@vived/app-host-boundary';
import { getAppPayloadVersions } from './getAppPayloadVersions';

test('Make sure the handler gets called with the correct message', () => {
  const mockHandler = jest.fn();
  getAppPayloadVersions(mockHandler);

  expect(mockHandler.mock.calls.length).toEqual(1);
  const request = mockHandler.mock.calls[0][0] as GetAppPayloadVersionsRequest;
  expect(request.type).toEqual(GET_APP_PAYLOAD_VERSIONS);
  expect(request.version).toEqual(1);
});

test('Make sure we get something returned', () => {
  const mockAppPayloadVersion: AppPayloadVersions = {
    disposeApp: 1,
    setDevicePreview: 2,
    setIsAuthoring: 3,
  };
  const mockHandler = (request: Request) => {
    const req = request as GetAppPayloadVersionsRequest;
    req.payload.callback(mockAppPayloadVersion);
  };

  const versions = getAppPayloadVersions(mockHandler);
  expect(versions).toEqual(mockAppPayloadVersion);
});
