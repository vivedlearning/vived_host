import {
  AppPayloadVersions,
  GetAppPayloadVersionsRequest,
  GET_APP_PAYLOAD_VERSIONS,
  Handler,
} from '@vived/app-host-boundary';

export function getAppPayloadVersions(appHandler: Handler): AppPayloadVersions {
  let rVal: AppPayloadVersions = {};

  const request: GetAppPayloadVersionsRequest = {
    type: GET_APP_PAYLOAD_VERSIONS,
    version: 1,
    payload: {
      callback: (payloadVersions) => {
        rVal = payloadVersions;
      },
    },
  };

  appHandler(request);

  return rVal;
}
