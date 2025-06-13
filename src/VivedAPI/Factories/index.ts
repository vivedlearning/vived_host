/**
 * VivedAPI Factories Index
 * 
 * This module exports all factory functions for the VivedAPI feature.
 * Factory functions provide centralized component creation and feature setup,
 * ensuring proper initialization and component wiring for different environments.
 * 
 * Key Concepts:
 * - Factory functions encapsulate complex component creation workflows
 * - They establish proper dependencies and relationships between components
 * - Factories provide environment-specific setup (sandbox, production, testing)
 * - They ensure singleton registration and component availability
 * - Factory functions serve as entry points for feature initialization
 * 
 * Available Factories:
 * - setupVivedAPIForSandbox: Complete feature setup for sandbox environments
 */

export * from "./setupVivedAPIForSandbox";
