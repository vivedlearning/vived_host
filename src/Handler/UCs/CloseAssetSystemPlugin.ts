import { AppObject, AppObjectUC } from "@vived/core";
import { AssetPluginEntity } from "../../AssetPlugin/Entities";
import { DialogQueue } from "../../Dialog/Entities";
import { DispatchDisposeAppUC, DispatchStopAppUC } from "../../Dispatcher/UCs";
import {
  HostHandlerEntity,
  RequestHandler,
  UnsupportedRequestVersion
} from "../Entities";
import { MounterUC } from "../../Apps";

export abstract class CloseAssetSystemPluginUC
  extends AppObjectUC
  implements RequestHandler {
  static readonly type = "CloseAssetSystemPluginUC";

  readonly requestType = "CLOSE_PLUGIN";
  readonly payloadVersion = 1;

  abstract action: () => void;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeCloseAssetSystemPluginUC(
  appObject: AppObject
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

    const mounter = MounterUC.get(this.appObject);
    if (!mounter) {
      this.error("Cannot find MounterUC");
      return;
    }
    
    dispatchStopApp.doDispatch();
    dispatchDisposeApp.doDispatch();
    mounter.unmount();

    this.assetSystemPlugin.show = false;
  };

  constructor(appObject: AppObject) {
    super(appObject, CloseAssetSystemPluginUC.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}
