import { AppObject, AppObjectRepo, AppObjectUC } from "@vived/core";
import { HostDispatchEntity } from "../Entities";

export interface DispatchStateDTO {
  finalState?: object;
  hideNavigation: boolean;
  hasNextSlide: boolean;
  hasPreviousSlide: boolean;
  duration?: number;
}

export abstract class DispatchSetStateUC extends AppObjectUC {
  static readonly type = "DispatchSetStateUC";
  readonly requestType = "SET_APP_STATE";

  abstract doDispatch(dto: DispatchStateDTO): void;

  static get(appObject: AppObject): DispatchSetStateUC | undefined {
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
    appObjects: AppObjectRepo
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
  appObject: AppObject
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

    this.dispatcher.formRequestAndDispatch(this.requestType, 3, payload);
  }

  private dispatchV2(state: object | undefined, duration?: number) {
    const finalState = state ? JSON.stringify(state) : "";
    const payload: SetStatePayloadV2 = {
      finalState,
      duration
    };

    this.dispatcher?.formRequestAndDispatch(this.requestType, 2, payload);
  }

  constructor(appObject: AppObject) {
    super(appObject, DispatchSetStateUC.type);
  }
}

// No V1 is supported
export interface SetStatePayloadV2 {
  finalState: string;
  duration?: number;
}

export interface SetStatePayloadV3 {
  hideNavigation: boolean;
  hasNextSlide: boolean;
  hasPreviousSlide: boolean;
  duration?: number;
  finalState?: object;
}
