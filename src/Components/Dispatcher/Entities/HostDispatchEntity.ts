import { HostAppObject, HostAppObjectEntity } from '../../../HostAppObject';
import { Handler, Request } from '../../../Types';

export abstract class HostDispatchEntity extends HostAppObjectEntity {
  static readonly type = 'HostDispatchEntity';

  abstract appHandlerVersion: number;
  abstract getRequestPayloadVersion(requestType: string): number | undefined;
  abstract registerAppHandler: (appHandler: Handler) => void;
  abstract dispatch: (request: Request) => void;
  abstract formRequestAndDispatch: (type: string, version: number, payload?: object | undefined) => void;

  static get(appObject: HostAppObject): HostDispatchEntity | undefined {
    const asset = appObject.getComponent<HostDispatchEntity>(HostDispatchEntity.type);
    if (!asset) {
      appObject.appObjectRepo.submitWarning(
        'AssetEntity.get',
        'Unable to find HostDispatchEntity on app object ' + appObject.id,
      );
    }
    return asset;
  }
}

export function makeHostDispatchEntity(appObject: HostAppObject): HostDispatchEntity {
  return new HostDispatchEntityImp(appObject);
}

class HostDispatchEntityImp extends HostDispatchEntity {
  private appHandler?: Handler;

  private _appHandlerVersion = 0;
  public get appHandlerVersion() {
    return this._appHandlerVersion;
  }

  private appPayloadVersions = new Map<string, number>();

  registerAppHandler = (appHandler: Handler) => {
    this.appHandler = appHandler;
    this.getAppHandlerVersion();
  };

  private getAppHandlerVersion() {
    const type = 'GET_APP_HANDLER_VERSION';
    const payload = { callback: this.setupVersion };

    try {
      this.formRequestAndDispatch(type, 1, payload);
    } catch {
      // All good. this is probably an older app
    }
  }

  getRequestPayloadVersion = (requestType: string): number | undefined => {
    return this.appPayloadVersions.get(requestType);
  };

  private setupVersion = (version: number) => {
    // Apps before app package version 2.27 will not reach this
    this._appHandlerVersion = version;
    this.getPayloadVersions();
  };

  private getPayloadVersions = () => {
    const type = 'GET_APP_PAYLOAD_VERSION';
    const payload = { callback: this.setupPayloadVersions };
    this.formRequestAndDispatch(type, 2, payload);
  };

  private setupPayloadVersions = (payloadVersion: Map<string, number>) => {
    this.appPayloadVersions = payloadVersion;
  };

  dispatch = (request: Request) => {
    if (!this.appHandler) {
      this.error('No app handler has been registered');
      return;
    }

    this.appHandler(request);
  };

  formRequestAndDispatch = (type: string, version: number, payload?: object | undefined) => {
    if (!this.appHandler) {
      this.error('No app handler has been registered');
      return;
    }

    const request: Request = {
      type,
      version,
      payload,
    };

    this.appHandler(request);
  };

  constructor(appObject: HostAppObject) {
    super(appObject, HostDispatchEntity.type);
  }
}
