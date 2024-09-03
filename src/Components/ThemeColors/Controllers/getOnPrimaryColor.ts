import { HostAppObjectRepo } from "../../../HostAppObject";
import { Color } from "../../../ValueObjects";
import { HostThemeEntity, ThemeColorType } from "../Entities";

export function getOnPrimaryColor(appObjects: HostAppObjectRepo): Color {
  const theme = HostThemeEntity.get(appObjects);
  if (theme) {
    return theme.getColorForType(ThemeColorType.onPrimary);
  } else {
    appObjects.submitError("getOnPrimaryColor", "Unable to find ThemeColors");
    return Color.RGB(0, 0, 0);
  }
}
