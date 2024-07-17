import { getSingletonComponent, HostAppObject, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";
import { HostStateMachine, StateMachineState } from "../../StateMachine";
import { GetAssetFileUC } from "./GetAssetFileUC";

export abstract class PrefetchAssetsUC extends HostAppObjectUC {
  static type = "PrefetchAssetsUC";

  abstract prefetchAssets(): Promise<void>;

  static get(appObjects: HostAppObjectRepo): PrefetchAssetsUC | undefined {
    return getSingletonComponent(PrefetchAssetsUC.type, appObjects);
  }
}

export function makePrefetchAssets(appObject: HostAppObject): PrefetchAssetsUC {
  return new HostAppObjectRepoImp(appObject);
}

class HostAppObjectRepoImp extends PrefetchAssetsUC {
  private get stateMachine() {
    return this.getCachedSingleton<HostStateMachine>(HostStateMachine.type);
  }

  private get fetchAssetFile() {
    return this.getCachedSingleton<GetAssetFileUC>(GetAssetFileUC.type)
      ?.getAssetFile;
  }

  prefetchAssets = async (): Promise<void> => {
    const fetchAssetFile = this.fetchAssetFile;
    if (!this.stateMachine || !fetchAssetFile) {
      return Promise.reject();
    }

    const totalAssetIds = this.stateMachine.states.reduce(
      (assetIds: string[], state: StateMachineState) => {
        return assetIds.concat(state.assets);
      },
      []
    );

    const uniqueAssetIds = Array.from(new Set(totalAssetIds));

    return new Promise<void>((resolve, reject) => {
      const fetchPromises = uniqueAssetIds.map((assetID) => {
        return fetchAssetFile(assetID);
      });

      Promise.all(fetchPromises)
        .then(() => {
          resolve();
        })
        .catch((e: Error) => {
          this.warn(e.message);
          reject(e);
        });
    });
  };

  constructor(appObject: HostAppObject) {
    super(appObject, PrefetchAssetsUC.type);
    this.appObjects.registerSingleton(this);
  }
}
