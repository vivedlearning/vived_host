/**
 * VivedAPI Entities Index
 *
 * This module exports all entity classes for the VivedAPI feature.
 * Entities represent the core business objects and data models that store state,
 * track changes, and notify observers when modifications occur.
 *
 * Key Concepts:
 * - Entities extend AppObjectEntity and manage domain-specific data
 * - They use Memoized types to track changes and trigger notifications
 * - Singleton entities provide system-wide access to shared configuration
 * - Entities form the foundation for API communication and authentication
 *
 * Available Entities:
 * - VivedAPIEntity: Manages API configuration, authentication, and environment settings
 */

export * from "./VivedAPIEntity";
