import { AppObject, AppObjectRepo, AppObjectUC } from "@vived/core";
import { DispatchStopAppUC } from "../../Dispatcher";

/**
 * Use Case for stopping an application.
 *
 * This class provides functionality to stop a running app through the dispatcher
 * system. It acts as a bridge between controllers and the dispatch mechanism.
 *
 * @extends AppObjectUC from @vived/core
 */
export abstract class StopAppUC extends AppObjectUC {
  static type = "StopAppUC";

  /**
   * Stops the application associated with this Use Case.
   */
  abstract stop(): void;

  /**
   * Retrieves the StopAppUC component from a specific App Object.
   *
   * @param appObject - The App Object to get the component from
   * @returns The StopAppUC component or undefined if not found
   */
  static get(appObject: AppObject): StopAppUC | undefined {
    const asset = appObject.getComponent<StopAppUC>(StopAppUC.type);
    if (!asset) {
      appObject.appObjectRepo.submitWarning(
        "StopAppUC.get",
        "Unable to find StartAppUC on app object " + appObject.id
      );
    }
    return asset;
  }

  /**
   * Retrieves the StopAppUC component by App Object ID.
   *
   * @param id - The ID of the App Object
   * @param appObjects - The App Object repository
   * @returns The StopAppUC component or undefined if not found
   */
  static getByID(id: string, appObjects: AppObjectRepo): StopAppUC | undefined {
    const appObject = appObjects.get(id);

    if (!appObject) {
      appObjects.submitWarning(
        "StopAppUC.getByID",
        "Unable to find App Object by id " + id
      );
      return undefined;
    }

    return StopAppUC.get(appObject);
  }

  /**
   * Convenience method to stop an app by its ID.
   *
   * @param id - The ID of the app to stop
   * @param appObjects - The App Object repository
   */
  static stopByID(id: string, appObjects: AppObjectRepo) {
    StopAppUC.getByID(id, appObjects)?.stop();
  }
}

/**
 * Factory function to create a new StopAppUC instance.
 *
 * @param appObject - The App Object to attach the component to
 * @returns A new StopAppUC instance
 */
export function makeStopAppUC(appObject: AppObject): StopAppUC {
  return new StartAppUCImp(appObject);
}

/**
 * Concrete implementation of the StopAppUC abstract class.
 */
class StartAppUCImp extends StopAppUC {
  /**
   * Gets the dispatch component that sends the stop command to the app.
   */
  private get dispatchStop() {
    return this.getCachedLocalComponent<DispatchStopAppUC>(
      DispatchStopAppUC.type
    );
  }

  /**
   * Stops the app by triggering the dispatch mechanism.
   */
  stop(): void {
    this.dispatchStop?.doDispatch();
  }

  /**
   * Creates a new instance of the StopAppUC implementation.
   *
   * @param appObject - The App Object to attach to
   */
  constructor(appObject: AppObject) {
    super(appObject, StopAppUC.type);
  }
}
