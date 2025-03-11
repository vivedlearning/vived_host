import { AppObjectRepo } from "@vived/core";
import { Color } from "@vived/core";
import { HostThemeEntity, ThemeColorType } from "../Entities";

export function getSurfaceColor(appObjects: AppObjectRepo): Color {
  const theme = HostThemeEntity.get(appObjects);
  if (theme) {
    return theme.getColorForType(ThemeColorType.surface);
  } else {
    appObjects.submitError("getSurfaceColor", "Unable to find ThemeColors");
    return Color.RGB(0, 0, 0);
  }
}
