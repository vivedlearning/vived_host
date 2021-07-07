import {
  GetAppAssetUrlPayloadV1,
  GetAppAssetURLRequest,
  GET_APP_ASSET_URL,
  Handler,
  OnStateChangePayloadV1,
  OnStateChangeRequest,
  ON_STATE_CHANGE,
  ON_STATE_COMPLETED,
  Request,
  SubmitResultsPayloadV1,
  SubmitResultsRequest,
  SUBMIT_RESULTS,
  UnsupportedRequestTypeError,
  UnsupportedRequestVerion,
} from '@vived/app-host-boundary';

export function makeHostHandler(
  onStateChange: (state: object) => void,
  onStateComplete: () => void,
  submitResults: (results: object) => void,
  getAppAssetsURL: () => string,
): Handler {
  const handler = (request: Request) => {
    switch (request.type) {
      case ON_STATE_CHANGE:
        const state = getStateFromRequest(request as OnStateChangeRequest);
        onStateChange(state);
        break;

      case ON_STATE_COMPLETED:
        if (request.version === 1) {
          onStateComplete();
        } else {
          throw new UnsupportedRequestVerion(request.type, request.version);
        }
        break;

      case SUBMIT_RESULTS:
        const results = getResultsFromRequest(request as SubmitResultsRequest);
        submitResults(results);
        break;

      case GET_APP_ASSET_URL:
        const url = getAppAssetsURL();
        handleGetAppAssetsURL(url, request as GetAppAssetURLRequest);
        break;

      default:
        throw new UnsupportedRequestTypeError(request.type);
    }
  };

  return handler;
}

function getStateFromRequest(request: OnStateChangeRequest): object {
  if (request.version === 1) {
    const payload = request.payload as OnStateChangePayloadV1;
    return payload.stateObject;
  } else {
    throw new UnsupportedRequestVerion(request.type, request.version);
  }
}

function getResultsFromRequest(request: SubmitResultsRequest): object {
  if (request.version === 1) {
    const payload = request.payload as SubmitResultsPayloadV1;
    return payload.results;
  } else {
    throw new UnsupportedRequestVerion(request.type, request.version);
  }
}

function handleGetAppAssetsURL(url: string, request: GetAppAssetURLRequest) {
  if (request.version === 1) {
    const payload = request.payload as GetAppAssetUrlPayloadV1;
    payload.callback(url);
  } else {
    throw new UnsupportedRequestVerion(request.type, request.version);
  }
}
