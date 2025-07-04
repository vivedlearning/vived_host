import { AppObject, AppObjectRepo, AppObjectUC } from "@vived/core";
import { HostDispatchEntity } from "../Entities";

export interface BrowseChannelDTO {
  channelID: string;
  container: HTMLDivElement;
  baseApiURL: string;
  callback: (modelID: string, dataID: string) => void;
}

export abstract class DispatchStartBrowseChannelsUC extends AppObjectUC {
  static readonly type = "DispatchStartBrowseChannelsUC";
  readonly requestType = "START_SELECT_CHANNEL_MODEL";

  abstract doDispatch(dto: BrowseChannelDTO): void;

  static get(appObject: AppObject): DispatchStartBrowseChannelsUC | undefined {
    const asset = appObject.getComponent<DispatchStartBrowseChannelsUC>(
      DispatchStartBrowseChannelsUC.type
    );
    if (!asset) {
      appObject.appObjectRepo.submitWarning(
        "DispatchStartBrowseChannelsUC.get",
        "Unable to find DispatchStartBrowseChannelsUC on app object " +
          appObject.id
      );
    }
    return asset;
  }

  static getByID(
    id: string,
    appObjects: AppObjectRepo
  ): DispatchStartBrowseChannelsUC | undefined {
    const appObject = appObjects.get(id);

    if (!appObject) {
      appObjects.submitWarning(
        "DispatchStartBrowseChannelsUC.getByID",
        "Unable to find App Object by id " + id
      );
      return undefined;
    }

    return DispatchStartBrowseChannelsUC.get(appObject);
  }
}

export function makeDispatchStartBrowseChannelsUC(
  appObject: AppObject
): DispatchStartBrowseChannelsUC {
  return new DispatchStartBrowseChannelsUCImp(appObject);
}

class DispatchStartBrowseChannelsUCImp extends DispatchStartBrowseChannelsUC {
  readonly requestVersion = 1;
  private dispatcher?: HostDispatchEntity;

  doDispatch(dto: BrowseChannelDTO): void {
    if (!this.dispatcher) return;

    const payload = {
      channelID: dto.channelID,
      container: dto.container,
      baseApiUrl: dto.baseApiURL,
      callback: dto.callback
    };

    this.dispatcher.formRequestAndDispatch(
      this.requestType,
      this.requestVersion,
      payload
    );
  }

  constructor(appObject: AppObject) {
    super(appObject, DispatchStartBrowseChannelsUC.type);

    this.dispatcher = appObject.getComponent<HostDispatchEntity>(
      HostDispatchEntity.type
    );
    if (!this.dispatcher) {
      this.error(
        "UC has been added to an App Object that does not have a HostDispatchEntity. Add a dispatcher first"
      );
      this.dispose();
    }
  }
}
