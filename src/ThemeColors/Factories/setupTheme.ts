import { AppObjectRepo } from "@vived/core";
import { vivedDarkThemeData, vivedLightThemeData } from "../Data";
import { makeHostThemeEntity } from "../Entities";
import { makeThemeColorsPM } from "../PM";
import { makeSetThemeUC } from "../UCs";

export function setupTheme(appObjects: AppObjectRepo) {
  const ao = appObjects.getOrCreate("Theme");

  // Entities
  const theme = makeHostThemeEntity(ao);

  // UCs
  const setThemeUC = makeSetThemeUC(ao);

  // PMs
  makeThemeColorsPM(ao);

  theme.submitScheme("light", vivedLightThemeData);
  theme.submitScheme("dark", vivedDarkThemeData);

  setThemeUC.setThemeByName("light"); // Hardcoded for now
}
