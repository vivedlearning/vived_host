import { Version } from "@vived/core";
import { AppEntity } from "../Entities";

export function formAppIDWithVersion(app: AppEntity, version: Version) {
  const versionString = version.baseVersionString.split(".").join("_");
  return `${app.id}-${versionString}`;
}
