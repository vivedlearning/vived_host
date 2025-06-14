import { AppObject, AppObjectRepo, AppObjectUC } from "@vived/core";
import { HostDispatchEntity } from "../Entities";

export abstract class DispatchStartZSpaceUC extends AppObjectUC {
  static readonly type = "DispatchStartZSpaceUC";
  readonly requestType = "START_ZSPACE";

  abstract doDispatch(session: any, emulate: boolean): void;

  static get(appObject: AppObject): DispatchStartZSpaceUC | undefined {
    const asset = appObject.getComponent<DispatchStartZSpaceUC>(
      DispatchStartZSpaceUC.type
    );
    if (!asset) {
      appObject.appObjectRepo.submitWarning(
        "DispatchStartZSpaceUC.get",
        "Unable to find DispatchStartZSpaceUC on app object " + appObject.id
      );
    }
    return asset;
  }

  static getByID(
    id: string,
    appObjects: AppObjectRepo
  ): DispatchStartZSpaceUC | undefined {
    const appObject = appObjects.get(id);

    if (!appObject) {
      appObjects.submitWarning(
        "DispatchStartZSpaceUC.getByID",
        "Unable to find App Object by id " + id
      );
      return undefined;
    }

    return DispatchStartZSpaceUC.get(appObject);
  }
}

export function makeDispatchStartZSpaceUC(
  appObject: AppObject
): DispatchStartZSpaceUC {
  return new DispatchStartZSpaceUCImp(appObject);
}

class DispatchStartZSpaceUCImp extends DispatchStartZSpaceUC {
  private dispatcher?: HostDispatchEntity;

  doDispatch = (session: any, emulate: boolean): void => {
    if (!this.dispatcher) return;

    const payloadVersion = this.dispatcher.getRequestPayloadVersion(
      this.requestType
    );

    if (payloadVersion === 2) {
      this.dispatchVersion2(session, emulate);
    } else if (payloadVersion === 3 || payloadVersion === undefined) {
      this.dispatchDefault(session, emulate);
    } else {
      this.warn(`Unsupported version ${payloadVersion} requested. Defaulting`);
      this.dispatchDefault(session, emulate);
    }
  };

  private dispatchVersion2(session: any, emulate: boolean) {
    if (!this.dispatcher) return;

    const payload = {
      device: "INSPIRE",
      session,
      emulate
    };

    this.dispatcher.formRequestAndDispatch(this.requestType, 2, payload);
  }

  private dispatchDefault(session: any, emulate: boolean) {
    if (!this.dispatcher) return;

    const payload = {
      session,
      emulate
    };

    this.dispatcher.formRequestAndDispatch(this.requestType, 3, payload);
  }

  constructor(appObject: AppObject) {
    super(appObject, DispatchStartZSpaceUC.type);

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
