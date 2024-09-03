import { HostAppObjectRepo } from "../../../HostAppObject";
import { Color } from "../../../ValueObjects";
import { HostThemeEntity, ThemeColorType } from "../Entities";

export function getPrimaryColor(appObjects: HostAppObjectRepo): Color {
  const theme = HostThemeEntity.get(appObjects);
  if (theme) {
    return theme.getColorForType(ThemeColorType.primary);
  } else {
    appObjects.submitError("getPrimaryColor", "Unable to find ThemeColors");
    return Color.RGB(0, 0, 0);
  }
}
