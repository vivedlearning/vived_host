/**
 * Assets Use Cases Index
 *
 * This module exports all use case classes for the Assets feature.
 * Use cases contain the business logic for asset operations and coordinate
 * between entities, external services, and user interface components.
 *
 * Key Concepts:
 * - Use cases implement specific business operations and workflows
 * - They coordinate between entities, APIs, and UI components
 * - Each UC handles validation, error management, and state updates
 * - Singleton UCs manage system-wide operations, per-asset UCs handle individual items
 * - UCs provide clean interfaces for controllers and other components
 *
 * Available Use Cases:
 * - Asset lifecycle: create, archive, delete, update
 * - File management: download, fetch, update file content
 * - Metadata management: update asset information and properties
 * - Collection management: get assets for apps, prefetch for performance
 * - Caching and optimization: blob URL generation, file caching strategies
 */

export * from "./ArchiveAssetUC";
export * from "./DeleteAssetUC";
export * from "./DownloadAssetFileUC";
export * from "./EditAppAssetUC";
export * from "./GetAppAssetsUC";
export * from "./GetAssetBlobURLUC";
export * from "./GetAssetFileUC";
export * from "./GetAssetUC";
export * from "./NewAppAssetUC";
export * from "./NewAssetUC";
export * from "./PrefetchAssetsUC";
export * from "./UpdateAppAssetMetaUC";
export * from "./UpdateAssetFileUC";
