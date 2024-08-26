import { MemoizedBoolean } from "../../../Entities";
import { getSingletonComponent, HostAppObject, HostAppObjectEntity, HostAppObjectRepo } from "../../../HostAppObject";
import { Version, VersionStage } from "../../../ValueObjects";
import { AppEntity, makeAppEntity } from "../../Apps";

export type InitializeApp = (
  id: string,
  majorVersion: number,
  minorVersion: number
) => Promise<void>;

export abstract class AssetPluginEntity extends HostAppObjectEntity {
  static type = "AssetPluginEntity";

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<AssetPluginEntity>(
      AssetPluginEntity.type,
      appObjects
    );
  }

  abstract container: HTMLElement | undefined;
  abstract get app(): AppEntity;
  abstract get show(): boolean;
  abstract set show(val: boolean);
  abstract version: Version;
  abstract callback: (modelId: string, dataId: string) => void;
}

export function makeAssetPluginEntity(
  appObject: HostAppObject
): AssetPluginEntity {
  return new AssetPluginEntityImp(appObject);
}

class AssetPluginEntityImp extends AssetPluginEntity {
  version: Version = new Version(0, 0, 0, VersionStage.RELEASED);
  container: HTMLElement | undefined;

  private _app: AppEntity;
  get app(): AppEntity {
    return this._app;
  }

  private memoizedShowApp = new MemoizedBoolean(false, this.notifyOnChange);
  get show() {
    return this.memoizedShowApp.val;
  }
  set show(val: boolean) {
    this.memoizedShowApp.val = val;
  }

  callback = (modelId: string, dataId: string): void => {
    this.warn("Callback has not been injected");
  };

  constructor(appObject: HostAppObject) {
    super(appObject, AssetPluginEntity.type);

    this._app = makeAppEntity(this.appObject);
    this._app.addChangeObserver(this.notifyOnChange);

    this.appObjects.registerSingleton(this);
  }
}
