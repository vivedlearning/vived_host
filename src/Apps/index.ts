/**
 * Apps Module - Core module for managing application lifecycle in the VIVED Learning platform
 *
 * This module handles app loading, mounting, starting, stopping, and state management.
 * It follows a clean architecture pattern with the following layers:
 *
 * - Entities: Core domain models (AppEntity, AppRepo)
 * - PMs (Presentation Models): Business logic and state management
 * - UCs (Use Cases): Implementation of specific operations
 * - Adapters: Connect PMs to UI components
 * - Controllers: Entry points for UI interactions
 *
 * To use this module, typically you would:
 * 1. Load an app using the AppEntity
 * 2. Mount the app using MounterUC
 * 3. Start the app using StartAppUC
 * 4. Manage app state via the AppPM or ActiveAppPM
 * 5. Stop the app using StopAppUC when done
 */

export * from "./Adapters";
export * from "./Controllers";
export * from "./Entities";
export * from "./Mocks";
export * from "./PMs";
export * from "./UCs";
