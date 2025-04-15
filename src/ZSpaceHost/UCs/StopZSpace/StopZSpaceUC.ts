import { getSingletonComponent, AppObjectRepo, AppObjectUC } from "@vived/core";

/**
 * StopZSpaceUC is a singleton Use Case responsible for stopping an active zSpace session.
 *
 * This Use Case handles:
 * 1. Properly ending the current zSpace XR session
 * 2. Cleaning up resources associated with the session
 * 3. Updating the ZSpaceHostEntity to reflect the inactive state
 *
 * Usage:
 * ```typescript
 * // In a controller or UI event handler:
 * const stopZSpace = (appObjects) => {
 *   const uc = StopZSpaceUC.get(appObjects);
 *   if (!uc) {
 *     console.error("StopZSpaceUC not found");
 *     return;
 *   }
 *
 *   uc.stopZSpace();
 *   console.log("zSpace session stopped");
 * };
 * ```
 *
 * Important notes:
 * - This is a synchronous operation and completes immediately
 * - When called, ZSpaceHostEntity.isActive will be set to false
 * - UI components should observe ZSpaceIsActivePM to react to state changes
 * - This should be called when the application no longer needs zSpace features
 * - It's good practice to call this before application shutdown or when
 *   transitioning to a non-zSpace part of the application
 */
export abstract class StopZSpaceUC extends AppObjectUC {
  static type = "StopZSpaceUC";

  /**
   * Stop the active zSpace session
   * This method completes synchronously and does not return a value
   */
  abstract stopZSpace(): void;

  /**
   * Get the singleton instance of StopZSpaceUC
   * @param appObjects - The AppObjectRepo instance
   * @returns The StopZSpaceUC instance or undefined if not found
   */
  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<StopZSpaceUC>(StopZSpaceUC.type, appObjects);
  }
}
