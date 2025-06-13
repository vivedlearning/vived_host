/**
 * toggleShowArchivedAssets.ts
 * 
 * This controller function toggles the visibility of archived assets in the asset list.
 * It provides a simple interface for users to show or hide archived assets from
 * their asset management workspace.
 * 
 * Key Concepts:
 * - Toggles the display state of archived assets in asset lists
 * - Directly modifies the AppAssetsEntity's showArchived property
 * - Provides error handling for missing components
 * - Triggers immediate UI updates through entity change notifications
 * 
 * Usage Patterns:
 * - Called from UI components with toggle buttons or checkboxes
 * - Used in asset management interfaces for filtering options
 * - Integrated with asset list displays and filter controls
 */

import { AppObjectRepo } from "@vived/core";
import { AppAssetsEntity } from "../Entities/AppAssetsEntity";

/**
 * Toggles the visibility of archived assets in the asset management interface.
 * 
 * This function provides a controller-level interface for toggling archived asset visibility.
 * It flips the current state of the showArchived property, which immediately affects
 * what assets are displayed in asset lists and management interfaces.
 * 
 * @param appObjects - Repository for accessing the AppAssetsEntity that controls visibility
 * @returns void - The function operates synchronously and triggers immediate UI updates
 */
export function toggleShowArchivedAssets(appObjects: AppObjectRepo) {
  const appAssets = AppAssetsEntity.get(appObjects);

  if (appAssets) {
    appAssets.showArchived = !appAssets.showArchived;
  } else {
    appObjects.submitWarning(
      "toggleShowArchivedAssets",
      "Unable to find AppAssetsEntity"
    );
  }
}
