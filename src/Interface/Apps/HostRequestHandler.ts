import {
  GetAppAssetUrlPayloadV1,
  GET_APP_ASSET_URL,
  OnStateChangePayloadV1,
  ON_STATE_CHANGE,
  ON_STATE_COMPLETED,
  Request,
  SubmitResultsPayloadV1,
  SUBMIT_RESULTS,
  UnsupportedRequestTypeError,
  UnsupportedRequestVerion,
} from '@vived/app-host-boundary';

export interface HostRequestHandlerFunctions {
  onStateChange: (state: object) => void;
  onStateComplete: () => void;
  submitResults: (results: object) => void;
  getAppAssetsURL: () => string;
}

export class HostRequestHandler {
  private functions: HostRequestHandlerFunctions;
  constructor(hostRequestFunctions: HostRequestHandlerFunctions) {
    this.functions = hostRequestFunctions;
  }
  handler = (request: Request) => {
    switch (request.type) {
      case ON_STATE_CHANGE:
        if (request.version === 1) {
          this.handleStateChangeV1(request.payload as OnStateChangePayloadV1);
        } else {
          throw new UnsupportedRequestVerion(request.type, request.version);
        }
        break;

      case ON_STATE_COMPLETED:
        if (request.version === 1) {
          this.handleStateCompleteV1();
        } else {
          throw new UnsupportedRequestVerion(request.type, request.version);
        }
        break;

      case SUBMIT_RESULTS:
        if (request.version === 1) {
          this.handleSubmitResultsV1(request.payload as SubmitResultsPayloadV1);
        } else {
          throw new UnsupportedRequestVerion(request.type, request.version);
        }
        break;

      case GET_APP_ASSET_URL:
        if (request.version === 1) {
          this.handleGetAssetURLV1(request.payload as GetAppAssetUrlPayloadV1);
        } else {
          throw new UnsupportedRequestVerion(request.type, request.version);
        }
        break;

      default:
        throw new UnsupportedRequestTypeError(request.type);
    }
  };

  handleStateChangeV1(payload: OnStateChangePayloadV1): void {
    this.functions.onStateChange(payload.stateObject);
  }

  handleStateCompleteV1(): void {
    this.functions.onStateComplete();
  }

  handleSubmitResultsV1(payload: SubmitResultsPayloadV1): void {
    this.functions.submitResults(payload.results);
  }

  handleGetAssetURLV1(payload: GetAppAssetUrlPayloadV1): void {
    const url = this.functions.getAppAssetsURL();
    payload.callback(url);
  }
}
