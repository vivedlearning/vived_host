import { HostAppObjectComponent } from './HostAppObjectComponent';
import { HostAppObjectRepo } from './HostAppObjectRepo';

export function getSingletonComponent<T extends HostAppObjectComponent>(
  type: string,
  appObjects: HostAppObjectRepo,
): T | undefined {
  return appObjects.getSingleton<T>(type);
}
