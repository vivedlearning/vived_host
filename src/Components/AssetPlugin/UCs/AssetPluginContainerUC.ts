import {
  getSingletonComponent,

  HostAppObjectRepo,
  HostAppObjectUC
} from "../../../HostAppObject";

export abstract class AssetPluginContainerUC extends HostAppObjectUC {
  static type = "AssetPluginContainerUC";

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<AssetPluginContainerUC>(
      AssetPluginContainerUC.type,
      appObjects
    );
  }

  abstract setContainer(container: HTMLElement): Promise<void>;
  abstract clearContainer(): void;
}
