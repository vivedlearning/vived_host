import { getSingletonComponent, AppObjectRepo, AppObjectUC } from "@vived/core";

/**
 * StartZSpaceUC is a singleton Use Case responsible for starting a zSpace session.
 *
 * This Use Case handles:
 * 1. Setting up and initializing the zSpace XR session
 * 2. Updating the ZSpaceHostEntity to reflect the active state
 * 3. Handling errors in the setup process
 *
 * Usage:
 * ```typescript
 * // In a controller or UI event handler:
 * const startZSpace = async (appObjects) => {
 *   const uc = StartZSpaceUC.get(appObjects);
 *   if (!uc) {
 *     console.error("StartZSpaceUC not found");
 *     return;
 *   }
 *
 *   try {
 *     await uc.startZSpace();
 *     console.log("zSpace session started successfully");
 *   } catch (error) {
 *     console.error("Failed to start zSpace session:", error);
 *   }
 * };
 * ```
 *
 * Important notes:
 * - This is an asynchronous operation and may take some time to complete
 * - Success/failure is indicated by the Promise resolution/rejection
 * - When successful, ZSpaceHostEntity.isActive will be set to true
 * - UI components should observe ZSpaceIsActivePM to react to state changes
 */
export abstract class StartZSpaceUC extends AppObjectUC {
  static type = "StartZSpaceUC";

  /**
   * Start the zSpace session
   * @returns A Promise that resolves when the session has started successfully,
   *          or rejects with an error if the session could not be started
   */
  abstract startZSpace(): Promise<void>;

  /**
   * Get the singleton instance of StartZSpaceUC
   * @param appObjects - The AppObjectRepo instance
   * @returns The StartZSpaceUC instance or undefined if not found
   */
  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<StartZSpaceUC>(StartZSpaceUC.type, appObjects);
  }
}
