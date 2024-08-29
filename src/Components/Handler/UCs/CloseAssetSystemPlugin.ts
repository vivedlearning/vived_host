import { HostAppObject, HostAppObjectUC } from "../../../HostAppObject";
import { AssetPluginEntity } from "../../AssetPlugin";
import { DialogQueue } from "../../Dialog";
import { DispatchDisposeAppUC, DispatchStopAppUC } from "../../Dispatcher";
import { HostHandlerEntity, RequestHandler, UnsupportedRequestVersion } from "../Entities";

export abstract class CloseAssetSystemPluginUC
  extends HostAppObjectUC
  implements RequestHandler
{
  static readonly type = "CloseAssetSystemPluginUC";

  readonly requestType = "CLOSE_PLUGIN";
  readonly payloadVersion = 1;

  abstract action: () => void;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeCloseAssetSystemPluginUC(
  appObject: HostAppObject
): CloseAssetSystemPluginUC {
  return new CloseAssetSystemPluginUCImp(appObject);
}

export class CloseAssetSystemPluginUCImp extends CloseAssetSystemPluginUC {
  private get dialogQueue() {
    return this.getCachedSingleton<DialogQueue>(DialogQueue.type);
  }

  private get assetSystemPlugin() {
    return this.getCachedLocalComponent<AssetPluginEntity>(
      AssetPluginEntity.type
    );
  }

  handleRequest = (version: number) => {
    if (version === this.payloadVersion) {
      this.action();
    } else {
      throw new UnsupportedRequestVersion(this.requestType, version);
    }
  };

  action: () => void = () => {
    if (!this.assetSystemPlugin) return;
    if (!this.dialogQueue) return;

    this.dialogQueue.activeDialogHasClosed();

    const dispatchDisposeApp = DispatchDisposeAppUC.get(this.appObject);
    if (!dispatchDisposeApp) {
      this.error("Cannot find DispatchDisposeAppUC");
      return;
    }

    const dispatchStopApp = DispatchStopAppUC.get(this.appObject);
    if (!dispatchStopApp) {
      this.error("Cannot find DispatchDisposeAppUC");
      return;
    }

    dispatchStopApp.doDispatch();
    dispatchDisposeApp.doDispatch();

    this.assetSystemPlugin.show = false;
  };

  constructor(appObject: HostAppObject) {
    super(appObject, CloseAssetSystemPluginUC.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}
