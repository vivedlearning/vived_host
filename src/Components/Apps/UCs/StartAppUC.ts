import {
  HostAppObject,
  HostAppObjectRepo,
  HostAppObjectUC
} from "../../../HostAppObject";
import {
  DispatchIsAuthoringUC,
  DispatchSetStateUC,
  DispatchStartAppUC,
  DispatchThemeUC
} from "../../Dispatcher";
import { HostEditingStateEntity, HostStateMachine } from "../../StateMachine";

export abstract class StartAppUC extends HostAppObjectUC {
  static type = "StartAppUC";

  abstract start(container: HTMLElement): void;

  static get(appObject: HostAppObject): StartAppUC | undefined {
    const asset = appObject.getComponent<StartAppUC>(StartAppUC.type);
    if (!asset) {
      appObject.appObjectRepo.submitWarning(
        "StartAppUC.get",
        "Unable to find StartAppUC on app object " + appObject.id
      );
    }
    return asset;
  }

  static getByID(
    id: string,
    appObjects: HostAppObjectRepo
  ): StartAppUC | undefined {
    const appObject = appObjects.get(id);

    if (!appObject) {
      appObjects.submitWarning(
        "StartAppUC.getByID",
        "Unable to find App Object by id " + id
      );
      return undefined;
    }

    return StartAppUC.get(appObject);
  }

  static startByID(
    container: HTMLElement,
    id: string,
    appObjects: HostAppObjectRepo
  ) {
    StartAppUC.getByID(id, appObjects)?.start(container);
  }
}

export function makeStartAppUC(appObject: HostAppObject): StartAppUC {
  return new StartAppUCImp(appObject);
}

class StartAppUCImp extends StartAppUC {
  private get stateMachine() {
    return this.getCachedSingleton<HostStateMachine>(HostStateMachine.type);
  }

  private get editStateEntity() {
    return this.getCachedSingleton<HostEditingStateEntity>(
      HostEditingStateEntity.type
    );
  }

  private get dispatchStart() {
    return this.getCachedLocalComponent<DispatchStartAppUC>(
      DispatchStartAppUC.type
    );
  }

  private get dispatchSetState() {
    return this.getCachedLocalComponent<DispatchSetStateUC>(
      DispatchSetStateUC.type
    );
  }

  private get dispatchSetIsAuthoring() {
    return this.getCachedLocalComponent<DispatchIsAuthoringUC>(
      DispatchIsAuthoringUC.type
    );
  }

  private get dispatchThemeColors() {
    return this.getCachedLocalComponent<DispatchThemeUC>(DispatchThemeUC.type);
  }

  start = (container: HTMLElement) => {
    if (!this.stateMachine) return;
    if (!this.dispatchStart) return;
    if (!this.editStateEntity) return;

    this.dispatchStart.doDispatch(container);

    let stateString = "";
    if (this.stateMachine.activeState && this.stateMachine.activeState) {
      const state = this.stateMachine.getStateByID(
        this.stateMachine.activeState
      );
      if (state) {
        stateString = JSON.stringify(state.stateData);
      }
    }
    this.dispatchSetState?.doDispatch(stateString);

    let isAuthoring = this.editStateEntity.isEditing;
    if (this.stateMachine.activeState === undefined) {
      isAuthoring = true;
    }
    this.dispatchSetIsAuthoring?.doDispatch(isAuthoring);

    this.dispatchThemeColors?.doDispatch();
  };

  constructor(appObject: HostAppObject) {
    super(appObject, StartAppUC.type);
  }
}
