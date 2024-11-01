import { HostAppObject } from "../../../HostAppObject";
import { MounterUC } from "../../Apps";
import { AppSandboxEntity } from "../../AppSandbox";
import { BrowseChannelDTO, DispatchStartBrowseChannelsUC, DispatchStopAppUC } from "../../Dispatcher";
import { VivedAPIEntity } from "../../VivedAPI";
import { AssetPluginEntity } from "../Entities";
import { AssetPluginContainerUC } from "./AssetPluginContainerUC";

export function makeSandboxAssetPluginContainerUC(appObject: HostAppObject) {
  return new SandboxAssetPluginContainerUC(appObject);
}

class SandboxAssetPluginContainerUC extends AssetPluginContainerUC {
  private get mounterUC() {
    return this.getCachedLocalComponent<MounterUC>(MounterUC.type);
  }

  private get assetPlugin() {
    return this.getCachedSingleton<AssetPluginEntity>(AssetPluginEntity.type);
  }

  private get dispatchStart() {
    return this.getCachedLocalComponent<DispatchStartBrowseChannelsUC>(
      DispatchStartBrowseChannelsUC.type
    );
  }

  private get dispatchStop() {
    return this.getCachedLocalComponent<DispatchStopAppUC>(
      DispatchStopAppUC.type
    );
  }

  private get sandbox() {
    return this.getCachedSingleton<AppSandboxEntity>(AppSandboxEntity.type);
  }

  private get vivedAPI() {
    return this.getCachedSingleton<VivedAPIEntity>(VivedAPIEntity.type);
  }

  clearContainer = (): void => {
    if (!this.assetPlugin || !this.dispatchStop) return;
    if (!this.assetPlugin.app?.isMounted) return;

    this.assetPlugin.container = undefined;
    this.dispatchStop.doDispatch();
  };

  setContainer = (container: HTMLDivElement): Promise<void> => {
    const assetPlugin = this.assetPlugin;
    const mounterUC = this.mounterUC;
    const start = this.dispatchStart;
    if (
      !mounterUC ||
      !assetPlugin ||
      !start ||
      !this.vivedAPI ||
      !this.sandbox
    ) {
      return Promise.resolve();
    }

    assetPlugin.container = container;

    const channelID = this.sandbox.channelID ?? "";

    const dto: BrowseChannelDTO = {
      baseApiURL: this.vivedAPI.baseUrl,
      channelID,
      container,
      callback: assetPlugin.callback
    };

    return new Promise((resolve) => {
      mounterUC
        .mount(assetPlugin.version.major, assetPlugin.version.minor)
        .then(() => {
          start.doDispatch(dto);
          resolve();
        });
    });
  };

  constructor(appObject: HostAppObject) {
    super(appObject, AssetPluginContainerUC.type);

    this.appObjects.registerSingleton(this);
  }
}
