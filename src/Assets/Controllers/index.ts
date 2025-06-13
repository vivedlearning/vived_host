/**
 * Assets Controllers Index
 *
 * This module exports all controller functions for the Assets feature.
 * Controllers provide simple, stateless functions that serve as entry points
 * for asset-related operations from UI components and external systems.
 *
 * Key Concepts:
 * - Controllers act as the interface layer between UI components and business logic
 * - Each controller function handles a specific asset operation
 * - Controllers delegate to Use Cases (UCs) for actual business logic implementation
 * - Error handling and validation are performed at the controller level
 *
 * Available Operations:
 * - Asset lifecycle: create, edit, delete, archive
 * - File management: upload, download, update
 * - Collection management: get app assets, toggle archived visibility
 * - Metadata management: update asset information
 */

export * from "./archiveAsset";
export * from "./deleteAsset";
export * from "./downloadAssetFile";
export * from "./editAppAsset";
export * from "./getAppAssets";
export * from "./newAppAsset";
export * from "./toggleShowArchivedAssets";
export * from "./updateAppAssetMeta";
export * from "./updateAssetFile";
