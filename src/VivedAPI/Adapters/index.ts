/**
 * VivedAPI Adapters Index
 *
 * This module exports all adapter objects for the VivedAPI feature.
 * Adapters provide standardized interfaces for connecting presentation managers
 * to various UI frameworks and libraries, handling subscription lifecycles
 * and view model synchronization.
 *
 * Key Concepts:
 * - Adapters implement framework-specific integration patterns
 * - They manage subscription and unsubscription to presentation manager updates
 * - Adapters provide default view model values for initialization
 * - They handle error cases when presentation managers are unavailable
 * - Adapters enable reactive UI updates across different frontend technologies
 *
 * Available Adapters:
 * - apiStageAdapter: Connects API stage configuration to UI components
 * - userTokenAdapter: Connects user authentication token state to UI displays
 */

export * from "./apiStageAdapter";
export * from "./userTokenAdapter";
