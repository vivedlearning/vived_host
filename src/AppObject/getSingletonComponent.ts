import { AppObjectComponent } from "./AppObjectComponent";
import { AppObjectRepo } from "./AppObjectRepo";

export function getSingletonComponent<T extends AppObjectComponent>(
  type: string,
  appObjects: AppObjectRepo
): T | undefined {
  return appObjects.getSingleton<T>(type);
}
