import {
  getSingletonComponent,
  AppObject,
  AppObjectPM,
  AppObjectRepo
} from "@vived/core";
import { AppState } from "../../Apps";
import { AssetPluginEntity } from "../Entities/AssetPluginEntity";

export interface AssetPluginVM {
  show: boolean;
  loading: boolean;
  styleSheets: string[];
}

export const defaultAssetPluginVM: AssetPluginVM = {
  show: false,
  loading: false,
  styleSheets: []
};

export abstract class AssetPluginPM extends AppObjectPM<AssetPluginVM> {
  static type = "AssetSystemPluginPM";

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<AssetPluginPM>(AssetPluginPM.type, appObjects);
  }
}

export function makeAssetPluginPM(appObject: AppObject): AssetPluginPM {
  return new AssetPluginPMImp(appObject);
}

class AssetPluginPMImp extends AssetPluginPM {
  private get assetPlugin() {
    return this.getCachedSingleton<AssetPluginEntity>(AssetPluginEntity.type);
  }

  vmsAreEqual(a: AssetPluginVM, b: AssetPluginVM): boolean {
    if (a.loading !== b.loading) return false;
    if (a.show !== b.show) return false;

    if (a.styleSheets.length !== b.styleSheets.length) return false;

    let stylesMatch = true;

    a.styleSheets.forEach((styleA, i) => {
      const styleB = b.styleSheets[i];
      if (styleA !== styleB) stylesMatch = false;
    });

    return stylesMatch;
  }

  onChange = () => {
    if (!this.assetPlugin) return;

    const show = this.assetPlugin.show;

    let loading = false;

    if (show && this.assetPlugin.app?.state === AppState.INIT) {
      loading = true;
    } else if (show && this.assetPlugin.app?.state === AppState.LOADING) {
      loading = true;
    }

    const vm: AssetPluginVM = {
      show,
      loading,
      styleSheets: this.assetPlugin.app?.styles ?? []
    };

    this.doUpdateView(vm);
  };

  constructor(appObject: AppObject) {
    super(appObject, AssetPluginPM.type);

    this.assetPlugin?.addChangeObserver(this.onChange);
    this.onChange();

    this.appObjects.registerSingleton(this);
  }
}
