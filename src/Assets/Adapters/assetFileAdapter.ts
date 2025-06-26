// filepath: c:\Users\amosp\Documents\WebGL\vivedlearning_host\src\Assets\Adapters\assetFileAdapter.ts
import { AppObjectRepo, PmAdapter } from "@vived/core";
import {
  AssetFilePM,
  AssetFileVM,
  defaultAssetFileVM
} from "../PMs/AssetFilePM";

/**
 * Adapter for connecting AssetFilePM to UI components
 * Provides the interface for React components to subscribe to AssetFileVM updates
 */
export const assetFileAdapter: PmAdapter<AssetFileVM> = {
  /**
   * Default view model used before subscription is established
   */
  defaultVM: defaultAssetFileVM,

  /**
   * Subscribe a view function to updates from the presentation manager
   *
   * @param id - ID of the asset to observe
   * @param appObjects - Repository of app objects
   * @param setVM - Callback function that will receive view model updates
   */
  subscribe: (
    id: string,
    appObjects: AppObjectRepo,
    setVM: (vm: AssetFileVM) => void
  ) => {
    if (!id) {
      return;
    }
    const pm = AssetFilePM.getByID(id, appObjects);
    if (!pm) {
      appObjects.submitError("assetFileAdapter", "Unable to find AssetFilePM");
      return;
    }
    pm.addView(setVM);
  },

  /**
   * Unsubscribe a view function from updates
   *
   * @param id - ID of the asset to stop observing
   * @param appObjects - Repository of app objects
   * @param setVM - Callback function to remove from updates
   */
  unsubscribe: (
    id: string,
    appObjects: AppObjectRepo,
    setVM: (vm: AssetFileVM) => void
  ) => {
    if (!id) {
      return;
    }
    const pm = AssetFilePM.getByID(id, appObjects);
    if (!pm) {
      appObjects.submitError("assetFileAdapter", "Unable to find AssetFilePM");
      return;
    }
    pm.removeView(setVM);
  }
};
