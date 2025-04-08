import { Version } from "@vived/core";
import { AppEntity } from "../Entities";

/**
 * Creates a versioned ID for an app by combining the app ID with its version.
 *
 * This utility function forms a unique identifier that includes both the app ID
 * and version information. This is used to identify specific versions of apps,
 * particularly when loading scripts into the DOM or accessing app interfaces from
 * the window object.
 *
 * The version is formatted by replacing periods with underscores to create a
 * valid JavaScript identifier (e.g., "1.2.3" becomes "1_2_3").
 *
 * @param app - The app entity
 * @param version - The version to include in the ID
 * @returns A string in the format "{appId}-{version_with_underscores}"
 * @example
 * // Returns "myApp-1_2_3" for app.id="myApp" and version="1.2.3"
 * formAppIDWithVersion(app, version)
 */
export function formAppIDWithVersion(app: AppEntity, version: Version) {
  const versionString = version.baseVersionString.split(".").join("_");
  return `${app.id}-${versionString}`;
}
