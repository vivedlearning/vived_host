import { AppObject, AppObjectRepo, AppObjectUC } from "@vived/core";
import { AppSandboxEntity } from "../../AppSandbox";
import {
  DispatchEnableFeatureUC,
  DispatchIsAuthoringUC,
  DispatchSetStateUC,
  DispatchStartAppUC,
  DispatchStateDTO,
  DispatchThemeUC
} from "../../Dispatcher";
import {
  HostEditingStateEntity,
  HostStateMachine
} from "../../StateMachine/Entities";

/**
 * StartAppUC - Use case for starting an application in the host environment
 * 
 * This use case is responsible for initializing and starting an application
 * within the VIVED Learning platform. It handles setting up the application container,
 * initializing the app with the appropriate state, and dispatching necessary configurations.
 * 
 * The StartAppUC coordinates between several subsystems:
 * - State Machine: Provides the current application state
 * - Dispatcher: Communicates with the app via message passing
 * - AppSandbox: Provides development features when enabled
 * 
 * @extends AppObjectUC from @vived/core
 */
export abstract class StartAppUC extends AppObjectUC {
  /** Type identifier for the StartAppUC component */
  static type = "StartAppUC";

  /**
   * Abstract method that starts the application
   * 
   * @param container - HTML element that will contain the app
   */
  abstract start(container: HTMLElement): void;

  /**
   * Gets a StartAppUC instance from an app object
   * 
   * @param appObject - App object to get the StartAppUC from
   * @returns StartAppUC instance if found, undefined otherwise
   */
  static get(appObject: AppObject): StartAppUC | undefined {
    const asset = appObject.getComponent<StartAppUC>(StartAppUC.type);
    if (!asset) {
      appObject.appObjectRepo.submitWarning(
        "StartAppUC.get",
        "Unable to find StartAppUC on app object " + appObject.id
      );
    }
    return asset;
  }

  /**
   * Gets a StartAppUC instance by app ID
   * 
   * @param id - ID of the app to start
   * @param appObjects - Repository containing app objects
   * @returns StartAppUC instance if found, undefined otherwise
   */
  static getByID(
    id: string,
    appObjects: AppObjectRepo
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

  /**
   * Convenience method to start an app by ID
   * 
   * @param container - HTML element to mount the app in
   * @param id - ID of the app to start
   * @param appObjects - Repository containing app objects
   */
  static startByID(
    container: HTMLElement,
    id: string,
    appObjects: AppObjectRepo
  ) {
    StartAppUC.getByID(id, appObjects)?.start(container);
  }
}

/**
 * Factory function to create a new StartAppUC instance
 * 
 * @param appObject - The app object to attach the use case to
 * @returns A concrete implementation of StartAppUC
 */
export function makeStartAppUC(appObject: AppObject): StartAppUC {
  return new StartAppUCImp(appObject);
}

/**
 * Concrete implementation of StartAppUC
 * Uses dependency injection to access required components
 * Handles the app starting process
 */
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

  private get dispatchEnableFeature() {
    return this.getCachedLocalComponent<DispatchEnableFeatureUC>(
      DispatchEnableFeatureUC.type
    );
  }

  private get sandbox() {
    return this.getCachedSingleton<AppSandboxEntity>(AppSandboxEntity.type);
  }

  start = (container: HTMLElement) => {
    if (!this.stateMachine) return;
    if (!this.dispatchStart) return;
    if (!this.editStateEntity) return;
    if (!this.sandbox) return;

    this.dispatchStart.doDispatch(container);

    let state;
    if (this.stateMachine.activeState) {
      state = this.stateMachine.getStateByID(this.stateMachine.activeState)
        ?.stateData;
    }

    const hideNavigation = this.stateMachine.states.length <= 1;
    const hasNextSlide = this.stateMachine.nextState !== undefined;
    const hasPreviousSlide = this.stateMachine.previousState !== undefined;
    const dto: DispatchStateDTO = {
      finalState: state,
      hideNavigation,
      hasNextSlide,
      hasPreviousSlide
    };
    this.dispatchSetState?.doDispatch(dto);

    let isAuthoring = this.editStateEntity.isEditing;
    if (this.stateMachine.activeState === undefined) {
      isAuthoring = true;
    }
    this.dispatchSetIsAuthoring?.doDispatch(isAuthoring);

    this.dispatchThemeColors?.doDispatch();

    if (this.sandbox.enableDevFeatures) {
      this.sandbox.devFeatures.forEach((feature) => {
        this.dispatchEnableFeature?.doDispatch(feature);
      });
    }
  };

  constructor(appObject: AppObject) {
    super(appObject, StartAppUC.type);
  }
}
