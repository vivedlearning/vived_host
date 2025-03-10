import { AppObjectRepo } from "@vived/core";
import { Color } from "@vived/core";
import { HostThemeEntity, ThemeColorType } from "../Entities";

export function getOnSurfaceColor(appObjects: AppObjectRepo): Color {
  const theme = HostThemeEntity.get(appObjects);
  if (theme) {
    return theme.getColorForType(ThemeColorType.onSurface);
  } else {
    appObjects.submitError("getOnSurfaceColor", "Unable to find ThemeColors");
    return Color.RGB(0, 0, 0);
  }
}
