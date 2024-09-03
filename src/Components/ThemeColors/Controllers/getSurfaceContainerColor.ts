import { HostAppObjectRepo } from "../../../HostAppObject";
import { Color } from "../../../ValueObjects";
import { HostThemeEntity, ThemeColorType } from "../Entities";

export function getSurfaceContainerColor(appObjects: HostAppObjectRepo): Color {
  const theme = HostThemeEntity.get(appObjects);
  if (theme) {
    return theme.getColorForType(ThemeColorType.surfaceContainer);
  } else {
    appObjects.submitError("getSurfaceColor", "Unable to find ThemeColors");
    return Color.RGB(0, 0, 0);
  }
}
