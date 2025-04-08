/**
 * Presentation Manager Adapters for the Apps Module
 *
 * This module exports adapters that provide a simplified interface between
 * Framework components (Views) and Domain Presentation Managers.
 *
 * Available adapters:
 *
 * - activeAppPMAdapter: Singleton adapter for accessing the currently active app
 * - appListPMAdapter: Singleton adapter for accessing the list of available apps
 * - appPMAdapter: Non-singleton adapter for accessing details about a specific app by ID
 *
 * @module Apps/Adapters
 */

export * from "./activeAppPMAdapter";
export * from "./appListPMAdapter";
export * from "./appPMAdapter";
