import { HostAppObjectRepo } from '../../../HostAppObject';
import { AppAssetsEntity } from '../Entities/AppAssetsEntity';

export function toggleShowArchivedAssets(appObjects: HostAppObjectRepo) {
  const appAssets = AppAssetsEntity.get(appObjects);

  if (appAssets) {
    appAssets.showArchived = !appAssets.showArchived;
  } else {
    appObjects.submitWarning('toggleShowArchivedAssets', 'Unable to find AppAssetsEntity');
  }
}
