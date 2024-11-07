import {
  HostAppObject,
  HostAppObjectRepo,
  HostAppObjectUC
} from "../../../HostAppObject";
import { HostDispatchEntity } from "../Entities";

export interface DispatchStateDTO {
  finalState: object;
  hideNavigation: boolean;
  hasNextSlide: boolean;
  hasPreviousSlide: boolean;
  duration?: number;
}

export abstract class DispatchSetStateUC extends HostAppObjectUC {
  static readonly type = "DispatchSetStateUC";
  readonly requestType = "SET_APP_STATE";

  abstract doDispatch(dto: DispatchStateDTO): void;

  static get(appObject: HostAppObject): DispatchSetStateUC | undefined {
    const asset = appObject.getComponent<DispatchSetStateUC>(
      DispatchSetStateUC.type
    );
    if (!asset) {
      appObject.appObjectRepo.submitWarning(
        "DispatchSetStateUC.get",
        "Unable to find DispatchSetStateUC on app object " + appObject.id
      );
    }
    return asset;
  }

  static getByID(
    id: string,
    appObjects: HostAppObjectRepo
  ): DispatchSetStateUC | undefined {
    const appObject = appObjects.get(id);

    if (!appObject) {
      appObjects.submitWarning(
        "DispatchSetStateUC.getByID",
        "Unable to find App Object by id " + id
      );
      return undefined;
    }

    return DispatchSetStateUC.get(appObject);
  }
}

export function makeDispatchSetStateUC(
  appObject: HostAppObject
): DispatchSetStateUC {
  return new DispatchSetStateUCImp(appObject);
}

class DispatchSetStateUCImp extends DispatchSetStateUC {
  private get dispatcher() {
    return this.getCachedLocalComponent<HostDispatchEntity>(
      HostDispatchEntity.type
    );
  }

  doDispatch(dto: DispatchStateDTO): void {
    if (!this.dispatcher) return;
    const {
      finalState,
      duration,
      hasNextSlide,
      hasPreviousSlide,
      hideNavigation
    } = dto;

    const requestedPayload = this.dispatcher.getRequestPayloadVersion(
      this.requestType
    );
    if (!requestedPayload || requestedPayload <= 2) {
      this.dispatchV2(finalState, duration);
      return;
    }

    const payload: SetStatePayloadV3 = {
      finalState,
      duration,
      hasNextSlide,
      hasPreviousSlide,
      hideNavigation
    };

    this.dispatcher.formRequestAndDispatch(
      this.requestType,
      3,
      payload
    );
  }

  private dispatchV2(state: object, duration?: number) {
    const payload: SetStatePayloadV2 = {
      finalState: JSON.stringify(state),
      duration
    };

    this.dispatcher?.formRequestAndDispatch(this.requestType, 2, payload);
  }

  constructor(appObject: HostAppObject) {
    super(appObject, DispatchSetStateUC.type);
  }
}

//No V1 is supported
export interface SetStatePayloadV2 {
  finalState: string;
  duration?: number;
}

export interface SetStatePayloadV3 {
  finalState: object;
  hideNavigation: boolean;
  hasNextSlide: boolean;
  hasPreviousSlide: boolean;
  duration?: number;
}
