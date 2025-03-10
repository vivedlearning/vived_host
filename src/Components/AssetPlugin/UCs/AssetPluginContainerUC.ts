import { getSingletonComponent, AppObjectRepo, AppObjectUC } from "@vived/core";

export abstract class AssetPluginContainerUC extends AppObjectUC {
  static type = "AssetPluginContainerUC";

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<AssetPluginContainerUC>(
      AssetPluginContainerUC.type,
      appObjects
    );
  }

  abstract setContainer(container: HTMLElement): Promise<void>;
  abstract clearContainer(): void;
}
